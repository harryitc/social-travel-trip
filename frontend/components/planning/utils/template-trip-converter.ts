'use client';

import { TravelPlanTemplate } from '../mock-data';
import { TripPlan } from '../../trips/types';

/**
 * Converts a TravelPlanTemplate to a TripPlan format
 * @param template The template to convert
 * @returns A TripPlan object
 */
export function templateToTripPlan(template: TravelPlanTemplate): TripPlan {
  return {
    id: template.id,
    name: template.name,
    destination: template.destination,
    description: template.description,
    duration: template.duration,
    image: template.image,
    tags: template.tags,
    days: template.days,
    authorId: template.authorId,
    authorName: template.authorName,
    isPublic: template.isPublic,
    // Additional TripPlan fields with default values
    region: template.region,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

/**
 * Converts a TripPlan back to a TravelPlanTemplate format
 * @param plan The trip plan to convert
 * @param originalTemplate The original template to preserve specific template fields
 * @returns A TravelPlanTemplate object
 */
export function tripPlanToTemplate(
  plan: TripPlan, 
  originalTemplate: TravelPlanTemplate
): TravelPlanTemplate {
  return {
    id: plan.id,
    name: plan.name,
    destination: plan.destination,
    region: plan.region as 'Miền Bắc' | 'Miền Trung' | 'Miền Nam',
    description: plan.description,
    duration: plan.duration,
    image: plan.image,
    tags: plan.tags,
    days: plan.days,
    authorId: plan.authorId,
    authorName: plan.authorName,
    isPublic: plan.isPublic,
    // Preserve template-specific fields
    rating: originalTemplate.rating,
    usageCount: originalTemplate.usageCount,
  };
}
