import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, Alert } from 'react-native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { collection, addDoc } from 'firebase/firestore';
import { auth, db } from '../firebaseConfig';
import { useRouter } from 'expo-router';
import { useUser } from '../context/UserContext';
import { sharedStyles } from '../constants/styles';

export default function CreateUser() {
  const { userInfo } = useUser();
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleCreateUser = async () => {
    if (!email || !password) {
      Alert.alert("Missing Fields", "Enter both email and password.");
      return;
    }

    try {
      const userCred = await createUserWithEmailAndPassword(auth, email, password);

      await addDoc(collection(db, "users"), {
        email,
        password,
        role: "user",
        adminId: userInfo?.email,
        createdAt: new Date(),
      });

      Alert.alert("✅ User Created!");
      setEmail('');
      setPassword('');
    } catch (error) {
      console.error("Create user error:", error);
      Alert.alert("Error", error.message);
    }
  };

  return (
    <View style={sharedStyles.container}>
      <Text style={sharedStyles.title}>Create User</Text>

      <TextInput placeholder="User Email" value={email} onChangeText={setEmail} style={sharedStyles.input} autoCapitalize="none" />
      <TextInput placeholder="User Password" value={password} onChangeText={setPassword} style={sharedStyles.input} secureTextEntry />

      <Pressable style={sharedStyles.primaryButton} onPress={handleCreateUser}>
        <Text style={sharedStyles.primaryButtonText}>Create User</Text>
      </Pressable>

      <Text style={sharedStyles.link} onPress={() => router.replace('/admin-dashboard')}>
        Back to Admin Dashboard
      </Text>
    </View>
  );
}
