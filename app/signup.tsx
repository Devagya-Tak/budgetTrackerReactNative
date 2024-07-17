import React, { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { supabase } from '../client';
import { Link, useRouter } from "expo-router";
import { UseAuthStore } from '../store'; // Adjust the path as needed

export default function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  const isLoggedIn = UseAuthStore(state => state.isLoggedIn);
  const setIsLoggedIn = UseAuthStore(state => state.setIsLoggedIn)

  useEffect(() => {
    if (isLoggedIn) {
      router.replace('/categories');
    }
  }, [isLoggedIn]);

  const createUser = async (): Promise<void> => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password
      });

      if (error) {
        console.log(error);
      } else {
        console.log('User signed up successfully');

        const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
          email: email,
          password: password
        });

        if (loginError) {
          console.log('Error logging in:', loginError);
        } else {
          console.log('User logged in successfully:', loginData);

          // Update the auth state in your store
          setIsLoggedIn(true)

          // Navigate to the categories page
          router.replace('/categories');
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign Up</Text>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Email</Text>
        <TextInput
          keyboardType="email-address"
          style={styles.input}
          placeholder="someone@example.com"
          placeholderTextColor="#A9A9A9"
          value={email}
          onChangeText={(t) => setEmail(t)}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Password</Text>
        <TextInput
          secureTextEntry={true}
          style={styles.input}
          placeholder="Enter your password"
          placeholderTextColor="#A9A9A9"
          value={password}
          onChangeText={(t) => setPassword(t)}
        />
      </View>

      <Pressable style={styles.loginButton} onPress={createUser}>
        <Text style={styles.buttonText}>Sign Up</Text>
      </Pressable>

      <Link href={'/login'}>
        <Text style={styles.forgotPassword}>Already Have an account? Login</Text>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F0F0F0',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  inputContainer: {
    width: '100%',
    marginBottom: 10,
  },
  label: {
    marginBottom: 5,
    color: '#555',
  },
  input: {
    backgroundColor: '#FFF',
    width: '100%',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 7,
  },
  loginButton: {
    backgroundColor: '#000',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 5,
    marginTop: 20,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 18,
  },
  forgotPassword: {
    marginTop: 40,
    color: '#000',
    textDecorationLine: 'underline',
    textAlign: 'left',
  },
});
