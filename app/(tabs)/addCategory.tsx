import { View, Text, Button, TextInput, Pressable, StyleSheet, Alert } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Stack } from 'expo-router';
import { supabase } from '@/client';

const AddCategory = () => {
  const [title, setTitle] = useState<string>('');
  const [limit, setLimit] = useState<string>('');



  const postCategories = async () => {
    const { data: { user } } = await supabase.auth.getUser();


    const { error } = await supabase
      .from('category')
      .insert({ title, limit: limit, user: user?.id });

    if (error?.message) {
      console.error('Error inserting data:', error);
      Alert.alert('Error', 'There was an error saving your data.');
    } else {
      Alert.alert('Success', 'Your category has been added.');
    }
  }



const handleLimitChange = (text: string) => {
  const numericValue = text.replace(/[^0-9.]/g, '');
  setLimit(numericValue);
};

return (
  <View style={styles.container}>
    <Stack.Screen
      options={{
        title: 'Add a category',
        headerRight: () => <Button title="Do Something" color={'black'} onPress={() => { }} />
      }}
    />
    <Text style={styles.heading}>Add a category</Text>
    <TextInput
      style={styles.input}
      value={title}
      onChangeText={setTitle}
      placeholder="Enter your title"
    />
    <TextInput
      style={styles.input}
      keyboardType="number-pad"
      value={limit}
      onChangeText={handleLimitChange}
      placeholder="Enter your limit"
    />
    <Pressable style={styles.button} onPress={postCategories}>
      <Text style={styles.buttonText}>Add</Text>
    </Pressable>
  </View>
);
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
    display: 'flex',
    justifyContent: 'center',
    // alignItems:  'center'
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
  },
  input: {
    // height: 40,
    borderColor: '#DDD',
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 10,
    marginBottom: 16,
    borderRadius: 4,
  },
  button: {
    backgroundColor: 'black',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 4,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default AddCategory;
