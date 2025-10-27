import { useState, useCallback } from 'react';
import {
  View,
  Text,
  Button,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getData, saveData } from '../storage/secureStore';
import { useFocusEffect } from '@react-navigation/native';

export default function HomeScreen({ navigation }) {
  const [passwords, setPasswords] = useState([]);

  // Reload passwords every time the screen is focused
  useFocusEffect(
    useCallback(() => {
      const fetchPasswords = async () => {
        const saved = await getData('passwords');
        if (saved) setPasswords(saved);
      };
      fetchPasswords();
    }, [])
  );

  const handleCopy = async (text) => {
    await Clipboard.setStringAsync(text);
    Alert.alert('Copied!', 'Text copied to clipboard.');
  };

  const handleDelete = (index) => {
    Alert.alert(
      'Delete Password',
      'Are you sure you want to delete this password?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const updated = [...passwords];
              updated.splice(index, 1);
              setPasswords(updated);
              await saveData('passwords', updated);
            } catch (error) {
              console.log('Error deleting password:', error);
            }
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom', 'left', 'right']}>
      <View style={styles.container}>
        <Text style={styles.title}>Saved Passwords</Text>

        {passwords.length === 0 ? (
          <Text>No passwords saved yet.</Text>
        ) : (
          <FlatList
            data={passwords}
            keyExtractor={(item, idx) => idx.toString()}
            renderItem={({ item, index }) => (
              <View style={styles.item}>
                <Text style={styles.site}>{item.site}</Text>

                <TouchableOpacity onPress={() => handleCopy(item.username)}>
                  <Text style={styles.username}>
                    {item.username} (tap to copy)
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => handleCopy(item.password)}>
                  <Text style={styles.password}>•••••••• (tap to copy)</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => handleDelete(index)}>
                  <Ionicons name="trash-outline" size={24} color="red" />
                </TouchableOpacity>
              </View>
            )}
          />
        )}

        <View style={styles.buttonContainer}>
          <Button
            title="Add New Password"
            onPress={() => navigation.navigate('Add')}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#fff' },
  container: { flex: 1, padding: 20 },
  title: { fontSize: 22, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 },
  item: {
    backgroundColor: '#f8f8f8',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  site: { fontWeight: 'bold', fontSize: 16 },
  username: { color: '#333', marginTop: 5 },
  password: { color: '#777', marginTop: 5 },
  buttonContainer: {
    marginBottom: 10,
  },
});
