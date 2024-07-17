import { Stack } from 'expo-router';
import { UseAuthStore } from '@/store';
import { useEffect } from 'react';
import { useRouter } from 'expo-router';

export default function RootLayout() {
  const isLoggedIn = UseAuthStore(state => state.isLoggedIn);
  const router = useRouter();

  useEffect(() => {
    if (isLoggedIn) {
      router.replace('/(tabs)/categories');
    } else {
      router.replace('/login');
    }
  }, [isLoggedIn, router]);

  return (
    <Stack>
      <Stack.Screen name="login" options={{ title: 'Login' }} />
      <Stack.Screen name='additems' options={{
        title: 'Add items'
      }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />

    </Stack>
  );
}
