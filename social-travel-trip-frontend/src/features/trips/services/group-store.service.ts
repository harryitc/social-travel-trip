import { useGroupStore } from '@/features/stores/event.store';
import { tripGroupService } from './trip-group.service';
import { TripGroup } from '../models/trip-group.model';

/**
 * Service để quản lý việc load và cập nhật group store
 * Tránh việc reload không cần thiết
 */
class GroupStoreService {
  private static instance: GroupStoreService;
  private isLoading = false;
  private hasLoaded = false;

  static getInstance(): GroupStoreService {
    if (!GroupStoreService.instance) {
      GroupStoreService.instance = new GroupStoreService();
    }
    return GroupStoreService.instance;
  }

  /**
   * Load groups từ API và cập nhật store
   * Chỉ load một lần hoặc khi force reload
   */
  async loadGroups(forceReload = false): Promise<TripGroup[]> {
    const store = useGroupStore.getState();
    
    // Nếu đã load và không force reload thì return groups hiện tại
    if (this.hasLoaded && !forceReload && store.groups.length > 0) {
      console.log('📋 [GroupStoreService] Groups already loaded, returning cached data');
      return store.groups;
    }

    // Nếu đang loading thì đợi
    if (this.isLoading) {
      console.log('📋 [GroupStoreService] Already loading, waiting...');
      return new Promise((resolve) => {
        const checkLoading = () => {
          if (!this.isLoading) {
            resolve(store.groups);
          } else {
            setTimeout(checkLoading, 100);
          }
        };
        checkLoading();
      });
    }

    try {
      this.isLoading = true;
      store.setLoading(true);
      
      console.log('📋 [GroupStoreService] Loading groups from API...');
      const groups = await tripGroupService.getAllGroups();
      
      console.log('✅ [GroupStoreService] Groups loaded:', groups.length, 'groups');
      store.setGroups(groups);
      this.hasLoaded = true;
      
      return groups;
    } catch (error) {
      console.error('❌ [GroupStoreService] Error loading groups:', error);
      throw error;
    } finally {
      this.isLoading = false;
      store.setLoading(false);
    }
  }

  /**
   * Thêm group mới vào store (hoặc cập nhật nếu đã tồn tại)
   */
  addGroup(group: TripGroup): void {
    const store = useGroupStore.getState();
    const existingGroup = store.groups.find(g => g.id === group.id);

    if (existingGroup) {
      console.log('📝 [GroupStoreService] Group already exists, updating:', group.title);
      store.updateGroup(group);
    } else {
      console.log('✅ [GroupStoreService] Adding new group to store:', group.title);
      store.addGroup(group);
    }
  }

  /**
   * Cập nhật group trong store
   */
  updateGroup(group: TripGroup): void {
    const store = useGroupStore.getState();
    store.updateGroup(group);
    console.log('✅ [GroupStoreService] Group updated in store:', group.title);
  }

  /**
   * Xóa group khỏi store
   */
  removeGroup(groupId: string): void {
    const store = useGroupStore.getState();
    store.removeGroup(groupId);
    console.log('✅ [GroupStoreService] Group removed from store:', groupId);
  }

  /**
   * Set selected group
   */
  setSelectedGroup(groupId: string): void {
    const store = useGroupStore.getState();
    store.setSelectedGroupId(groupId);
    console.log('🎯 [GroupStoreService] Selected group set:', groupId);
  }

  /**
   * Get current groups from store
   */
  getGroups(): TripGroup[] {
    return useGroupStore.getState().groups;
  }

  /**
   * Get selected group ID from store
   */
  getSelectedGroupId(): string {
    return useGroupStore.getState().selectedGroupId;
  }

  /**
   * Check if loading
   */
  isLoadingGroups(): boolean {
    return useGroupStore.getState().loading;
  }

  /**
   * Reset store (for testing or logout)
   */
  reset(): void {
    const store = useGroupStore.getState();
    store.setGroups([]);
    store.setSelectedGroupId('');
    store.setLoading(false);
    this.hasLoaded = false;
    this.isLoading = false;
    console.log('🔄 [GroupStoreService] Store reset');
  }
}

export const groupStoreService = GroupStoreService.getInstance();
