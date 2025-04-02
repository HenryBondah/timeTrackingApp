// time-tracker-mobile/constants/styles.js
import { StyleSheet } from 'react-native';

export const sharedStyles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    padding: 30,
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    width: '100%',
    marginBottom: 15,
  },
  primaryButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    width: '100%',
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
    width: '100%',
    marginTop: 10,
  },
  secondaryButtonText: {
    color: '#007AFF',
    fontWeight: '600',
    fontSize: 16,
  },
  link: {
    marginTop: 15,
    color: '#007AFF',
    textAlign: 'center',
  },
});
