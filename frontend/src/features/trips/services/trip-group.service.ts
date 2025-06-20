import Http from '@/lib/http';
import { API_ENDPOINT } from '@/config/api.config';
import {
  TripGroup,
  TripGroupDTO,
  CreateTripGroupData,
  JoinTripGroupData
} from '../models/trip-group.model';

// Message related interfaces
export interface TripGroupMessage {
  group_message_id: number;
  group_id: number;
  user_id: number;
  message: string;
  created_at: string;
  updated_at: string;
  like_count?: number;
  is_pinned?: boolean;
  json_data?: any; // For storing attachments and other metadata
  // Reactions information
  reactions?: Array<{
    reaction_id: number;
    count: number;
    icon?: string;
    label?: string;
    users?: Array<{
      user_id: number;
      username: string;
      full_name: string;
      avatar_url: string;
      created_at: string;
    }>;
  }>;
  // Reply information
  reply_to_message_id?: number;
  reply_to_message?: string;
  reply_to_username?: string;
  reply_to_nickname?: string;
  // User information from join query (direct fields)
  username?: string;
  full_name?: string;
  nickname?: string;
  avatar_url?: string;
  // Attachments information
  attachments?: Array<{
    type: 'image' | 'file';
    url: string;
    name: string;
    size?: number;
  }>;
  // Legacy nested user object (for backward compatibility)
  user?: {
    user_id: number;
    username: string;
    avatar_url?: string;
  };
}

export interface SendMessageData {
  group_id: number;
  message: string;
  reply_to_message_id?: number;
  attachments?: Array<{
    type: 'image' | 'file';
    url: string;
    name: string;
    size?: number;
  }>;
}

class TripGroupService {

  // Group operations
  async getAllGroups(): Promise<TripGroup[]> {
    try {
      const response:any = await Http.get(`${API_ENDPOINT.social_travel_trip}/group/get-list`);
      const groupDTOs: TripGroupDTO[] = response || [];

      // Map DTOs to class instances
      return groupDTOs.map(dto => new TripGroup(dto));
    } catch (error) {
      console.error('Error fetching trip groups:', error);
      throw error;
    }
  }

  async getGroupById(id: string): Promise<TripGroup> {
    try {
      const response:any = await Http.post(`${API_ENDPOINT.social_travel_trip}/group/get-details`, {
        group_id: parseInt(id)
      });

      console.log('🔍 [TripGroupService] getGroupById response:', response);

      // The response includes member_count from the backend
      const groupDTO: TripGroupDTO = {
        ...response,
        members: {
          count: response.member_count || 0,
          max: 10, // Default max
          list: [] // We don't need the full list for group updates
        }
      };

      console.log('🔍 [TripGroupService] Mapped groupDTO:', groupDTO);

      // Map DTO to class instance
      return new TripGroup(groupDTO);
    } catch (error) {
      console.error('Error fetching trip group:', error);
      throw error;
    }
  }

  async createGroup(data: CreateTripGroupData): Promise<TripGroup> {
    try {
      const payload = data.toBackendDTO();
      console.log('Sending create group request to:', `${API_ENDPOINT.social_travel_trip}/group/create`);
      console.log('Payload:', payload);

      const response:any = await Http.post(`${API_ENDPOINT.social_travel_trip}/group/create`, payload);
      console.log('Create group response:', response);

      const groupDTO: TripGroupDTO = response;

      // Map DTO to class instance
      return new TripGroup(groupDTO);
    } catch (error: any) {
      console.error('Error creating trip group:', error);
      console.error('Error response:', error.response);
      throw error;
    }
  }

  async joinGroup(data: JoinTripGroupData): Promise<TripGroup> {
    try {
      const response:any = await Http.post(`${API_ENDPOINT.social_travel_trip}/group/join-by-code`, data.toBackendDTO());

      console.log('🔍 [TripGroupService] Join group response:', response);

      // The response now contains full group information
      const groupDTO: TripGroupDTO = response;

      // Map DTO to class instance
      return new TripGroup(groupDTO);
    } catch (error) {
      console.error('Error joining trip group:', error);
      throw error;
    }
  }

  async addMember(groupId: string, userId: string, role: string = 'member'): Promise<void> {
    try {
      await Http.post(`${API_ENDPOINT.social_travel_trip}/group/add-member`, {
        group_id: parseInt(groupId),
        user_id: parseInt(userId),
        role,
      });
    } catch (error) {
      console.error('Error adding member to group:', error);
      throw error;
    }
  }

  async getGroupMembers(groupId: string, page: number = 1, limit: number = 100) {
    try {
      const response:any = await Http.post(`${API_ENDPOINT.social_travel_trip}/group/get-members`, {
        group_id: parseInt(groupId),
        page,
        limit,
      });

      // Map backend response to frontend format
      if (response && response.members) {
        const mappedMembers = response.members.map((member: any) => ({
          group_member_id: member.group_member_id,
          group_id: member.group_id,
          user_id: member.user_id,
          nickname: member.nickname,
          role: member.role,
          join_at: member.join_at,
          // Map user info - now properly available from backend
          username: member.username,
          full_name: member.full_name,
          avatar_url: member.avatar_url,
          // Computed fields for UI compatibility - prioritize nickname
          name: member.nickname || member.username || 'Unknown User',
          avatar: member.avatar_url || 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=120&h=120&dpr=1',
          isAdmin: () => member.role === 'admin'
        }));

        return {
          ...response,
          members: mappedMembers
        };
      }

      return response;
    } catch (error) {
      console.error('Error fetching group members:', error);
      throw error;
    }
  }

  async generateJoinCode(groupId: string): Promise<any> {
    try {
      const response:any = await Http.post(`${API_ENDPOINT.social_travel_trip}/group/generate-join-qrcode`, {
        group_id: parseInt(groupId),
      });

      return response; // Return full response with QR data
    } catch (error) {
      console.error('Error generating join code:', error);
      throw error;
    }
  }

  // Group management APIs
  async updateGroup(data: {
    group_id: number;
    name?: string;
    description?: string;
    cover_url?: string;
    plan_id?: number;
    json_data?: any;
  }): Promise<TripGroup> {
    try {
      const response: any = await Http.post(`${API_ENDPOINT.social_travel_trip}/group/update`, data);
      return new TripGroup(response);
    } catch (error) {
      console.error('Error updating group:', error);
      throw error;
    }
  }

  async kickMember(data: { group_id: number; user_id: number }): Promise<any> {
    try {
      const response: any = await Http.post(`${API_ENDPOINT.social_travel_trip}/group/kick-member`, data);
      return response;
    } catch (error) {
      console.error('Error kicking member:', error);
      throw error;
    }
  }

  async updateMemberRole(data: { group_id: number; user_id: number; role: string }): Promise<any> {
    try {
      const response: any = await Http.post(`${API_ENDPOINT.social_travel_trip}/group/update-member-role`, data);
      return response;
    } catch (error) {
      console.error('Error updating member role:', error);
      throw error;
    }
  }

  async updateMemberNickname(data: { group_id: number; user_id: number; nickname?: string }): Promise<any> {
    try {
      const response: any = await Http.post(`${API_ENDPOINT.social_travel_trip}/group/update-member-nickname`, data);
      return response;
    } catch (error) {
      console.error('Error updating member nickname:', error);
      throw error;
    }
  }

  async inviteMember(data: {
    groupId: string;
    usernameOrEmail: string;
    role: string;
    nickname?: string;
  }): Promise<any> {
    try {
      const response:any = await Http.post(`${API_ENDPOINT.social_travel_trip}/group/invite-member`, {
        group_id: parseInt(data.groupId),
        username_or_email: data.usernameOrEmail,
        role: data.role,
        nickname: data.nickname,
      });

      return response;
    } catch (error) {
      console.error('Error inviting member:', error);
      throw error;
    }
  }

  async leaveGroup(data: {
    group_id: number;
  }): Promise<any> {
    try {
      const response: any = await Http.post(`${API_ENDPOINT.social_travel_trip}/group/leave-group`, data);
      return response;
    } catch (error) {
      console.error('Error leaving group:', error);
      throw error;
    }
  }

  // Message operations
  async sendMessage(data: SendMessageData): Promise<TripGroupMessage> {
    try {
      const response:any = await Http.post(`${API_ENDPOINT.social_travel_trip}/group/send-message`, data);
      return response;
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  }

  async getMessages(groupId: string, limit: number = 10, beforeId?: number): Promise<{
    messages: TripGroupMessage[];
    hasMore: boolean;
    total: number;
  }> {
    try {
      const body: any = {
        group_id: parseInt(groupId),
        limit: limit
      };

      if (beforeId) {
        body.before_id = beforeId;
      }

      console.log('Calling getMessages API with URL:', `${API_ENDPOINT.social_travel_trip}/group/get-messages`);
      console.log('Request body:', body);

      const response:any = await Http.post(`${API_ENDPOINT.social_travel_trip}/group/get-messages`, body);
      console.log('getMessages API response:', response);

      return response;
    } catch (error) {
      console.error('Error fetching messages:', error);
      throw error;
    }
  }

  async toggleMessageLike(messageId: number, reactionId: number = 2): Promise<void> {
    try {
      await Http.post(`${API_ENDPOINT.social_travel_trip}/group/messages/like`, {
        group_message_id: messageId,
        reaction_id: reactionId, // 1 = no like, 2 = like, etc.
      });
    } catch (error) {
      console.error('Error toggling message like:', error);
      throw error;
    }
  }

  async pinMessage(messageId: number, groupId: string): Promise<void> {
    try {
      await Http.post(`${API_ENDPOINT.social_travel_trip}/group/messages/add-pin`, {
        group_message_id: messageId,
        group_id: parseInt(groupId),
      });
    } catch (error) {
      console.error('Error pinning message:', error);
      throw error;
    }
  }

  async unpinMessage(messageId: number, groupId: string): Promise<void> {
    try {
      await Http.post(`${API_ENDPOINT.social_travel_trip}/group/messages/remove-pin`, {
        group_message_id: messageId,
        group_id: parseInt(groupId),
      });
    } catch (error) {
      console.error('Error unpinning message:', error);
      throw error;
    }
  }

  async getMessageReactions(messageId: number): Promise<{
    total: number;
    reactions: Array<{ reaction_id: number; count: number }>;
    users: Array<{
      user_id: number;
      username: string;
      full_name: string;
      avatar_url: string;
      reaction_id: number;
      created_at: string;
    }>;
    message_id: number;
  }> {
    try {
      const response:any = await Http.post(`${API_ENDPOINT.social_travel_trip}/group/messages/get-reactions`, {
        group_message_id: messageId,
      });

      return response || { total: 0, reactions: [], users: [], message_id: messageId };
    } catch (error) {
      console.error('Error fetching message reactions:', error);
      throw error;
    }
  }

  async getMessageReactionUsers(messageId: number, reactionId?: number): Promise<{
    data: Array<{
      user_id: number;
      username: string;
      full_name: string;
      avatar_url: string;
      reaction_id: number;
      created_at: string;
    }>;
    meta: {
      total: number;
      message_id: number;
      reaction_id: number | null;
    };
  }> {
    try {
      const body: any = { group_message_id: messageId };
      if (reactionId) {
        body.reaction_id = reactionId;
      }

      const response:any = await Http.post(`${API_ENDPOINT.social_travel_trip}/group/messages/reaction-users`, body);

      return response || { data: [], meta: { total: 0, message_id: messageId, reaction_id: reactionId || null } };
    } catch (error) {
      console.error('Error fetching message reaction users:', error);
      throw error;
    }
  }
}

export const tripGroupService = new TripGroupService();
