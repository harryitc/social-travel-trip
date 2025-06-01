'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { TravelPlanTemplate, Activity } from '../mock-data';

type SaveState = 'idle' | 'saving' | 'saved' | 'error';

interface TemplateContextType {
  template: TravelPlanTemplate | null;
  originalTemplate: TravelPlanTemplate | null;
  isEditing: boolean;
  setIsEditing: (isEditing: boolean) => void;
  saveState: SaveState;
  lastSaved: Date | null;
  saveError: Error | null;
  updateTemplate: (updates: Partial<TravelPlanTemplate>) => void;
  updateActivities: (dayIndex: number, activities: Activity[]) => void;
  saveTemplate: () => Promise<void>;
  revertChanges: () => void;
  hasUnsavedChanges: boolean;
}

const TemplateContext = createContext<TemplateContextType | undefined>(undefined);

export function TemplateProvider({
  children,
  initialTemplate
}: {
  children: ReactNode;
  initialTemplate: TravelPlanTemplate;
}) {
  const [template, setTemplate] = useState<TravelPlanTemplate>(initialTemplate);
  const [originalTemplate, setOriginalTemplate] = useState<TravelPlanTemplate>(initialTemplate);
  const [isEditing, setIsEditing] = useState(false);
  const [saveState, setSaveState] = useState<SaveState>('idle');
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [saveError, setSaveError] = useState<Error | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Reset context when template changes
  useEffect(() => {
    setTemplate(initialTemplate);
    setOriginalTemplate(initialTemplate);
    setIsEditing(false);
    setSaveState('idle');
    setLastSaved(null);
    setSaveError(null);
    setHasUnsavedChanges(false);
  }, [initialTemplate]);

  // Check for unsaved changes
  useEffect(() => {
    const hasChanges = JSON.stringify(template) !== JSON.stringify(originalTemplate);
    setHasUnsavedChanges(hasChanges);
  }, [template, originalTemplate]);

  // Update template with partial data
  const updateTemplate = (updates: Partial<TravelPlanTemplate>) => {
    setTemplate(prev => {
      if (!prev) return prev;
      return { ...prev, ...updates };
    });
    
    // Auto-save after a delay
    if (isEditing) {
      setSaveState('saving');
      const timer = setTimeout(() => {
        saveTemplate();
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  };

  // Update activities for a specific day
  const updateActivities = (dayIndex: number, activities: Activity[]) => {
    setTemplate(prev => {
      if (!prev) return prev;
      
      const updatedDays = [...prev.days];
      updatedDays[dayIndex] = {
        ...updatedDays[dayIndex],
        activities
      };
      
      return {
        ...prev,
        days: updatedDays
      };
    });
    
    // Auto-save after a delay
    if (isEditing) {
      setSaveState('saving');
      const timer = setTimeout(() => {
        saveTemplate();
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  };

  // Save template to server/storage
  const saveTemplate = async () => {
    if (!template) return;
    
    setSaveState('saving');
    setSaveError(null);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update original template after successful save
      setOriginalTemplate(template);
      setSaveState('saved');
      setLastSaved(new Date());
      
      // Reset to idle after a delay
      setTimeout(() => {
        setSaveState('idle');
      }, 3000);
    } catch (error) {
      setSaveState('error');
      setSaveError(error instanceof Error ? error : new Error('Unknown error'));
    }
    
    return Promise.resolve();
  };

  // Revert changes to original template
  const revertChanges = () => {
    setTemplate(originalTemplate);
    setSaveState('idle');
    setSaveError(null);
  };

  return (
    <TemplateContext.Provider
      value={{
        template,
        originalTemplate,
        isEditing,
        setIsEditing,
        saveState,
        lastSaved,
        saveError,
        updateTemplate,
        updateActivities,
        saveTemplate,
        revertChanges,
        hasUnsavedChanges
      }}
    >
      {children}
    </TemplateContext.Provider>
  );
}

export function useTemplate() {
  const context = useContext(TemplateContext);
  if (context === undefined) {
    throw new Error('useTemplate must be used within a TemplateProvider');
  }
  return context;
}
