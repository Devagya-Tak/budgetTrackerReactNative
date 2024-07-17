import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import SignUp from './signup';
import { UseAuthStore } from '@/store';
import { useRouter } from 'expo-router';

const Index = () => {
  const [isMounted, setIsMounted] = useState(false);
  const isLoggedIn = UseAuthStore(state => state.isLoggedIn);
  const router = useRouter();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted) {
      if (isLoggedIn) {
        router.replace('/(tabs)/categories');
      } else {
        router.replace('/signup');
      }
    }
  }, [isLoggedIn, router, isMounted]);

  return (
    <View style={{ flex: 1 }}>
      {!isLoggedIn && <SignUp />}
    </View>
  );
};

export default Index;
