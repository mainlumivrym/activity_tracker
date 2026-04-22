import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Activity, Category } from '../types/activity';
import { CATEGORY_COLORS, CATEGORY_EMOJIS } from '../constants/categories';
import { formatDuration, formatTime } from '../utils/formatters';

interface RunningActivityCardProps {
  activity: Activity;
  elapsedTime: number;
  onStopActivity: () => void;
}

export default function RunningActivityCard({
  activity,
  elapsedTime,
  onStopActivity,
}: RunningActivityCardProps) {
  return (
    <View style={[styles.activeActivityContainer, { backgroundColor: CATEGORY_COLORS[activity.category as Category] }]}>
      <Text style={styles.activeActivityEmoji}>{CATEGORY_EMOJIS[activity.category as Category]}</Text>
      <Text style={styles.activeActivityTitle}>{activity.title}</Text>
      <Text style={styles.activeActivityTime}>Started at {formatTime(activity.startTime)}</Text>
      <Text style={styles.activeActivityDuration}>{formatDuration(elapsedTime)}</Text>
      
      <TouchableOpacity style={styles.stopButton} onPress={onStopActivity}>
        <Text style={styles.stopButtonText}>Stop Activity</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  activeActivityContainer: {
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginBottom: 24,
  },
  activeActivityEmoji: {
    fontSize: 48,
    marginBottom: 12,
  },
  activeActivityTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  activeActivityTime: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 12,
  },
  activeActivityDuration: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
    fontVariant: ['tabular-nums'],
  },
  stopButton: {
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 32,
  },
  stopButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
  },
});
