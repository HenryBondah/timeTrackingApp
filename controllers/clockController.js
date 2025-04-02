import React, { useState, useEffect } from 'react';
import { View, Text, Button, Alert, StyleSheet, Platform, TextInput } from 'react-native';
import * as Location from 'expo-location';
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import { collection, addDoc, getDocs, updateDoc, doc, query, where } from 'firebase/firestore';
import { db, auth } from '@/firebaseConfig';
import { isWithinWorkingHours } from '@/utils/checkWorkingHours';
import { useRouter, useRootNavigationState } from 'expo-router';
import { signOut, onAuthStateChanged } from 'firebase/auth';

export default function ClockScreen() {
  const router = useRouter();
  const navState = useRootNavigationState();

  const [userEmail, setUserEmail] = useState('');
  const [location, setLocation] = useState(null);
  const [manualDate, setManualDate] = useState(new Date());
  const [clockInTime, setClockInTime] = useState(new Date());
  const [clockOutTime, setClockOutTime] = useState(new Date());

  useEffect(() => {
    if (!navState?.key) return;
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) return router.replace('/login');
      setUserEmail(user.email || '');

      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        const loc = await Location.getCurrentPositionAsync({});
        setLocation(loc.coords);
      } else {
        Alert.alert('Location permission denied');
      }
    });
    return unsubscribe;
  }, [navState]);

  const getDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371000;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const handleClockIn = async () => {
    try {
      if (!location) return Alert.alert('Location not available');

      const areaSnap = await getDocs(collection(db, 'clock-in-area'));
      if (areaSnap.empty) return Alert.alert('No clock-in area set');

      const { latitude, longitude, radius } = areaSnap.docs[0].data();
      const distance = getDistance(location.latitude, location.longitude, latitude, longitude);
      const withinRange = distance <= radius;
      const withinTime = await isWithinWorkingHours(new Date().toISOString());

      await addDoc(collection(db, 'time-logs'), {
        userId: userEmail,
        clockIn: new Date().toISOString(),
        clockInLat: location.latitude,
        clockInLng: location.longitude,
        withinRange: withinRange ? 'Yes' : 'No',
        withinTime: withinTime ? 'Yes' : 'No',
        clockOut: null,
        status: 'pending',
      });

      Alert.alert('✅ Clocked In', `Within Time: ${withinTime ? '✅' : '❌'}, Within Range: ${withinRange ? '✅' : '❌'}`);
    } catch (error) {
      console.error('Clock-In Error', error);
      Alert.alert('Error', 'Failed to clock in.');
    }
  };

  const handleClockOut = async () => {
    try {
      const q = query(
        collection(db, 'time-logs'),
        where('userId', '==', userEmail),
        where('clockOut', '==', null)
      );
      const snap = await getDocs(q);
      if (snap.empty) return Alert.alert('No open logs');

      const logRef = doc(db, 'time-logs', snap.docs[0].id);
      await updateDoc(logRef, {
        clockOut: new Date().toISOString(),
        clockOutLat: location.latitude,
        clockOutLng: location.longitude,
      });

      Alert.alert('✅ Clocked Out', 'Log updated with location.');
    } catch (err) {
      console.error('Clock-Out Error', err);
      Alert.alert('Error', 'Failed to clock out.');
    }
  };

  const openPicker = (mode, currentDate, setDate) => {
    if (Platform.OS === 'web') return;
    DateTimePickerAndroid.open({
      value: currentDate,
      onChange: (_, selected) => selected && setDate(selected),
      mode,
      is24Hour: true,
    });
  };

  const handleManualEntry = async () => {
    if (!clockInTime || !clockOutTime) {
      return Alert.alert('Fill all manual entry fields');
    }

    const clockIn = new Date(manualDate.toDateString() + ' ' + clockInTime.toTimeString()).toISOString();
    const clockOut = new Date(manualDate.toDateString() + ' ' + clockOutTime.toTimeString()).toISOString();

    await addDoc(collection(db, 'time-logs'), {
      userId: userEmail,
      clockIn,
      clockOut,
      latitude: location?.latitude || null,
      longitude: location?.longitude || null,
      status: 'pending',
    });

    Alert.alert('✅ Manual Entry Saved', 'Your manual log has been saved.');
  };

  const handleLogout = async () => {
    await signOut(auth);
    router.replace('/login');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>📍 TimeTracker</Text>
      <Text style={styles.subheader}>Logged in as: {userEmail}</Text>
      <Button title="Logout" onPress={handleLogout} />

      <View style={styles.section}>
        <Button title="Clock In" onPress={handleClockIn} />
        <View style={{ marginVertical: 6 }} />
        <Button title="Clock Out" onPress={handleClockOut} color="tomato" />
      </View>

      <View style={styles.section}>
        <Text style={{ fontWeight: 'bold', marginBottom: 6 }}>Manual Entry</Text>
        <Text>Date: {manualDate.toDateString()}</Text>
        <Button title="Select Date" onPress={() => openPicker('date', manualDate, setManualDate)} />
        <Text style={{ marginTop: 10 }}>Clock In: {clockInTime.toLocaleTimeString()}</Text>
        <Button title="Select Clock In Time" onPress={() => openPicker('time', clockInTime, setClockInTime)} />
        <Text style={{ marginTop: 10 }}>Clock Out: {clockOutTime.toLocaleTimeString()}</Text>
        <Button title="Select Clock Out Time" onPress={() => openPicker('time', clockOutTime, setClockOutTime)} />
        <View style={{ marginTop: 10 }}>
          <Button title="Save Manual Entry" onPress={handleManualEntry} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#000' },
  header: { fontSize: 22, fontWeight: 'bold', textAlign: 'center', marginBottom: 10, color: '#fff' },
  subheader: { fontSize: 14, textAlign: 'center', marginBottom: 20, color: '#ccc' },
  section: { marginVertical: 10, padding: 10, backgroundColor: '#f0f0f0', borderRadius: 8 },
});
