import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, Pressable, FlatList } from 'react-native';
import React, { useEffect, useState } from 'react';
import { supabase } from '@/client';
import { useLocalSearchParams } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
// import { useExpenseStore } from '@/store';

export default function AddItems() {
    const { category, limit } = useLocalSearchParams();
    interface Item {
        id: string,
        item_title: string,
        price: number,
        user: string,
    }
    const [itemTitle, setItemTitle] = useState('');
    const [itemPrice, setItemPrice] = useState('');
    const [items, setItems] = useState<Array<Item> | Array<null>>([])
    const [totalPrice, setTotalPrice] = useState(0)

    const getUser = async () => {
        const { data: { user } } = await supabase.auth.getUser()
        return user?.id;
    }

    const postItem = async () => {
        const priceNumber = parseInt(itemPrice);
        const user = await getUser();

        if (totalPrice + priceNumber < limit) {
            const { error } = await supabase
                .from('items')
                .insert({
                    item_title: itemTitle,
                    price: priceNumber,
                    category: category,
                    // user: user
                });
            console.log(error && error);

            setItemTitle('')
            setItemPrice('')

            fetchItems();
        } else {
            Alert.alert('Price limit exceeded');
        }
    }

    const fetchItems = async () => {
        const user = await getUser();
        const { data, error } = await supabase
            .from('items')
            .select('*')
            .eq('category', category);

        setItems(data);
        const totalPrice = data?.reduce((total, item) => total + item.price, 0);
        console.log(`Total: ${totalPrice}`);
        setTotalPrice(totalPrice);
    }

    const deleteItem = async (id: string) => {
        const { error } = await supabase
            .from('items')
            .delete()
            .eq('id', id);

        if (error) {
            Alert.alert('Error deleting item');
        } else {
            fetchItems();
        }
    }

    useEffect(() => {
        fetchItems();
    }, []);

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Add Items</Text>
            <View style={styles.inputContainer}>
                <TextInput
                    placeholder="Enter the title"
                    value={itemTitle}
                    onChangeText={t => setItemTitle(t)}
                    style={styles.input}
                />
                <TextInput
                    placeholder="Enter the price"
                    keyboardType="number-pad"
                    value={itemPrice}
                    onChangeText={t => setItemPrice(t)}
                    style={styles.input}
                />
                <TouchableOpacity style={styles.button} onPress={postItem} >
                    <Text style={styles.buttonText}>Add</Text>
                </TouchableOpacity>
            </View>
            <FlatList
                data={items}
                keyExtractor={item => item?.id}
                renderItem={({ item }) => (
                    <View style={styles.itemContainer}>
                        <Text style={styles.itemTitle}>{item?.item_title}</Text>
                        <Text style={styles.itemPrice}>${item?.price}</Text>
                        <Pressable onPress={() => deleteItem((item?.id as string))}>
                            <FontAwesome name='trash' style={styles.trashIcon} />
                        </Pressable>
                    </View>
                )}
                contentContainerStyle={styles.itemsList}
            />
            <Text style={styles.totalPrice}>Total Price: ${totalPrice}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f8f9fa',
    },
    header: {
        fontSize: 28,
        fontWeight: '700',
        marginBottom: 20,
        color: '#333',
        textAlign: 'center',
    },
    inputContainer: {
        marginBottom: 20,
    },
    input: {
        backgroundColor: '#fff',
        color: '#000',
        padding: 15,
        borderColor: '#ddd',
        borderWidth: 1,
        borderRadius: 8,
        marginBottom: 10,
    },
    button: {
        backgroundColor: '#5cb85c',
        paddingVertical: 15,
        borderRadius: 8,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '600',
    },
    itemContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 8,
        marginBottom: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
        elevation: 2,
    },
    itemTitle: {
        fontSize: 16,
        fontWeight: '500',
        color: '#333',
    },
    itemPrice: {
        fontSize: 16,
        fontWeight: '500',
        color: '#333',
    },
    trashIcon: {
        fontSize: 20,
        color: '#d9534f',
    },
    itemsList: {
        paddingBottom: 20,
    },
    totalPrice: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
        textAlign: 'center',
        marginTop: 20,
    },
});
