import { View, Text, ScrollView, StyleSheet, Pressable, Alert } from 'react-native';
import React, { useEffect, useState } from 'react';
import { router, useRouter } from 'expo-router';
import { supabase } from '@/client';
import { FontAwesome } from '@expo/vector-icons';

const Categories = () => {
  interface Category {
    id: string;
    title: string;
    description: string;
    limit: number;
    user: string;
    totalSpent?: number; // Optional field to store total spent
  }

  const [categories, setCategories] = useState<Category[]>([]);
  const router = useRouter();

  const fetchCategories = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      console.log(`this user ${user}`);
    } else {
      console.log('no user');
    }
    try {
      const { data, error } = await supabase
        .from('category')
        .select()
        .eq('user', user?.id);
      if (!error) {
        // Fetch total spent for each category
        const updatedCategories = await Promise.all(
          data.map(async (category) => {
            const { data: items, error: itemsError } = await supabase
              .from('items')
              .select('price')
              .eq('category', category.id);
            const totalSpent = items?.reduce((sum, item) => sum + item.price, 0);
            return { ...category, totalSpent };
          })
        );
        setCategories(updatedCategories);
      } else {
        console.log(error);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const deleteCategory = async (id: string) => {
    const response = await supabase
      .from('category')
      .delete()
      .eq('id', id);

    if (response.error !== null) {
      Alert.alert('Error');
      console.log(response.error);
    } else {
      Alert.alert('Deleted successfully');
      fetchCategories();
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Categories</Text>
      <Pressable
        style={{ backgroundColor: 'black', padding: 11, width: '95%', borderRadius: 7 }}
        onPress={() => router.replace('/addCategory')}
      >
        <Text style={{ color: 'white', textAlign: 'center' }}>Add a Category</Text>
      </Pressable>
      <View style={styles.categories}>
        {categories.map((category) => {
          const percentageSpent = (category.totalSpent / category.limit) * 100;
          return (
            <View style={styles.card} key={category.id}>
              <View style={styles.flex}>
                <View style={styles.textContainer}>
                  <Text style={styles.title}>{category.title}</Text>
                  <Text style={styles.description}>{category.description}</Text>
                  <View style={styles.budgetContainer}>
                    <Text style={styles.budgetLabel}>Budget:</Text>
                    <View style={styles.budgetBarBackground}>
                      <View style={[styles.budgetBar, { width: `${percentageSpent}%` }]}></View>
                    </View>
                  </View>
                  <Text style={styles.budgetInfo}>Rs. {category.totalSpent}/{category.limit} spent</Text>
                </View>
              </View>
              <View style={{ display: 'flex', justifyContent: 'space-between', flexDirection: 'row' }}>
                <Pressable
                  style={{ backgroundColor: '#414141', padding: 10, width: 230, borderRadius: 3 }}
                  onPress={() =>
                    router.navigate({
                      pathname: '/additems',
                      params: {
                        category: category.id,
                        limit: category.limit,
                      },
                    })
                  }
                >
                  <Text style={{ color: 'white', textAlign: 'center', fontSize: 20, fontWeight: '200' }}>Info</Text>
                </Pressable>
                <Pressable onPress={() => deleteCategory(category.id)}>
                  <FontAwesome name="trash" size={40} style={{ paddingTop: 5 }} />
                </Pressable>
              </View>
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#f8f9fa',
    paddingVertical: 100,
    gap: 10,
  },
  header: {
    fontSize: 24,
    fontWeight: '600',
    marginVertical: 10,
    color: '#333',
  },
  subHeader: {
    fontSize: 18,
    marginVertical: 10,
    color: '#555',
  },
  categories: {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    gap: 10,
  },
  card: {
    width: '100%',
    backgroundColor: '#fff',
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  image: {
    width: 120,
    height: 120,
    borderRadius: 10,
    marginRight: 20,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: '500',
    color: '#333',
    marginBottom: 5,
  },
  description: {
    fontSize: 18,
    color: '#777',
    marginBottom: 10,
  },
  budgetContainer: {
    flexDirection: 'column',
    marginBottom: 10,
  },
  budgetLabel: {
    fontSize: 18,
    fontWeight: '400',
    color: '#555',
  },
  budgetBarBackground: {
    backgroundColor: '#ddd',
    height: 10,
    borderRadius: 5,
    overflow: 'hidden',
    marginTop: 5,
  },
  budgetBar: {
    backgroundColor: '#007bff',
    height: 10,
    borderRadius: 5,
  },
  budgetInfo: {
    textAlign: 'right',
    marginRight: 10,
    marginVertical: 10,
    color: '#888',
    fontSize: 16,
  },
  flex: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
});

export default Categories;
