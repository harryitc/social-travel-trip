'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { TripPlan, Activity, SaveState } from '../types';

interface TripPlanContextType {
  plan: TripPlan | null;
  originalPlan: TripPlan | null;
  isEditing: boolean;
  setIsEditing: (isEditing: boolean) => void;
  saveState: SaveState;
  lastSaved: Date | null;
  saveError: Error | null;
  updatePlan: (updates: Partial<TripPlan>) => void;
  updateActivities: (dayIndex: number, activities: Activity[]) => void;
  savePlan: () => Promise<void>;
  revertChanges: () => void;
  hasUnsavedChanges: boolean;
}

const TripPlanContext = createContext<TripPlanContextType | undefined>(undefined);

export function TripPlanProvider({
  children,
  initialPlan,
  onSave
}: {
  children: ReactNode;
  initialPlan: TripPlan;
  onSave?: (plan: TripPlan) => Promise<void>;
}) {
  const [plan, setPlan] = useState<TripPlan>(initialPlan);
  const [originalPlan, setOriginalPlan] = useState<TripPlan>(initialPlan);
  const [isEditing, setIsEditing] = useState(false);
  const [saveState, setSaveState] = useState<SaveState>('idle');
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [saveError, setSaveError] = useState<Error | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Reset context when plan changes
  useEffect(() => {
    setPlan(initialPlan);
    setOriginalPlan(initialPlan);
    setIsEditing(false);
    setSaveState('idle');
    setLastSaved(null);
    setSaveError(null);
    setHasUnsavedChanges(false);
  }, [initialPlan]);

  // Check for unsaved changes
  useEffect(() => {
    const hasChanges = JSON.stringify(plan) !== JSON.stringify(originalPlan);
    setHasUnsavedChanges(hasChanges);
  }, [plan, originalPlan]);

  // Update plan with partial data
  const updatePlan = (updates: Partial<TripPlan>) => {
    setPlan(prev => {
      if (!prev) return prev;
      return { ...prev, ...updates };
    });

    // Không tự động lưu, chỉ cập nhật trạng thái
    if (isEditing) {
      // Đánh dấu có thay đổi chưa lưu
      setSaveState('idle');
    }
  };

  // Update activities for a specific day
  const updateActivities = (dayIndex: number, activities: Activity[]) => {
    setPlan(prev => {
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

    // Không tự động lưu, chỉ cập nhật trạng thái
    if (isEditing) {
      // Đánh dấu có thay đổi chưa lưu
      setSaveState('idle');
    }
  };

  // Save plan to server/storage
  const savePlan = async () => {
    if (!plan) return;

    setSaveState('saving');
    setSaveError(null);

    try {
      // Call the onSave callback if provided
      if (onSave) {
        await onSave(plan);
      } else {
        // Simulate API call if no callback provided
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      // Update original plan after successful save
      setOriginalPlan(plan);
      setSaveState('saved');
      setLastSaved(new Date());

      // Reset to idle after a delay
      setTimeout(() => {
        setSaveState('idle');
      }, 3000);

      // Return the current plan for external use
      return plan;
    } catch (error) {
      setSaveState('error');
      setSaveError(error instanceof Error ? error : new Error('Unknown error'));
      throw error;
    }
  };

  // Revert changes to original plan
  const revertChanges = () => {
    setPlan(originalPlan);
    setSaveState('idle');
    setSaveError(null);
  };

  return (
    <TripPlanContext.Provider
      value={{
        plan,
        originalPlan,
        isEditing,
        setIsEditing,
        saveState,
        lastSaved,
        saveError,
        updatePlan,
        updateActivities,
        savePlan,
        revertChanges,
        hasUnsavedChanges
      }}
    >
      {children}
    </TripPlanContext.Provider>
  );
}

export function useTripPlan() {
  const context = useContext(TripPlanContext);
  if (context === undefined) {
    throw new Error('useTripPlan must be used within a TripPlanProvider');
  }
  return context;
}
