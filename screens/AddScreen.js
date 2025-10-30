import { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { getData, saveData } from '../storage/secureStore'; // ✅ Correct import

export default function AddScreen({ navigation }) {
  const [site, setSite] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [notes, setNotes] = useState('');

  const handleSave = async () => {
    if (!site || !username || !password) {
      Alert.alert('Error', 'Please fill all fields.');
      return;
    }

    try {
      const existing = (await getData('passwords')) || []; // ✅ Use SecureStore key
      const updated = [...existing, { site, username, password, notes }];
      await saveData('passwords', updated);

      setSite('');
      setUsername('');
      setPassword('');
      setNotes('');

      navigation.goBack();
    } catch (error) {
      console.log('Save error:', error);
      Alert.alert('Error', 'Failed to save password.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Website / App</Text>
      <TextInput style={styles.input} value={site} onChangeText={setSite} />

      <Text style={styles.label}>Username / Email</Text>
      <TextInput style={styles.input} value={username} onChangeText={setUsername} />

      <Text style={styles.label}>Password</Text>
      <TextInput
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <Text style={styles.label}>Notes</Text>
      <TextInput 
        style={styles.input}
        value={notes}
        onChangeText={setNotes}
      />

      <Button title="Save Password" onPress={handleSave} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  label: { marginTop: 10, fontWeight: 'bold' },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 10,
    marginBottom: 10,
  },
});
