import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, Alert, FlatList, TextInput } from 'react-native';
import { collection, query, where, getDocs, addDoc, Timestamp } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { useRouter } from 'expo-router';
import { auth, db } from '../firebaseConfig';
import { useUser } from '../context/UserContext';

export default function UserDashboard() {
  const { userInfo } = useUser();
  const router = useRouter();

  const [logs, setLogs] = useState([]);
  const [manualDate, setManualDate] = useState('');
  const [manualClockIn, setManualClockIn] = useState('');
  const [manualClockOut, setManualClockOut] = useState('');
  const [isLoadingUser, setIsLoadingUser] = useState(true);

  const userEmail = userInfo?.email;
  const adminId = userInfo?.adminId;

  const fetchLogs = async () => {
    if (!userEmail) return;
    try {
      const q = query(collection(db, "time-logs"), where("userId", "==", userEmail));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setLogs(data);
    } catch (err) {
      console.error("Fetch error:", err);
      Alert.alert("Error", "Unable to load your time logs.");
    }
  };

  useEffect(() => {
    if (userEmail) {
      fetchLogs();
      setIsLoadingUser(false);
    }
  }, [userEmail]);

  const handleClock = async (type) => {
    try {
      const payload = {
        userId: userEmail,
        adminId,
        status: type,
        [type === 'Clock In' ? 'clockIn' : 'clockOut']: Timestamp.fromDate(new Date()),
      };

      await addDoc(collection(db, "time-logs"), payload);
      Alert.alert(`${type} successful`);
      fetchLogs();
    } catch (err) {
      console.error("Clock error:", err);
      Alert.alert("Error", `${type} failed`);
    }
  };

  const saveManualEntry = async () => {
    if (!manualDate || !manualClockIn || !manualClockOut) {
      Alert.alert("Please fill all manual time fields.");
      return;
    }

    try {
      const clockIn = new Date(`${manualDate}T${manualClockIn}`);
      const clockOut = new Date(`${manualDate}T${manualClockOut}`);

      await addDoc(collection(db, "time-logs"), {
        userId: userEmail,
        adminId,
        clockIn: Timestamp.fromDate(clockIn),
        clockOut: Timestamp.fromDate(clockOut),
        status: "Manual Entry"
      });

      Alert.alert("Manual entry saved!");
      setManualDate('');
      setManualClockIn('');
      setManualClockOut('');
      fetchLogs();
    } catch (err) {
      console.error("Manual entry error:", err);
      Alert.alert("Error", "Failed to save manual entry.");
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    router.replace('/login');
  };

  if (isLoadingUser || !userEmail) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading user data...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome, {userEmail.toUpperCase()}</Text>
      <Text style={styles.subtitle}>Your Time Logs</Text>

      <Button title="VIEW/EDIT LOGS" onPress={() => router.replace('/edit-time')} />
      <Button title="CLOCK IN" onPress={() => handleClock("Clock In")} />
      <Button title="CLOCK OUT" onPress={() => handleClock("Clock Out")} />

      <View style={styles.manualEntry}>
        <Text style={styles.subtitle}>Manual Time Entry</Text>
        <TextInput placeholder="Date (YYYY-MM-DD)" value={manualDate} onChangeText={setManualDate} style={styles.input} />
        <TextInput placeholder="Clock In (HH:MM)" value={manualClockIn} onChangeText={setManualClockIn} style={styles.input} />
        <TextInput placeholder="Clock Out (HH:MM)" value={manualClockOut} onChangeText={setManualClockOut} style={styles.input} />
        <Button title="SAVE MANUAL ENTRY" onPress={saveManualEntry} />
      </View>

      <FlatList
        data={logs}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.logCard}>
            <Text>Clock In: {item.clockIn?.toDate().toLocaleString() ?? "—"}</Text>
            <Text>Clock Out: {item.clockOut?.toDate().toLocaleString() ?? "—"}</Text>
            <Text>Status: {item.status}</Text>
          </View>
        )}
      />

      <Button title="LOGOUT" onPress={handleLogout} color="tomato" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, flex: 1, backgroundColor: '#fff' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 22, fontWeight: '700', marginBottom: 10 },
  subtitle: { fontSize: 16, marginTop: 20, marginBottom: 10 },
  manualEntry: { marginTop: 20 },
  input: {
    borderColor: '#ccc',
    borderWidth: 1,
    padding: 8,
    borderRadius: 6,
    marginBottom: 10,
  },
  logCard: {
    backgroundColor: '#f4f4f4',
    padding: 12,
    borderRadius: 8,
    marginTop: 16,
  },
});
