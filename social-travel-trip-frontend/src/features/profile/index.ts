// Models
export { UserProfile } from './models/profile.model';

// Services
export { profileService } from './services/profile.service';
export type { 
  UserProfile as UserProfileType,
  UpdateProfilePayload,
  ChangePasswordPayload 
} from './services/profile.service';

// Schemas
export { 
  updateProfileSchema, 
  changePasswordSchema 
} from './schemas/profile.schema';
export type { 
  UpdateProfileFormData, 
  ChangePasswordFormData 
} from './schemas/profile.schema';

// Components
export { ProfileDisplay } from './components/profile-display';
export { EditProfileForm } from './components/edit-profile-form';
export { ChangePasswordForm } from './components/change-password-form';
