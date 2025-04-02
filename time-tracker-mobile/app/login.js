import React, { useState } from 'react';
import { View, TextInput, Text, Alert, Pressable } from 'react-native';
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { auth, db } from '../firebaseConfig';
import { useRouter } from 'expo-router';
import { useUser } from '../context/UserContext';
import { sharedStyles } from '../constants/styles';

export default function Login() {
  const router = useRouter();
  const { setUserInfo } = useUser();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const login = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please enter both email and password.");
      return;
    }

    try {
      console.log("🔐 Trying Firebase Auth login...");
      const userCred = await signInWithEmailAndPassword(auth, email, password);
      console.log("✅ Firebase Auth login success:", userCred.user.email);

      // Now check Firestore for the user role and adminId
      const q = query(collection(db, "users"), where("email", "==", email));
      const snapshot = await getDocs(q);

      if (snapshot.empty) {
        console.warn("⚠️ No matching Firestore user record found.");
        Alert.alert("Access Denied", "User exists in Auth but not in the database.");
        await signOut(auth);
        return;
      }

      const userDoc = snapshot.docs[0].data();
      const role = userDoc.role || 'user';
      const adminId = userDoc.adminId || null;

      console.log(`ℹ️ Firestore user role: ${role}, adminId: ${adminId}`);

      // Save to context
      setUserInfo({ email, role, adminId });

      // Redirect based on role
      if (role === "admin") {
        router.replace('/admin-dashboard');
      } else if (role === "user") {
        router.replace('/user-dashboard');
      } else {
        Alert.alert("Access Denied", "Unrecognized user role.");
        await signOut(auth);
      }

    } catch (error) {
      console.error("❌ Login error:", error);
      Alert.alert('Login failed', error.message);
    }
  };

  return (
    <View style={sharedStyles.container}>
      <Text style={sharedStyles.title}>Login</Text>

      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={sharedStyles.input}
        autoCapitalize="none"
        keyboardType="email-address"
      />

      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={sharedStyles.input}
      />

      <Pressable style={sharedStyles.primaryButton} onPress={login}>
        <Text style={sharedStyles.primaryButtonText}>Login</Text>
      </Pressable>

      <Text style={sharedStyles.link} onPress={() => router.replace('/register')}>
        Don’t have an account? Register (Admin)
      </Text>
    </View>
  );
}
