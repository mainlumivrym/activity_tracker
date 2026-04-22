import { StyleSheet, Text, View, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { Category } from '../types/activity';
import { CATEGORY_COLORS, CATEGORY_EMOJIS } from '../constants/categories';

interface ActivityInputCardProps {
  activityTitle: string;
  onActivityTitleChange: (title: string) => void;
  selectedCategory: Category;
  onCategorySelect: (category: Category) => void;
  onStartActivity: () => void;
}

export default function ActivityInputCard({
  activityTitle,
  onActivityTitleChange,
  selectedCategory,
  onCategorySelect,
  onStartActivity,
}: ActivityInputCardProps) {
  return (
    <View style={styles.inputContainer}>
      <TextInput
        style={styles.input}
        placeholder="What are you doing?"
        value={activityTitle}
        onChangeText={onActivityTitleChange}
        placeholderTextColor="#9CA3AF"
      />
      
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
        {(Object.keys(CATEGORY_COLORS) as Category[]).map((category) => (
          <TouchableOpacity
            key={category}
            style={[
              styles.categoryButton,
              { backgroundColor: CATEGORY_COLORS[category] },
              selectedCategory === category && styles.categoryButtonActive,
            ]}
            onPress={() => onCategorySelect(category)}
          >
            <Text style={styles.categoryEmoji}>{CATEGORY_EMOJIS[category]}</Text>
            <Text style={styles.categoryText}>{category}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <TouchableOpacity style={styles.startButton} onPress={onStartActivity}>
        <Text style={styles.startButtonText}>Start Activity</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  inputContainer: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 16,
  },
  categoryScroll: {
    marginBottom: 16,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginRight: 8,
    opacity: 0.7,
  },
  categoryButtonActive: {
    opacity: 1,
    transform: [{ scale: 1.05 }],
  },
  categoryEmoji: {
    fontSize: 16,
    marginRight: 6,
  },
  categoryText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
    textTransform: 'capitalize',
  },
  startButton: {
    backgroundColor: '#1F2937',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  startButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
