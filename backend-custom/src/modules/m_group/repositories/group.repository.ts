import { Injectable, NotFoundException } from '@nestjs/common';
import { CONNECTION_STRING_DEFAULT } from '@configs/databases/postgresql/configuration';
import { PgSQLConnectionPool } from '@libs/persistent/postgresql/connection-pool';
import { PgSQLConnection } from '@libs/persistent/postgresql/postgresql.utils';
import { CreateGroupDto } from '../dto/create-group.dto';
import { SendMessageDto } from '../dto/send-message.dto';
import { GetMessagesDto } from '../dto/get-messages.dto';
import { GetGroupMembersDto } from '../dto/get-group-members.dto';
import { ToggleMessageLikeDto } from '../dto/toggle-message-like.dto';
import { AddMessagePinDto } from '../dto/add-message-pin.dto';
import { RemoveMessagePinDto } from '../dto/remove-message-pin.dto';

@Injectable()
export class GroupRepository {
  constructor(
    @PgSQLConnection(CONNECTION_STRING_DEFAULT)
    private readonly client: PgSQLConnectionPool,
  ) {}

  // Group operations
  async createGroup(data: CreateGroupDto) {
    const { name, description, cover_url, plan_id, status, json_data } = data;
    const params = [
      name,
      description || null,
      cover_url || null,
      status || 'public', // status
      plan_id || null,
      JSON.stringify(json_data || {}), // json_data
    ];

    const query = `
      INSERT INTO groups (
        name, description, cover_url, status, plan_id, json_data, created_at, updated_at
      )
      VALUES ($1, $2, $3, $4, $5, $6, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      RETURNING *
    `;

    return this.client.execute(query, params);
  }

  async createGroupWithJoinCode(data: CreateGroupDto, joinCode: string) {
    const { name, description, cover_url, plan_id, status, json_data } = data;
    const params = [
      name,
      description || null,
      cover_url || null,
      status || 'private', // Use provided status or default to private
      plan_id || null,
      JSON.stringify(json_data || {}), // json_data
      joinCode,
    ];

    const query = `
      INSERT INTO groups (
        name, description, cover_url, status, plan_id, json_data, join_code, created_at, updated_at
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      RETURNING *
    `;

    return this.client.execute(query, params);
  }

  async updateGroup(groupId: number, data: Partial<CreateGroupDto>) {
    const { name, description, cover_url, plan_id, json_data } = data;
    const params = [
      name,
      description,
      cover_url,
      plan_id,
      json_data ? JSON.stringify(json_data) : null,
      groupId,
    ];

    const query = `
      UPDATE groups
      SET
        name = COALESCE($1, name),
        description = COALESCE($2, description),
        cover_url = COALESCE($3, cover_url),
        plan_id = COALESCE($4, plan_id),
        json_data = COALESCE($5, json_data),
        updated_at = CURRENT_TIMESTAMP
      WHERE group_id = $6
      RETURNING *
    `;

    return this.client.execute(query, params);
  }

  async getListGroups(userId: number) {
    const params = [userId];
    const query = `
      SELECT
        g.*,
        (
          SELECT COUNT(*)
          FROM group_members gm
          WHERE gm.group_id = g.group_id
        ) as member_count
      FROM groups g
      WHERE g.group_id IN (
        SELECT group_id FROM group_members WHERE user_id = $1
      )
      ORDER BY g.updated_at DESC
    `;

    return this.client.execute(query, params);
  }

  async getGroupById(groupId: number) {
    const query = `
      SELECT * FROM groups
      WHERE group_id = $1
    `;

    return this.client.execute(query, [groupId]);
  }

  async getGroupByJoinCode(joinCode: string) {
    const query = `
      SELECT * FROM groups
      WHERE join_code = $1
    `;

    return this.client.execute(query, [joinCode]);
  }

  async updateGroupJoinCode(
    groupId: number,
    joinCode: string,
    expiresAt: Date,
  ) {
    const query = `
      UPDATE groups
      SET join_code = $2, join_code_expires_at = $3
      WHERE group_id = $1
      RETURNING *
    `;

    return this.client.execute(query, [groupId, joinCode, expiresAt]);
  }

  async invalidateJoinCode(groupId: number) {
    const query = `
      UPDATE groups
      SET join_code = NULL, join_code_expires_at = NULL
      WHERE group_id = $1
      RETURNING *
    `;

    return this.client.execute(query, [groupId]);
  }

  // Group member operations
  async checkUserExists(userId: number) {
    const query = `
      SELECT user_id FROM users
      WHERE user_id = $1
    `;

    return this.client.execute(query, [userId]);
  }

  async findUserByUsernameOrEmail(usernameOrEmail: string) {
    const query = `
      SELECT user_id, username, email, avatar_url
      FROM users
      WHERE username = $1 OR email = $1
      LIMIT 1
    `;

    return this.client.execute(query, [usernameOrEmail]);
  }

  async addGroupMember(data: {
    group_id: number;
    user_id: number;
    role?: string;
    nickname?: string;
  }) {
    const { group_id, user_id, role, nickname } = data;

    // First check if the user exists and get username for default nickname
    const userExists = await this.checkUserExists(user_id);
    if (userExists.rowCount == 0) {
      throw new NotFoundException(`User with ID ${user_id} not found`);
    }

    // Get user details to use username as default nickname
    const userResult = await this.client.execute(
      'SELECT username FROM users WHERE user_id = $1',
      [user_id],
    );
    const defaultNickname = nickname || userResult.rows[0]?.username;

    const params = [group_id, user_id, role || 'member', defaultNickname];

    const query = `
      INSERT INTO group_members (
        group_id, user_id, role, nickname, join_at
      )
      VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP)
      ON CONFLICT (group_id, user_id) DO UPDATE
      SET
        role = EXCLUDED.role,
        nickname = COALESCE(EXCLUDED.nickname, group_members.nickname)
      RETURNING *
    `;

    return this.client.execute(query, params);
  }

  async getGroupMembers(groupId: number) {
    const query = `
      SELECT * FROM group_members
      WHERE group_id = $1
    `;

    return this.client.execute(query, [groupId]);
  }

  async getGroupMembersWithPagination(data: GetGroupMembersDto) {
    const { group_id, page = 1, limit = 10 } = data;
    const offset = (page - 1) * limit;
    const params = [group_id, limit, offset];

    const query = `
      SELECT gm.*, u.username, u.full_name, u.avatar_url
      FROM group_members gm
      LEFT JOIN users u ON gm.user_id = u.user_id
      WHERE gm.group_id = $1
      ORDER BY
        CASE WHEN gm.role = 'admin' THEN 1
             WHEN gm.role = 'moderator' THEN 2
             ELSE 3
        END,
        gm.join_at ASC
      LIMIT $2 OFFSET $3
    `;

    return this.client.execute(query, params);
  }

  async countGroupMembers(groupId: number) {
    const query = `
      SELECT COUNT(*) as total
      FROM group_members
      WHERE group_id = $1
    `;

    return this.client.execute(query, [groupId]);
  }

  async kickGroupMember(groupId: number, userId: number) {
    const query = `
      DELETE FROM group_members
      WHERE group_id = $1 AND user_id = $2
      RETURNING *
    `;

    return this.client.execute(query, [groupId, userId]);
  }

  async updateGroupMemberRole(groupId: number, userId: number, role: string) {
    const query = `
      UPDATE group_members
      SET role = $3
      WHERE group_id = $1 AND user_id = $2
      RETURNING *
    `;

    return this.client.execute(query, [groupId, userId, role]);
  }

  async updateGroupMemberNickname(
    groupId: number,
    userId: number,
    nickname?: string,
  ) {
    const query = `
      UPDATE group_members
      SET nickname = $3
      WHERE group_id = $1 AND user_id = $2
      RETURNING *
    `;

    return this.client.execute(query, [groupId, userId, nickname]);
  }

  // Message operations
  async sendMessage(data: SendMessageDto, userId: number) {
    const { group_id, message, reply_to_message_id, attachments } = data;

    // Prepare json_data with attachments
    const json_data =
      attachments && attachments.length > 0 ? { attachments } : null;

    let query: string;
    let params: any[];

    if (reply_to_message_id) {
      params = [
        group_id,
        userId,
        message || '',
        reply_to_message_id,
        JSON.stringify(json_data),
      ];
      query = `
        INSERT INTO group_messages (
          group_id, user_id, message, reply_to_message_id, json_data, created_at, updated_at
        )
        VALUES ($1, $2, $3, $4, $5, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
        RETURNING *
      `;
    } else {
      params = [group_id, userId, message || '', JSON.stringify(json_data)];
      query = `
        INSERT INTO group_messages (
          group_id, user_id, message, json_data, created_at, updated_at
        )
        VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
        RETURNING *
      `;
    }

    return this.client.execute(query, params);
  }

  async getMessageWithUserInfo(messageId: number) {
    const query = `
      SELECT
        gm.*,
        u.username,
        u.full_name,
        u.avatar_url,
        -- Get nickname from group_members
        gm_info.nickname,
        -- Reply information
        reply_msg.message as reply_to_message,
        reply_user.username as reply_to_username,
        reply_gm_info.nickname as reply_to_nickname,
        (
          SELECT COUNT(*)
          FROM message_likes ml
          WHERE ml.group_message_id = gm.group_message_id AND ml.reaction_id > 1
        ) as like_count,
        EXISTS (
          SELECT 1
          FROM message_pins mp
          WHERE mp.group_message_id = gm.group_message_id AND mp.group_id = gm.group_id
        ) as is_pinned,
        -- Reactions data as JSON
        (
          SELECT COALESCE(
            json_agg(
              json_build_object(
                'reaction_id', reaction_summary.reaction_id,
                'icon', r.icon,
                'label', r.label,
                'count', reaction_summary.count,
                'users', reaction_summary.users
              )
            ),
            '[]'::json
          )
          FROM (
            SELECT
              ml.reaction_id,
              COUNT(*) as count,
              json_agg(
                json_build_object(
                  'user_id', ml.user_id,
                  'username', u_react.username,
                  'full_name', u_react.full_name,
                  'avatar_url', u_react.avatar_url,
                  'created_at', ml.created_at
                )
              ) as users
            FROM message_likes ml
            LEFT JOIN users u_react ON ml.user_id = u_react.user_id
            WHERE ml.group_message_id = gm.group_message_id AND ml.reaction_id > 1
            GROUP BY ml.reaction_id
          ) reaction_summary
          LEFT JOIN (
            SELECT
              reaction_id,
              name,
              CASE
                WHEN name = 'default' THEN '🚫'
                WHEN name = 'like' THEN '👍'
                WHEN name = 'love' THEN '❤️'
                WHEN name = 'haha' THEN '😄'
                WHEN name = 'wow' THEN '😮'
                WHEN name = 'sad' THEN '😢'
                ELSE '👍'
              END as icon,
              CASE
                WHEN name = 'default' THEN 'Không like'
                WHEN name = 'like' THEN 'Thích'
                WHEN name = 'love' THEN 'Yêu thích'
                WHEN name = 'haha' THEN 'Haha'
                WHEN name = 'wow' THEN 'Wow'
                WHEN name = 'sad' THEN 'Buồn'
                ELSE 'Thích'
              END as label
            FROM reactions
          ) r ON reaction_summary.reaction_id = r.reaction_id
        ) as reactions
      FROM group_messages gm
      LEFT JOIN users u ON gm.user_id = u.user_id
      LEFT JOIN group_members gm_info ON gm.user_id = gm_info.user_id AND gm_info.group_id = gm.group_id
      LEFT JOIN group_messages reply_msg ON gm.reply_to_message_id = reply_msg.group_message_id
      LEFT JOIN users reply_user ON reply_msg.user_id = reply_user.user_id
      LEFT JOIN group_members reply_gm_info ON reply_msg.user_id = reply_gm_info.user_id AND reply_gm_info.group_id = gm.group_id
      WHERE gm.group_message_id = $1
    `;

    return this.client.execute(query, [messageId]);
  }

  async getMessages(data: GetMessagesDto) {
    const { group_id, page = 1, limit = 10, before_id } = data;
    const offset = (page - 1) * limit;
    const params = [group_id, limit, offset];

    let whereClause = '';
    if (before_id) {
      whereClause = 'AND gm.group_message_id < $4';
      params.push(before_id);
    }

    const query = `
      SELECT
        gm.*,
        u.username,
        u.full_name,
        u.avatar_url,
        -- Get nickname from group_members
        gm_info.nickname,
        -- Reply information
        reply_msg.message as reply_to_message,
        reply_user.username as reply_to_username,
        reply_gm_info.nickname as reply_to_nickname,
        (
          SELECT COUNT(*)
          FROM message_likes ml
          WHERE ml.group_message_id = gm.group_message_id AND ml.reaction_id > 1
        ) as like_count,
        EXISTS (
          SELECT 1
          FROM message_pins mp
          WHERE mp.group_message_id = gm.group_message_id AND mp.group_id = gm.group_id
        ) as is_pinned,
        -- Reactions data as JSON
        (
          SELECT COALESCE(
            json_agg(
              json_build_object(
                'reaction_id', reaction_summary.reaction_id,
                'icon', r.icon,
                'label', r.label,
                'count', reaction_summary.count,
                'users', reaction_summary.users
              )
            ),
            '[]'::json
          )
          FROM (
            SELECT
              ml.reaction_id,
              COUNT(*) as count,
              json_agg(
                json_build_object(
                  'user_id', ml.user_id,
                  'username', u_react.username,
                  'full_name', u_react.full_name,
                  'avatar_url', u_react.avatar_url,
                  'created_at', ml.created_at
                )
              ) as users
            FROM message_likes ml
            LEFT JOIN users u_react ON ml.user_id = u_react.user_id
            WHERE ml.group_message_id = gm.group_message_id AND ml.reaction_id > 1
            GROUP BY ml.reaction_id
          ) reaction_summary
          LEFT JOIN (
            SELECT
              reaction_id,
              name,
              CASE
                WHEN name = 'default' THEN '🚫'
                WHEN name = 'like' THEN '👍'
                WHEN name = 'love' THEN '❤️'
                WHEN name = 'haha' THEN '😄'
                WHEN name = 'wow' THEN '😮'
                WHEN name = 'sad' THEN '😢'
                ELSE '👍'
              END as icon,
              CASE
                WHEN name = 'default' THEN 'Không like'
                WHEN name = 'like' THEN 'Thích'
                WHEN name = 'love' THEN 'Yêu thích'
                WHEN name = 'haha' THEN 'Haha'
                WHEN name = 'wow' THEN 'Wow'
                WHEN name = 'sad' THEN 'Buồn'
                ELSE 'Thích'
              END as label
            FROM reactions
          ) r ON reaction_summary.reaction_id = r.reaction_id
        ) as reactions
      FROM group_messages gm
      LEFT JOIN users u ON gm.user_id = u.user_id
      LEFT JOIN group_members gm_info ON gm.user_id = gm_info.user_id AND gm_info.group_id = gm.group_id
      LEFT JOIN group_messages reply_msg ON gm.reply_to_message_id = reply_msg.group_message_id
      LEFT JOIN users reply_user ON reply_msg.user_id = reply_user.user_id
      LEFT JOIN group_members reply_gm_info ON reply_msg.user_id = reply_gm_info.user_id AND reply_gm_info.group_id = gm.group_id
      WHERE gm.group_id = $1 ${whereClause}
      ORDER BY gm.created_at ASC
      LIMIT $2 OFFSET $3
    `;

    return this.client.execute(query, params);
  }

  async countMessages(groupId: number) {
    const query = `
      SELECT COUNT(*) as total
      FROM group_messages
      WHERE group_id = $1
    `;

    return this.client.execute(query, [groupId]);
  }

  // Message like operations
  async toggleMessageLike(data: ToggleMessageLikeDto, userId: number) {
    const { group_message_id, reaction_id } = data;

    const query = `
      INSERT INTO message_likes (group_message_id, user_id, reaction_id)
      VALUES ($1, $2, $3)
      ON CONFLICT (group_message_id, user_id)
      DO UPDATE SET reaction_id = EXCLUDED.reaction_id
      RETURNING *
    `;

    return this.client.execute(query, [group_message_id, userId, reaction_id]);
  }

  async getMessageLikes(messageId: number) {
    const query = `
      SELECT reaction_id, COUNT(*) AS count
      FROM message_likes
      WHERE group_message_id = $1 AND reaction_id > 1
      GROUP BY reaction_id
    `;

    return this.client.execute(query, [messageId]);
  }

  async getMessageReactions(messageId: number) {
    const query = `
      SELECT
        ml.reaction_id,
        COUNT(*) AS count,
        r.name,
        CASE
          WHEN r.name = 'default' THEN '🚫'
          WHEN r.name = 'like' THEN '👍'
          WHEN r.name = 'love' THEN '❤️'
          WHEN r.name = 'haha' THEN '😄'
          WHEN r.name = 'wow' THEN '😮'
          WHEN r.name = 'sad' THEN '😢'
          ELSE '👍'
        END as icon,
        CASE
          WHEN r.name = 'default' THEN 'Không like'
          WHEN r.name = 'like' THEN 'Thích'
          WHEN r.name = 'love' THEN 'Yêu thích'
          WHEN r.name = 'haha' THEN 'Haha'
          WHEN r.name = 'wow' THEN 'Wow'
          WHEN r.name = 'sad' THEN 'Buồn'
          ELSE 'Thích'
        END as label
      FROM message_likes ml
      LEFT JOIN reactions r ON ml.reaction_id = r.reaction_id
      WHERE ml.group_message_id = $1 AND ml.reaction_id > 1
      GROUP BY ml.reaction_id, r.name
      ORDER BY ml.reaction_id
    `;

    return this.client.execute(query, [messageId]);
  }

  async getMessageReactionUsers(messageId: number) {
    const query = `
      SELECT ml.user_id, ml.reaction_id, ml.created_at, u.username, u.full_name, u.avatar_url
      FROM message_likes ml
      JOIN users u ON ml.user_id = u.user_id
      WHERE ml.group_message_id = $1 AND reaction_id > 1
      ORDER BY ml.created_at DESC
    `;

    return this.client.execute(query, [messageId]);
  }

  async getMessageReactionUsersByType(messageId: number, reactionId?: number) {
    let query = `
      SELECT ml.user_id, ml.reaction_id, ml.created_at, u.username, u.full_name, u.avatar_url
      FROM message_likes ml
      JOIN users u ON ml.user_id = u.user_id
      WHERE ml.group_message_id = $1 AND ml.reaction_id > 1
    `;

    const params = [messageId];

    if (reactionId) {
      query += ` AND ml.reaction_id = $2`;
      params.push(reactionId);
    }

    query += ` ORDER BY ml.created_at DESC`;

    return this.client.execute(query, params);
  }

  // Message pin operations
  async checkMessagePinExists(messageId: number, groupId: number) {
    const query = `
      SELECT * FROM message_pins
      WHERE group_message_id = $1 AND group_id = $2
    `;

    return this.client.execute(query, [messageId, groupId]);
  }

  async checkMessageExists(messageId: number) {
    const query = `
      SELECT * FROM group_messages
      WHERE group_message_id = $1
    `;

    return this.client.execute(query, [messageId]);
  }

  async getMessageById(messageId: number) {
    const query = `
      SELECT * FROM group_messages
      WHERE group_message_id = $1
    `;

    return this.client.execute(query, [messageId]);
  }

  async getMessageLikeCount(messageId: number) {
    const query = `
      SELECT COUNT(*) as like_count
      FROM message_likes
      WHERE group_message_id = $1 AND reaction_id > 1
    `;

    return this.client.execute(query, [messageId]);
  }

  async addMessagePin(data: AddMessagePinDto, userId: number) {
    const { group_message_id, group_id } = data;

    const query = `
      INSERT INTO message_pins (
        group_message_id, group_id, user_id, created_at
      )
      VALUES ($1, $2, $3, CURRENT_TIMESTAMP)
      ON CONFLICT (group_id, group_message_id) DO UPDATE
      SET
        user_id = EXCLUDED.user_id,
        created_at = EXCLUDED.created_at
      RETURNING *
    `;

    return this.client.execute(query, [group_message_id, group_id, userId]);
  }

  async removeMessagePin(data: RemoveMessagePinDto) {
    const { group_message_id, group_id } = data;

    const query = `
      DELETE FROM message_pins
      WHERE group_message_id = $1 AND group_id = $2
      RETURNING *
    `;

    return this.client.execute(query, [group_message_id, group_id]);
  }

  async getPinnedMessages(groupId: number) {
    const query = `
      SELECT
        gm.*,
        u.username,
        u.full_name,
        u.avatar_url,
        gm_info.nickname,
        (
          SELECT COUNT(*)
          FROM message_likes ml
          WHERE ml.group_message_id = gm.group_message_id AND ml.reaction_id > 1
        ) as like_count
      FROM group_messages gm
      JOIN message_pins mp ON gm.group_message_id = mp.group_message_id
      LEFT JOIN users u ON gm.user_id = u.user_id
      LEFT JOIN group_members gm_info ON gm.user_id = gm_info.user_id AND gm_info.group_id = mp.group_id
      WHERE mp.group_id = $1
      ORDER BY mp.created_at DESC
    `;

    return this.client.execute(query, [groupId]);
  }
}
