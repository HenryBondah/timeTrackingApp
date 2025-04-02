import React, { useEffect, useState } from 'react';
import { View, Text, Pressable, FlatList, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { signOut } from 'firebase/auth';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { useUser } from '../context/UserContext';
import { auth, db } from '../firebaseConfig';

export default function AdminDashboard() {
  const { userInfo } = useUser();
  const [userLogs, setUserLogs] = useState([]);
  const router = useRouter();

  const fetchUserLogs = async () => {
    try {
      const usersQuery = query(collection(db, "users"), where("adminId", "==", userInfo.email));
      const userSnapshot = await getDocs(usersQuery);
      const userList = userSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      const userEmails = userList.map(u => u.email);

      if (userEmails.length === 0) {
        setUserLogs([]);
        return;
      }

      const logsRef = collection(db, "time-logs");
      const allLogs = [];

      for (const email of userEmails) {
        const logsQuery = query(logsRef, where("userId", "==", email));
        const logsSnap = await getDocs(logsQuery);
        logsSnap.forEach(doc => {
          allLogs.push({ id: doc.id, ...doc.data(), email });
        });
      }

      setUserLogs(allLogs);
    } catch (err) {
      console.error("Error loading user logs:", err);
      Alert.alert("Error", "Failed to load user time logs.");
    }
  };

  useEffect(() => {
    if (userInfo?.email) fetchUserLogs();
  }, [userInfo]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.replace('/login');
    } catch (err) {
      console.error('Logout error:', err);
      Alert.alert('Logout failed', err.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome, Admin 👋</Text>
      <Text style={styles.subtitle}>Email: {userInfo?.email}</Text>

      <Pressable style={styles.button} onPress={() => router.replace('/create-user')}>
        <Text style={styles.buttonText}>➕ Create New User</Text>
      </Pressable>

      <Pressable style={styles.button} onPress={() => router.replace('/admin-users')}>
        <Text style={styles.buttonText}>👥 View My Users</Text>
      </Pressable>

      <Text style={styles.subtitle}>📊 Logs from Your Users</Text>

      <FlatList
        data={userLogs}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.logCard}>
            <Text style={styles.email}>{item.email}</Text>
            <Text>Clock In: {item.clockIn?.toDate().toLocaleString() ?? '—'}</Text>
            <Text>Clock Out: {item.clockOut?.toDate().toLocaleString() ?? '—'}</Text>
            <Text>Status: {item.status}</Text>
          </View>
        )}
      />

      <Pressable style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>🚪 Logout</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    flex: 1,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 16,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#0077ff',
    padding: 14,
    borderRadius: 8,
    marginBottom: 12,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
  },
  logoutButton: {
    backgroundColor: '#ff4d4d',
    padding: 14,
    borderRadius: 8,
    marginTop: 20,
  },
  logoutText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
  },
  logCard: {
    backgroundColor: '#f2f2f2',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
  },
  email: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
});
