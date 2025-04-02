import React, { useState } from 'react';
import { View, TextInput, Text, Alert, Pressable } from 'react-native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { collection, addDoc } from 'firebase/firestore';
import { auth, db } from '../firebaseConfig';
import { useRouter } from 'expo-router';
import { sharedStyles } from '../constants/styles';

export default function Register() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async () => {
    try {
      const userCred = await createUserWithEmailAndPassword(auth, email, password);

      await addDoc(collection(db, "users"), {
        email,
        password,
        role: "admin",
        adminId: userCred.user.email, // Admin creating themselves
        createdAt: new Date(),
      });

      Alert.alert('✅ Registered as Admin');
      router.replace('/login');
    } catch (error) {
      console.error("Registration error:", error);
      Alert.alert('Error', error.message);
    }
  };

  return (
    <View style={sharedStyles.container}>
      <Text style={sharedStyles.title}>Register Admin</Text>

      <TextInput placeholder="Email" value={email} onChangeText={setEmail} style={sharedStyles.input} autoCapitalize="none" />
      <TextInput placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry style={sharedStyles.input} />

      <Pressable style={sharedStyles.primaryButton} onPress={handleRegister}>
        <Text style={sharedStyles.primaryButtonText}>Register</Text>
      </Pressable>

      <Text style={sharedStyles.link} onPress={() => router.replace('/login')}>
        Already have an account? Login
      </Text>
    </View>
  );
}
