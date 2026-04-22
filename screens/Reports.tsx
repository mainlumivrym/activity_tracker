import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { useState } from 'react';
import { Activity, Category } from '../types/activity';
import { CATEGORY_COLORS, CATEGORY_EMOJIS } from '../constants/categories';
import { formatDuration, formatTime } from '../utils/formatters';
import { useActivities } from '../contexts/ActivityContext';

export default function Reports() {
  const { getActivitiesForDate } = useActivities();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [refreshing, setRefreshing] = useState(false);
  
  // Get activities for the selected date
  const activities = getActivitiesForDate(selectedDate);

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const changeDate = (days: number) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + days);
    setSelectedDate(newDate);
  };

  const isToday = (date: Date): boolean => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
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

  const getTotalTime = (): number => {
    return activities.reduce((total, activity) => total + (activity.duration || 0), 0);
  };

  const onRefresh = () => {
    setRefreshing(true);
    // In a real app, you might fetch data from an API here
    // For now, just refresh the view
    setTimeout(() => {
      setRefreshing(false);
    }, 500);
  };

  const categoryTotals = getTotalTimeByCategory();
  const totalTime = getTotalTime();

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#3B82F6"
            colors={['#3B82F6']}
          />
        }
      >
        <View style={styles.header}>
          <Text style={styles.title}>Reports</Text>
          <Text style={styles.subtitle}>Track your daily activities</Text>
        </View>

        {/* Date Picker */}
        <View style={styles.datePickerContainer}>
        <TouchableOpacity 
          style={styles.dateButton} 
          onPress={() => changeDate(-1)}
        >
          <Text style={styles.dateButtonText}>←</Text>
        </TouchableOpacity>

        <View style={styles.dateDisplay}>
          <Text style={styles.dateText}>{formatDate(selectedDate)}</Text>
          {isToday(selectedDate) && (
            <View style={styles.todayBadge}>
              <Text style={styles.todayText}>Today</Text>
            </View>
          )}
        </View>

        <TouchableOpacity 
          style={[styles.dateButton, isToday(selectedDate) && styles.dateButtonDisabled]} 
          onPress={() => changeDate(1)}
          disabled={isToday(selectedDate)}
        >
          <Text style={[styles.dateButtonText, isToday(selectedDate) && styles.dateButtonTextDisabled]}>→</Text>
        </TouchableOpacity>
      </View>

      {/* Summary Stats */}
      <View style={styles.summaryContainer}>
        <View style={styles.totalTimeCard}>
          <Text style={styles.totalTimeLabel}>Total Time</Text>
          <Text style={styles.totalTimeValue}>{formatDuration(totalTime)}</Text>
          <Text style={styles.activityCount}>{activities.length} activities</Text>
        </View>
      </View>

        {/* Category Breakdown */}
        <View style={styles.categoriesContainer}>
          <Text style={styles.sectionTitle}>Breakdown by Category</Text>
          <View style={styles.categoryList}>
            {(Object.entries(categoryTotals) as [Category, number][]).map(([category, duration]) => {
              const percentage = totalTime > 0 ? (duration / totalTime) * 100 : 0;
              
              return (
                <View key={category} style={styles.categoryRow}>
                  <View style={styles.categoryInfo}>
                    <Text style={styles.categoryEmoji}>{CATEGORY_EMOJIS[category]}</Text>
                    <Text style={styles.categoryName}>{category}</Text>
                  </View>
                  <View style={styles.categoryStats}>
                    <View style={styles.progressBarContainer}>
                      <View 
                        style={[
                          styles.progressBar, 
                          { 
                            width: `${percentage}%`,
                            backgroundColor: CATEGORY_COLORS[category]
                          }
                        ]} 
                      />
                    </View>
                    <Text style={styles.categoryTime}>{formatDuration(duration)}</Text>
                  </View>
                </View>
              );
            })}
          </View>
        </View>

        {/* Activities List */}
        <View style={styles.activitiesListContainer}>
          <Text style={styles.sectionTitle}>Activities</Text>
          {activities.length > 0 ? (
            activities.map((activity) => (
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
              </View>
            ))
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyEmoji}>📊</Text>
              <Text style={styles.emptyText}>No activities recorded</Text>
              <Text style={styles.emptySubtext}>
                {isToday(selectedDate) 
                  ? "Start tracking your activities on the Dashboard"
                  : "No activities for this date"}
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 60,
    paddingBottom: 20,
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
  datePickerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  dateButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  dateButtonDisabled: {
    opacity: 0.3,
  },
  dateButtonText: {
    fontSize: 20,
    color: '#1F2937',
    fontWeight: 'bold',
  },
  dateButtonTextDisabled: {
    color: '#9CA3AF',
  },
  dateDisplay: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 16,
  },
  dateText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  todayBadge: {
    backgroundColor: '#3B82F6',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  todayText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  summaryContainer: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  totalTimeCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  totalTimeLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
  },
  totalTimeValue: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  activityCount: {
    fontSize: 14,
    color: '#6B7280',
  },
  categoriesContainer: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
  },
  categoryList: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  categoryRow: {
    marginBottom: 16,
  },
  categoryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryEmoji: {
    fontSize: 20,
    marginRight: 8,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    textTransform: 'capitalize',
  },
  categoryStats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressBarContainer: {
    flex: 1,
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    marginRight: 12,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 4,
  },
  categoryTime: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
    minWidth: 60,
    textAlign: 'right',
  },
  activitiesListContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  activityCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
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
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyEmoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
});
