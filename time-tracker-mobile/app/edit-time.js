import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TextInput, Button, Alert, StyleSheet } from 'react-native';
import { collection, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';
import { useUser } from '../context/UserContext';
import { db } from '../firebaseConfig';
import { Timestamp } from 'firebase/firestore';
import { useRouter } from 'expo-router';

export default function EditTime() {
  const { userInfo } = useUser();
  const [logs, setLogs] = useState([]);
  const [editedLogs, setEditedLogs] = useState({});
  const router = useRouter();

  const fetchLogs = async () => {
    try {
      const q = query(collection(db, 'time-logs'), where('userId', '==', userInfo.email));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setLogs(data);
    } catch (err) {
      console.error("Error fetching logs:", err);
      Alert.alert("Error", "Failed to fetch logs.");
    }
  };

  const handleChange = (id, field, value) => {
    setEditedLogs(prev => ({
      ...prev,
      [id]: {
        ...prev[id],
        [field]: value,
      },
    }));
  };

  const handleSave = async (logId) => {
    const log = editedLogs[logId];
    if (!log?.clockIn || !log?.clockOut) {
      Alert.alert("Missing fields", "Please enter both clock in and clock out.");
      return;
    }

    try {
      const updatedData = {
        clockIn: Timestamp.fromDate(new Date(log.clockIn)),
        clockOut: Timestamp.fromDate(new Date(log.clockOut)),
      };

      await updateDoc(doc(db, "time-logs", logId), updatedData);
      Alert.alert("Saved", "Log updated successfully.");
      fetchLogs();
    } catch (err) {
      console.error("Save error:", err);
      Alert.alert("Error", "Failed to save updates.");
    }
  };

  useEffect(() => {
    if (userInfo?.email) fetchLogs();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Edit Your Time Logs</Text>

      <FlatList
        data={logs}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          const edited = editedLogs[item.id] || {};
          return (
            <View style={styles.logCard}>
              <Text>Original Clock In: {item.clockIn?.toDate().toLocaleString()}</Text>
              <Text>Original Clock Out: {item.clockOut?.toDate().toLocaleString() || '—'}</Text>

              <TextInput
                style={styles.input}
                placeholder="New Clock In (YYYY-MM-DDTHH:MM)"
                value={edited.clockIn}
                onChangeText={(val) => handleChange(item.id, 'clockIn', val)}
              />

              <TextInput
                style={styles.input}
                placeholder="New Clock Out (YYYY-MM-DDTHH:MM)"
                value={edited.clockOut}
                onChangeText={(val) => handleChange(item.id, 'clockOut', val)}
              />

              <Button title="Save Changes" onPress={() => handleSave(item.id)} />
            </View>
          );
        }}
      />

      <Button title="Back to Dashboard" onPress={() => router.replace('/user-dashboard')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, flex: 1, backgroundColor: '#fff' },
  title: { fontSize: 22, fontWeight: '700', marginBottom: 20 },
  logCard: {
    backgroundColor: '#f2f2f2',
    padding: 14,
    borderRadius: 8,
    marginBottom: 16,
  },
  input: {
    borderColor: '#ccc',
    borderWidth: 1,
    padding: 8,
    borderRadius: 6,
    marginBottom: 10,
    marginTop: 8,
  },
});
