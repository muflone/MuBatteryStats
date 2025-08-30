import { useState } from 'react';
import {
  Button,
  FlatList,
  ListRenderItemInfo,
  StatusBar,
  StyleSheet,
  useColorScheme,
  View,
} from 'react-native';

import AsyncStorageDevTools from 'react-native-async-storage-devtools';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import {
  BatteryStatsInfo,
  getBatteryStat
} from './src/getBatteryStat.tsx';
import {
  BatteryInfo,
  BatteryInfoHeader
} from './src/components/BatteryInfo.tsx';

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

  const readFileContent = async (filename: string | undefined) => {
    await getBatteryStat(filename)
      .then(batteryInfo => {
        setItems([...items, batteryInfo]);
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

  return (
    <View style={styles.container}>
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
