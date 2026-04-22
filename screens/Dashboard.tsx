import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useState, useEffect } from 'react';
import { Activity, Category } from '../types/activity';
import { CATEGORY_COLORS, CATEGORY_EMOJIS } from '../constants/categories';
import { formatDuration, formatTime } from '../utils/formatters';
import ActivityInputCard from '../components/ActivityInputCard';
import RunningActivityCard from '../components/RunningActivityCard';

export default function Dashboard() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [currentActivity, setCurrentActivity] = useState<Activity | null>(null);
  const [activityTitle, setActivityTitle] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category>('work');
  const [elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (currentActivity) {
      interval = setInterval(() => {
        const elapsed = Math.floor((Date.now() - currentActivity.startTime.getTime()) / 1000);
        setElapsedTime(elapsed);
      }, 1000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [currentActivity]);

  const startActivity = () => {
    if (!activityTitle.trim()) {
      Alert.alert('Error', 'Please enter an activity name');
      return;
    }

    const newActivity: Activity = {
      id: Date.now().toString(),
      title: activityTitle,
      startTime: new Date(),
      category: selectedCategory,
    };

    setCurrentActivity(newActivity);
    setActivityTitle('');
    setElapsedTime(0);
  };

  const stopActivity = () => {
    if (!currentActivity) return;

    const endTime = new Date();
    const duration = Math.floor((endTime.getTime() - currentActivity.startTime.getTime()) / 1000);

    const completedActivity: Activity = {
      ...currentActivity,
      endTime,
      duration,
    };

    setActivities([completedActivity, ...activities]);
    setCurrentActivity(null);
    setElapsedTime(0);
  };

  const deleteActivity = (id: string) => {
    setActivities(activities.filter(a => a.id !== id));
  };

  const getTotalTimeByCategory = (): Record<Category, number> => {
    const totals: Record<Category, number> = {
      work: 0,
      exercise: 0,
      social: 0,
      learning: 0,
      entertainment: 0,
      other: 0,
    };

    activities.forEach(activity => {
      if (activity.duration) {
        totals[activity.category as Category] += activity.duration;
      }
    });

    return totals;
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      
      <View style={styles.header}>
        <Text style={styles.title}>Activity Tracker</Text>
        <Text style={styles.subtitle}>Record your daily activities</Text>
      </View>

      {!currentActivity ? (
        <ActivityInputCard
          activityTitle={activityTitle}
          onActivityTitleChange={setActivityTitle}
          selectedCategory={selectedCategory}
          onCategorySelect={setSelectedCategory}
          onStartActivity={startActivity}
        />
      ) : (
        <RunningActivityCard
          activity={currentActivity}
          elapsedTime={elapsedTime}
          onStopActivity={stopActivity}
        />
      )}

      <View style={styles.statsContainer}>
        <Text style={styles.statsTitle}>Today's Summary</Text>
        <View style={styles.statsGrid}>
          {(Object.entries(getTotalTimeByCategory()) as [Category, number][]).map(([category, duration]) => (
            duration > 0 && (
              <View key={category} style={styles.statItem}>
                <Text style={styles.statEmoji}>{CATEGORY_EMOJIS[category]}</Text>
                <Text style={styles.statDuration}>{formatDuration(duration)}</Text>
              </View>
            )
          ))}
        </View>
      </View>

      <ScrollView style={styles.activitiesList} contentContainerStyle={styles.activitiesContent}>
        <Text style={styles.listTitle}>Recent Activities</Text>
        {activities.map((activity) => (
          <View key={activity.id} style={styles.activityCard}>
            <View style={[styles.activityIndicator, { backgroundColor: CATEGORY_COLORS[activity.category as Category] }]} />
            <View style={styles.activityContent}>
              <Text style={styles.activityTitle}>
                {CATEGORY_EMOJIS[activity.category as Category]} {activity.title}
              </Text>
              <Text style={styles.activityTime}>
                {formatTime(activity.startTime)} - {activity.endTime && formatTime(activity.endTime)}
              </Text>
              <Text style={styles.activityDuration}>{activity.duration && formatDuration(activity.duration)}</Text>
            </View>
            <TouchableOpacity onPress={() => deleteActivity(activity.id)} style={styles.deleteButton}>
              <Text style={styles.deleteButtonText}>✕</Text>
            </TouchableOpacity>
          </View>
        ))}
        {activities.length === 0 && (
          <Text style={styles.emptyText}>No activities recorded yet</Text>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    paddingTop: 60,
  },
  header: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
  },
  statsContainer: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 12,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  statItem: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statEmoji: {
    fontSize: 20,
  },
  statDuration: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
  },
  activitiesList: {
    flex: 1,
    paddingHorizontal: 20,
  },
  activitiesContent: {
    paddingBottom: 20,
  },
  listTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 12,
  },
  activityCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  activityIndicator: {
    width: 4,
    height: '100%',
    borderRadius: 2,
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  activityTime: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 2,
  },
  activityDuration: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
  },
  deleteButton: {
    padding: 8,
  },
  deleteButtonText: {
    fontSize: 18,
    color: '#EF4444',
  },
  emptyText: {
    textAlign: 'center',
    color: '#9CA3AF',
    fontSize: 14,
    marginTop: 20,
  },
});
