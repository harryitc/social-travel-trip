import { TripGroup, CreateTripGroupData, JoinTripGroupData } from '../models/trip-group.model';

class TripGroupService {
  private baseUrl = '/api/trip-groups';

  async getAllGroups(): Promise<TripGroup[]> {
    try {
      const response = await fetch(this.baseUrl);
      if (!response.ok) {
        throw new Error('Failed to fetch trip groups');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching trip groups:', error);
      throw error;
    }
  }

  async getGroupById(id: string): Promise<TripGroup> {
    try {
      const response = await fetch(`${this.baseUrl}/${id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch trip group');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching trip group:', error);
      throw error;
    }
  }

  async createGroup(data: CreateTripGroupData): Promise<TripGroup> {
    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        throw new Error('Failed to create trip group');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error creating trip group:', error);
      throw error;
    }
  }

  async joinGroup(data: JoinTripGroupData): Promise<TripGroup> {
    try {
      const response = await fetch(`${this.baseUrl}/join`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        throw new Error('Failed to join trip group');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error joining trip group:', error);
      throw error;
    }
  }

  async leaveGroup(groupId: string, userId: string): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/${groupId}/leave`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to leave trip group');
      }
    } catch (error) {
      console.error('Error leaving trip group:', error);
      throw error;
    }
  }

  async searchGroups(query: string): Promise<TripGroup[]> {
    try {
      const response = await fetch(`${this.baseUrl}/search?q=${encodeURIComponent(query)}`);
      if (!response.ok) {
        throw new Error('Failed to search trip groups');
      }
      return await response.json();
    } catch (error) {
      console.error('Error searching trip groups:', error);
      throw error;
    }
  }

  async getUserGroups(userId: string): Promise<TripGroup[]> {
    try {
      const response = await fetch(`${this.baseUrl}/user/${userId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch user trip groups');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching user trip groups:', error);
      throw error;
    }
  }
}

export const tripGroupService = new TripGroupService();
