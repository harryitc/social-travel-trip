// Mock database for travel plan templates
import { TravelPlanTemplate } from './mock-data';

// In-memory storage for templates
let templates: TravelPlanTemplate[] = [];

// Initialize with default templates from mock-data
export const initializeTemplates = (defaultTemplates: TravelPlanTemplate[]) => {
  templates = [...defaultTemplates];
};

// Get all templates
export const getAllTemplates = (): TravelPlanTemplate[] => {
  return templates;
};

// Get template by ID
export const getTemplateById = (id: string): TravelPlanTemplate | undefined => {
  return templates.find(template => template.id === id);
};

// Add new template
export const addTemplate = (template: TravelPlanTemplate): TravelPlanTemplate => {
  templates.unshift(template); // Add to beginning of array
  return template;    
};

// Update template
export const updateTemplate = (updatedTemplate: TravelPlanTemplate): TravelPlanTemplate | null => {
  const index = templates.findIndex(template => template.id === updatedTemplate.id);
  if (index === -1) return null;
  
  templates[index] = updatedTemplate;
  return updatedTemplate;
};

// Delete template
export const deleteTemplate = (id: string): boolean => {
  const initialLength = templates.length;
  templates = templates.filter(template => template.id !== id);
  return templates.length < initialLength;
};

// Search templates
export const searchTemplates = (query: string, region?: string): TravelPlanTemplate[] => {
  return templates.filter(template => {
    const matchesRegion = !region || region === 'all' || template.region === region;
    const matchesQuery = 
      query === '' ||
      template.name.toLowerCase().includes(query.toLowerCase()) ||
      template.destination.toLowerCase().includes(query.toLowerCase()) ||
      template.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()));
    
    return matchesRegion && matchesQuery;
  });
};

// Increment usage count
export const incrementUsageCount = (id: string): TravelPlanTemplate | null => {
  const index = templates.findIndex(template => template.id === id);
  if (index === -1) return null;
  
  templates[index] = {
    ...templates[index],
    usageCount: templates[index].usageCount + 1
  };
  
  return templates[index];
};

// Update template rating
export const updateTemplateRating = (id: string, rating: number): TravelPlanTemplate | null => {
  const index = templates.findIndex(template => template.id === id);
  if (index === -1) return null;
  
  templates[index] = {
    ...templates[index],
    rating
  };
  
  return templates[index];
};
