import { View, Text, TextInput, Pressable, StyleSheet, Alert } from 'react-native';
import React, { useState, useEffect } from 'react';
import { supabase } from '../client';
import { Link, useRouter } from 'expo-router';
import { UseAuthStore } from '../store'; // Adjust the path as needed

const Login = () => {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const router = useRouter();
    const isLoggedIn = UseAuthStore(state => state.isLoggedIn);
    const setIsLoggedIn = UseAuthStore(state => state.setIsLoggedIn);
    const setEmailInStore = UseAuthStore(state => state.setEmail);

    useEffect(() => {
        if (isLoggedIn) {
            router.replace('/categories');
        }
    }, [isLoggedIn]);

    const signIn = async () => {
        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email: email,
                password: password,
            });
            if (error) {
                console.log('Error logging in:', error.message);
                Alert.alert('Login Failed', error.message);
            } else {
                console.log('User logged in successfully:', data);
                setIsLoggedIn(true);
                setEmailInStore(email);
                router.replace('/categories');
            }
        } catch (err) {
            console.error('Unexpected error during login:', err);
            Alert.alert('Login Error', 'An unexpected error occurred during login.');
        }
    };

    return (
        <View style={styles.mainDiv}>
            <Text style={{ fontSize: 20, color: 'black', fontWeight: '300' }}>Login</Text>
            <View style={{ width: '100%', display: 'flex', gap: 20, paddingHorizontal: 30 }}>
                <View style={styles.inputContainer}>
                    <Text>Email</Text>
                    <TextInput
                        onChangeText={(t) => setEmail(t)}
                        value={email}
                        keyboardType='email-address'
                        style={{ width: '100%', backgroundColor: 'white', padding: 10, borderRadius: 7, borderWidth: 1, borderColor: '#DDD' }}
                        placeholder='someone@example.com'
                    />
                </View>
                <View style={styles.inputContainer}>
                    <Text>Password</Text>
                    <TextInput
                        secureTextEntry={true}
                        onChangeText={(t) => setPassword(t)}
                        value={password}
                        style={{ width: '100%', backgroundColor: 'white', padding: 10, borderRadius: 7, borderWidth: 1, borderColor: '#DDD' }}
                        placeholder='Enter your password'
                    />
                </View>
                <Pressable style={styles.pressable} onPress={signIn}>
                    <Text style={{ color: 'white', fontSize: 20, alignSelf: 'center' }}>Login</Text>
                </Pressable>
                <Link href={'/'} style={{ textDecorationLine: 'underline' }}>Forgot Password?</Link>
                <Link href={'/signup'} style={{ textDecorationLine: 'underline' }}>Don't have an account?</Link>
            </View>
        </View>
    );
};

export default Login;

const styles = StyleSheet.create({
    pressable: {
        backgroundColor: '#000',
        width: '100%',
        padding: 10,
        borderRadius: 7,
        display: 'flex',
        justifyContent: 'center',
        alignContent: 'center'
    },
    inputContainer: {
        display: 'flex',
        flexDirection: 'column',
        gap: 10
    },
    mainDiv: {
        display: 'flex',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 30,
    }
});
