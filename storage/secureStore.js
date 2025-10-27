import * as SecureStore from 'expo-secure-store';

// Save data
export async function saveData(key, value) {
  try {
    await SecureStore.setItemAsync(key, JSON.stringify(value));
  } catch (error) {
    console.log('Error saving data', error);
  }
}

// Get data
export async function getData(key) {
  try {
    const result = await SecureStore.getItemAsync(key);
    return result ? JSON.parse(result) : null;
  } catch (error) {
    console.log('Error reading data', error);
  }
}

// Delete data
export async function deleteData(key) {
  try {
    await SecureStore.deleteItemAsync(key);
  } catch (error) {
    console.log('Error deleting data', error);
  }
}
