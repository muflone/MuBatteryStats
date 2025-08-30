import ManageExternalStorage from 'react-native-external-storage-permission';
import RNFS from 'react-native-fs';

const ANDROID_BATTERY_CYCLE_COUNT: string = '/sys/class/power_supply/battery/cycle_count';

export interface BatteryStatInfo {
  timestamp: number;
  cycleCount: number;
}

export async function getBatteryStat(
    batteryFileName: string = ANDROID_BATTERY_CYCLE_COUNT
  ): Promise<BatteryStatInfo> {
  // Get battery statistics information
  const hasPermission = await ManageExternalStorage.checkAndGrantPermission();
  if (hasPermission) {
    const cycleCount: number = parseInt(
      await RNFS.readFile(batteryFileName, 'utf8'),
      10);
    return {
      timestamp: Date.now(),
      cycleCount: cycleCount,
    }
  } else {
    // No permission granted
    throw new Error('Unable to obtain permission');
  }
}
