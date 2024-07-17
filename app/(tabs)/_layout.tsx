import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Tabs } from 'expo-router';

export default function TabLayout() {
  return (
    <Tabs screenOptions={{ tabBarActiveTintColor: 'blue', headerShown: false }}>
      <Tabs.Screen
        name="categories"
        options={{
          title: 'Categories',
          tabBarIcon: ({ color }) => <FontAwesome size={28} name="columns" color={color} />,
          headerShown: false
        }}
      />
      <Tabs.Screen
        name="addCategory"
        options={{
          title: 'Add',
          tabBarIcon: ({ color }) => <FontAwesome size={28} name="plus" color={color} />,
        }}
      />
      {/* <Tabs.Screen
        name="additems"
        options={{
          title: 'Add',
          tabBarIcon: ({ color }) => <FontAwesome size={28} name="plus" color={color} />,
          // i want that footer tab bar is not visible on this page
          tabBarStyle: {
            display: 'none'
          }
        }}
      /> */}
    </Tabs>
  );
}
