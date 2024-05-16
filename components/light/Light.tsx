import { Dimensions, Platform, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { LightSensor } from "expo-sensors";
import { BarChart } from "react-native-chart-kit";
import { useNavigation } from "expo-router";

const chartConfigs = {
  backgroundColor: "#1d78d6",
  backgroundGradientFrom: "#1d78d6",
  backgroundGradientTo: "#00d4ff",
  decimalPlaces: 0, // optional, defaults to 2dp
  color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
  style: {
    borderRadius: 16,
  },
  propsForDots: {
    r: "6",
    strokeWidth: "1",
    stroke: "#00d4ff",
  },
};
const LightComponent = () => {
  const [{ illuminance }, setData] = useState({ illuminance: 0 });
  const [lightData, setLightData] = useState<any>([]);
  const navigation = useNavigation();
  useEffect(() => {
    navigation.getParent()?.setOptions({
      title: "Light Sensor(Ambient Light)",
      headerRight: () => null,
    });
    if (Platform.OS === "android") {
      _toggle();

      return () => {
        _unsubscribe();
      };
    } else {
      console.warn(
        `Ambient Sensor is not supported on ${Platform.OS} platform!`
      );
    }
  }, []);

  const _toggle = () => {
    if (this._subscription) {
      _unsubscribe();
    } else {
      _subscribe();
    }
  };

  const _subscribe = () => {
    this._subscription = LightSensor.addListener(setData);
  };

  const _unsubscribe = () => {
    this._subscription && this._subscription.remove();
    this._subscription = null;
  };

  useEffect(() => {
    if (!lightData.includes(illuminance)) {
      setLightData((prev: any) => [...prev, illuminance]);
    }
  }, [illuminance]);
  //   console.log(lightData);

  const dimData = Math.max(...lightData.filter((elt: any) => elt <= 50));
  const brightData = Math.max(...lightData.filter((elt: any) => elt >= 300));
  const mediumData = Math.max(
    ...lightData.filter((elt: any) => elt > 50 && elt <= 300)
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Current: {illuminance} lux</Text>
      <View>
        <Text style={styles.subtitle}>Current Environment Analysis</Text>

        <BarChart
          style={{ margin: 10, borderRadius: 3 }}
          yAxisLabel=""
          yAxisSuffix=""
          data={{
            labels: ["Dim", "Medium", "Bright"],
            datasets: [
              {
                data: [
                  dimData > 0 ? dimData : 0,
                  mediumData > 0 ? mediumData : 0,
                  brightData > 0 ? brightData : 0,
                ],
              },
            ],
          }}
          width={Dimensions.get("window").width - 20}
          height={400}
          chartConfig={chartConfigs}
          verticalLabelRotation={30}
        />
      </View>
    </View>
  );
};

export default LightComponent;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#000",
    padding: 5,
    flexWrap: "wrap",
    width: "95%",
  },
  subtitle: {
    fontSize: 24,
    fontWeight: "400",
    marginBottom: 5,
    color: "grey",
    padding: 5,
  },
});
