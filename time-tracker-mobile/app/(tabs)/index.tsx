import { Image, StyleSheet, Pressable, Text, View, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';

export default function HomeScreen() {
  const router = useRouter();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image
        source={require('@/assets/images/partial-react-logo.png')}
        style={styles.logo}
        resizeMode="contain"
      />

      <Text style={styles.title}>TimeTracker ⏱️</Text>
      <Text style={styles.subtitle}>Smart Time Tracking for Teams and Individuals</Text>
      <Text style={styles.description}>
        Easily clock in/out, track work hours, and manage your team’s time from anywhere.
      </Text>

      <View style={styles.buttonGroup}>
        <Pressable style={styles.primaryButton} onPress={() => router.push('/login')}>
          <Text style={styles.primaryButtonText}>Login</Text>
        </Pressable>

        <Pressable style={styles.secondaryButton} onPress={() => router.push('/register')}>
          <Text style={styles.secondaryButtonText}>Register (Admin)</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    padding: 30,
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 180,
    height: 100,
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#333',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#666',
    textAlign: 'center',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
    paddingHorizontal: 10,
    marginBottom: 30,
  },
  buttonGroup: {
    gap: 15,
    width: '100%',
  },
  primaryButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  secondaryButton: {
    borderColor: '#007AFF',
    borderWidth: 2,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: '#007AFF',
    fontWeight: '600',
    fontSize: 16,
  },
});
