import moment from 'moment';

import { StyleSheet, Text, View, ViewStyle } from 'react-native';
import { BatteryStatsInfo } from '../getBatteryStats.tsx';

interface BatteryInfoProps extends BatteryStatsInfo {
  style?: ViewStyle;
}

interface BatteryInfoHeaderProps {
  style?: ViewStyle
}

const BatteryInfoStyle = StyleSheet.create({
  container: {
    flexDirection: "row",
  },
  item: {
    flexGrow: 1,
    padding: 5,
    marginBottom: 5,
    borderStyle: "solid",
    borderColor: "red",
    borderWidth: 1,
  },
  header: {
    textAlign: "center",
    fontWeight: "bold",
    backgroundColor: "lightgrey",
  },
  column1: {
    width: "50%",
  },
  column2: {
    width: "50%",
  },
  timestamp: {
    textAlign: "left",
  },
  data: {
    fontWeight: "bold",
    textAlign: "right",
  }
});

export function BatteryInfo(props: BatteryInfoProps) {
  const formattedDateTime = moment(new Date(props.timestamp)).format('YYYY-MM-DD HH:mm.ss');
  return (
    <View style={BatteryInfoStyle.container}>
      <Text style={[BatteryInfoStyle.item,
                    BatteryInfoStyle.timestamp,
                    BatteryInfoStyle.column1,
                    props.style]}>{formattedDateTime}</Text>
      <Text style={[BatteryInfoStyle.item,
                    BatteryInfoStyle.data,
                    BatteryInfoStyle.column2,
                    props.style]}>{props.cycleCount}</Text>
    </View>
  );
}

export function BatteryInfoHeader(props: BatteryInfoHeaderProps) {
  return (
    <View style={BatteryInfoStyle.container}>
      <Text style={[BatteryInfoStyle.item,
                    BatteryInfoStyle.header,
                    BatteryInfoStyle.column1,
                    props.style]}>Timestamp</Text>
      <Text style={[BatteryInfoStyle.item,
                    BatteryInfoStyle.header,
                    BatteryInfoStyle.column2,
                    props.style]}>Cycle counts</Text>
    </View>
  );
}