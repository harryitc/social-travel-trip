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
  user?: {
    user_id: number;
    username: string;
    avatar_url?: string;
  };
}

export interface SendMessageData {
  group_id: number;
  message: string;
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

      const groupDTO: TripGroupDTO = response;

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

      const groupDTO: TripGroupDTO = response;

      // Map DTO to class instance
      return new TripGroup(groupDTO);
    } catch (error) {
      console.error('Error joining trip group:', error);
      throw error;
    }
  }

  async leaveGroup(groupId: string, userId: string): Promise<void> {
    try {
      await Http.post(`${API_ENDPOINT.social_travel_trip}/group/kick-member`, {
        group_id: parseInt(groupId),
        user_id: parseInt(userId)
      });
    } catch (error) {
      console.error('Error leaving trip group:', error);
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

  async getGroupMembers(groupId: string, page: number = 1, limit: number = 20) {
    try {
      const response:any = await Http.post(`${API_ENDPOINT.social_travel_trip}/group/get-members`, {
        group_id: parseInt(groupId),
        page,
        limit,
      });

      return response;
    } catch (error) {
      console.error('Error fetching group members:', error);
      throw error;
    }
  }

  async generateJoinCode(groupId: string): Promise<string> {
    try {
      const response:any = await Http.post(`${API_ENDPOINT.social_travel_trip}/group/generate-join-qrcode`, {
        group_id: parseInt(groupId),
      });

      return response.join_code;
    } catch (error) {
      console.error('Error generating join code:', error);
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

  async getMessages(groupId: string, page: number = 1, limit: number = 20, beforeId?: number): Promise<{
    messages: TripGroupMessage[];
    hasMore: boolean;
    total: number;
  }> {
    try {
      const body: any = {
        group_id: parseInt(groupId),
        page,
        limit,
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

  async toggleMessageLike(messageId: number): Promise<void> {
    try {
      await Http.post(`${API_ENDPOINT.social_travel_trip}/group/toggle-like`, {
        group_message_id: messageId,
      });
    } catch (error) {
      console.error('Error toggling message like:', error);
      throw error;
    }
  }

  async pinMessage(messageId: number, groupId: string): Promise<void> {
    try {
      await Http.post(`${API_ENDPOINT.social_travel_trip}/group/add-message-pin`, {
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
      await Http.post(`${API_ENDPOINT.social_travel_trip}/group/remove-message-pin`, {
        group_message_id: messageId,
        group_id: parseInt(groupId),
      });
    } catch (error) {
      console.error('Error unpinning message:', error);
      throw error;
    }
  }

  async getMessageReactions(messageId: number): Promise<any[]> {
    try {
      const response:any = await Http.post(`${API_ENDPOINT.social_travel_trip}/group/get-message-reactions`, {
        group_message_id: messageId,
      });

      return response || [];
    } catch (error) {
      console.error('Error fetching message reactions:', error);
      throw error;
    }
  }
}

export const tripGroupService = new TripGroupService();
