import {
  useEffect,
  useState
} from 'react';
import {
  Button,
  FlatList,
  ListRenderItemInfo,
  StatusBar,
  StyleSheet,
  useColorScheme,
  View,
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import AsyncStorageDevTools from 'react-native-async-storage-devtools';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import {
  BatteryStatsInfo,
  getBatteryStats
} from './src/getBatteryStats.tsx';
import {
  BatteryInfo,
  BatteryInfoHeader
} from './src/components/BatteryInfo.tsx';

const STORAGE_BATTERY_INFO: string = "data.battery.statistics";

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <SafeAreaProvider>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <AppContent />
      <AsyncStorageDevTools />
    </SafeAreaProvider>
  );
}

function AppContent() {
  const [items, setItems] = useState<BatteryStatsInfo[]>([]);

  const loadItems = async() => {
    // Clear previous items and loads them from storage
    setItems([]);
    try {
      const storedItems = await AsyncStorage.getItem(STORAGE_BATTERY_INFO);
      if (storedItems) {
        setItems(JSON.parse(storedItems));
      }
    } catch (error) {
      console.error("Error loading items", error);
    }
  }

  const saveItems = async(updatedItems: BatteryStatsInfo[]) => {
    // Save the items to storage
    try {
      await AsyncStorage.setItem(STORAGE_BATTERY_INFO, JSON.stringify(updatedItems));
    } catch (error) {
      console.error("Error saving items", error);
    }
  }

  const clearItems = async() => {
    // Clear existing items and save the empty list to storage
    const updatedItems: BatteryStatsInfo[] = [];
    setItems(updatedItems);
    await saveItems(updatedItems);
  }

  const readFileContent = async (filename: string | undefined) => {
    await getBatteryStats(filename)
      .then(batteryInfo => {
        const updatedItems = [...items, batteryInfo];
        setItems(updatedItems);
        saveItems(updatedItems)
      })
      .catch(err => {
        console.log(err);
      });
  }

  const readFileContentDefault = async () => {
    return await readFileContent(undefined);
  }

  const readFileContentTest = async () => {
    return await readFileContent('/storage/emulated/0/test-cycle_count');
  }

  useEffect(() => {
    // Load items on the application start
    loadItems().catch((error) => {
      console.error("Failed to load items:", error);
    });
  }, [])

  return (
    <View style={styles.container}>
      <Button title="Clear Statistics"
              onPress={clearItems}/>
      <Button title="Get Battery Statistics (default)"
              onPress={readFileContentDefault} />
      <Button title="Get Battery Statistics (test)"
              onPress={readFileContentTest} />
      <FlatList
          data={items}
          stickyHeaderIndices={[0]}
          ListHeaderComponent={BatteryInfoHeader}
          renderItem={({item}: ListRenderItemInfo<BatteryStatsInfo>) => (
              <BatteryInfo key={item.timestamp}
                           timestamp={item.timestamp}
                           cycleCount={item.cycleCount || 0}
              />
          )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
