import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Activity, Category } from '../types/activity';

interface ActivityContextType {
  activities: Activity[];
  currentActivity: Activity | null;
  addActivity: (activity: Activity) => void;
  updateCurrentActivity: (activity: Activity | null) => void;
  deleteActivity: (id: string) => void;
  getActivitiesForDate: (date: Date) => Activity[];
}

const ActivityContext = createContext<ActivityContextType | undefined>(undefined);

export function ActivityProvider({ children }: { children: ReactNode }) {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [currentActivity, setCurrentActivity] = useState<Activity | null>(null);

  const addActivity = (activity: Activity) => {
    setActivities((prev) => [activity, ...prev]);
  };

  const updateCurrentActivity = (activity: Activity | null) => {
    setCurrentActivity(activity);
  };

  const deleteActivity = (id: string) => {
    setActivities((prev) => prev.filter((a) => a.id !== id));
  };

  const getActivitiesForDate = (date: Date): Activity[] => {
    const targetDate = date.toDateString();
    return activities.filter(
      (activity) => activity.startTime.toDateString() === targetDate
    );
  };

  return (
    <ActivityContext.Provider
      value={{
        activities,
        currentActivity,
        addActivity,
        updateCurrentActivity,
        deleteActivity,
        getActivitiesForDate,
      }}
    >
      {children}
    </ActivityContext.Provider>
  );
}

export function useActivities() {
  const context = useContext(ActivityContext);
  if (context === undefined) {
    throw new Error('useActivities must be used within an ActivityProvider');
  }
  return context;
}
