import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Alert, Button } from 'react-native';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { useRouter } from 'expo-router';
import { useUser } from '../context/UserContext';
import { db } from '../firebaseConfig';

export default function AdminUsers() {
  const { userInfo } = useUser();
  const [users, setUsers] = useState([]);
  const router = useRouter();

  const fetchUsers = async () => {
    try {
      const q = query(collection(db, "users"), where("adminId", "==", userInfo.email));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setUsers(data);
    } catch (error) {
      console.error("Error loading users:", error);
      Alert.alert("Error", "Could not fetch users.");
    }
  };

  useEffect(() => {
    if (userInfo?.email) fetchUsers();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Users Created by {userInfo.email}</Text>

      <FlatList
        data={users}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.userCard}>
            <Text style={styles.email}>{item.email}</Text>
            <Text>Role: {item.role}</Text>
          </View>
        )}
      />

      <Button title="Back to Dashboard" onPress={() => router.replace('/admin-dashboard')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: '#fff', flex: 1 },
  title: { fontSize: 20, fontWeight: '700', marginBottom: 20 },
  userCard: {
    backgroundColor: '#f2f2f2',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  email: { fontWeight: 'bold' }
});
