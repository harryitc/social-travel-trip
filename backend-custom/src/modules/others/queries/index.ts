// Province queries
import { GetProvinceQueryHandler } from './province/get-province.query';
import { QueryProvincesQueryHandler } from './province/query-provinces.query';

// Hashtag queries
import { GetHashtagQueryHandler } from './hashtag/get-hashtag.query';
import { QueryHashtagsQueryHandler } from './hashtag/query-hashtags.query';

// Activity queries
import { GetActivityQueryHandler } from './activity/get-activity.query';
import { QueryActivitiesQueryHandler } from './activity/query-activities.query';

// Category queries
import { GetCategoryQueryHandler } from './category/get-category.query';
import { QueryCategoriesQueryHandler } from './category/query-categories.query';

// City queries
import { GetCityQueryHandler } from './city/get-city.query';
import { QueryCitiesQueryHandler } from './city/query-cities.query';

// Reaction queries
import { GetReactionQueryHandler } from './reaction/get-reaction.query';
import { QueryReactionsQueryHandler } from './reaction/query-reactions.query';

export const QueryHandlers = [
  // Province
  GetProvinceQueryHandler,
  QueryProvincesQueryHandler,
  
  // Hashtag
  GetHashtagQueryHandler,
  QueryHashtagsQueryHandler,
  
  // Activity
  GetActivityQueryHandler,
  QueryActivitiesQueryHandler,
  
  // Category
  GetCategoryQueryHandler,
  QueryCategoriesQueryHandler,
  
  // City
  GetCityQueryHandler,
  QueryCitiesQueryHandler,
  
  // Reaction
  GetReactionQueryHandler,
  QueryReactionsQueryHandler,
];
