// Province commands
import { CreateProvinceCommandHandler } from './province/create-province.command';
import { UpdateProvinceCommandHandler } from './province/update-province.command';
import { DeleteProvinceCommandHandler } from './province/delete-province.command';

// Hashtag commands
import { CreateHashtagCommandHandler } from './hashtag/create-hashtag.command';
import { UpdateHashtagCommandHandler } from './hashtag/update-hashtag.command';
import { DeleteHashtagCommandHandler } from './hashtag/delete-hashtag.command';
import { CreateIfNotExistsHashtagCommandHandler } from './hashtag/create-if-not-exists-hashtag.command';

// Activity commands
import { CreateActivityCommandHandler } from './activity/create-activity.command';
import { UpdateActivityCommandHandler } from './activity/update-activity.command';
import { DeleteActivityCommandHandler } from './activity/delete-activity.command';
import { CreateIfNotExistsActivityCommandHandler } from './activity/create-if-not-exists-activity.command';

// Category commands
import { CreateCategoryCommandHandler } from './category/create-category.command';
import { UpdateCategoryCommandHandler } from './category/update-category.command';
import { DeleteCategoryCommandHandler } from './category/delete-category.command';
import { CreateIfNotExistsCategoryCommandHandler } from './category/create-if-not-exists-category.command';

// City commands
import { CreateCityCommandHandler } from './city/create-city.command';
import { UpdateCityCommandHandler } from './city/update-city.command';
import { DeleteCityCommandHandler } from './city/delete-city.command';

// Reaction commands
import { CreateReactionCommandHandler } from './reaction/create-reaction.command';
import { UpdateReactionCommandHandler } from './reaction/update-reaction.command';
import { DeleteReactionCommandHandler } from './reaction/delete-reaction.command';

export const CommandHandlers = [
  // Province
  CreateProvinceCommandHandler,
  UpdateProvinceCommandHandler,
  DeleteProvinceCommandHandler,
  
  // Hashtag
  CreateHashtagCommandHandler,
  UpdateHashtagCommandHandler,
  DeleteHashtagCommandHandler,
  CreateIfNotExistsHashtagCommandHandler,
  
  // Activity
  CreateActivityCommandHandler,
  UpdateActivityCommandHandler,
  DeleteActivityCommandHandler,
  CreateIfNotExistsActivityCommandHandler,
  
  // Category
  CreateCategoryCommandHandler,
  UpdateCategoryCommandHandler,
  DeleteCategoryCommandHandler,
  CreateIfNotExistsCategoryCommandHandler,
  
  // City
  CreateCityCommandHandler,
  UpdateCityCommandHandler,
  DeleteCityCommandHandler,
  
  // Reaction
  CreateReactionCommandHandler,
  UpdateReactionCommandHandler,
  DeleteReactionCommandHandler,
];
