import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Dashboard from './screens/Dashboard';
import Reports from './screens/Reports';
import { ActivityProvider } from './contexts/ActivityContext';

type RootTabParamList = {
  Track: undefined;
  Reports: undefined;
};

const Tab = createBottomTabNavigator<RootTabParamList>();

export default function App() {
  return (
    <ActivityProvider>
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={{
            headerShown: false,
          }}
        >
          <Tab.Screen 
            name="Track" 
            component={Dashboard}
            options={{ title: 'Track' }}
          />
          <Tab.Screen 
            name="Reports" 
            component={Reports}
            options={{ title: 'Reports' }}
          />
        </Tab.Navigator>
      </NavigationContainer>
    </ActivityProvider>
  );
}
