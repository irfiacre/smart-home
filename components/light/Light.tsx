import { Dimensions, Platform, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { LightSensor } from "expo-sensors";
import { BarChart } from "react-native-chart-kit";
import { useNavigation } from "expo-router";
import * as Brightness from "expo-brightness";
import * as Device from "expo-device";

const chartConfigs = {
  backgroundColor: "#1d78d6",
  backgroundGradientFrom: "#1d78d6",
  backgroundGradientTo: "#00d4ff",
  decimalPlaces: 0, // optional, defaults to 2dp
  color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
  style: {
    borderRadius: 10,
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
    navigation
      .getParent()
      ?.getParent()
      ?.setOptions({
        title: "Ambient Light Analysis",
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
    LightSensor.setUpdateInterval(100);
    this._subscription = LightSensor.addListener((data: any) => {
      // console.log("-------", data.illuminance);

      setData((prevState: any) => ({
        ...prevState,
        illuminance: data.illuminance,
      }));
      if (Device.isDevice) {
        (async () => {
          const { status } = await Brightness.requestPermissionsAsync();
          if (status === "granted") {
            Brightness.setSystemBrightnessAsync(
              data.illuminance <= 300 ? 0.3 : 1
            );
          }
        })();
      }
    });
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

  const dimData = Math.max(...lightData.filter((elt: any) => elt <= 50));
  const brightData = Math.max(...lightData.filter((elt: any) => elt >= 300));
  const mediumData = Math.max(
    ...lightData.filter((elt: any) => elt > 50 && elt <= 300)
  );

  useEffect(() => {}, [illuminance]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Current: {illuminance} lux</Text>
      <View style={styles.chartContainer}>
        <Text style={styles.subtitle}>Current Environment Analysis</Text>
        <BarChart
          style={styles.chart}
          yAxisLabel=""
          yAxisSuffix=""
          data={{
            labels: ["Dimness", "Medium", "Brightness"],
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
          width={Dimensions.get("window").width - 40}
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
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
    textAlign: "center",
    width: "100%",
  },
  subtitle: {
    fontSize: 22,
    fontWeight: "600",
    marginBottom: 10,
    color: "#666",
    textAlign: "center",
    width: "100%",
  },
  chartContainer: {
    width: "100%",
    alignItems: "center",
  },
  chart: {
    marginVertical: 10,
    borderRadius: 16,
  },
});
