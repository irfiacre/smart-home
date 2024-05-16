import { Platform, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import Value from "@/components/steps/Value";
import RingProgress from "@/components/steps/AnimatedRing";
import { Link, Stack, useNavigation } from "expo-router";
import { Pedometer } from "expo-sensors";
import LightComponent from "@/components/light/Light";

const StepsCounter = () => {
  const navigation = useNavigation();

  const [isPedometerAvailable, setIsPedometerAvailable] = useState("checking");
  const [pastStepCount, setPastStepCount] = useState(0);
  const [currentStepCount, setCurrentStepCount] = useState(0);
  const [yesterdayStepCount, setYesterdayStepCount] = useState(0);

  const subscribe = async () => {
    const isAvailable = await Pedometer.isAvailableAsync();
    setIsPedometerAvailable(String(isAvailable));

    if (isAvailable) {
      const startOfDay = new Date();
      startOfDay.setUTCHours(0, 0, 0, 0);

      const endOfDay = new Date();
      endOfDay.setUTCHours(23, 59, 59, 999);

      const pastStepCountResult = await Pedometer.getStepCountAsync(
        startOfDay,
        endOfDay
      );
      if (pastStepCountResult) {
        setPastStepCount(pastStepCountResult.steps);
      }
      const end = new Date();
      const start = new Date();
      start.setDate(end.getDate() - 1);
      start.setUTCHours(0, 0, 0, 0);

      const yesterdayStepCountResult = await Pedometer.getStepCountAsync(
        start,
        startOfDay
      );
      if (yesterdayStepCountResult) {
        setYesterdayStepCount(yesterdayStepCountResult.steps);
      }

      return Pedometer.watchStepCount((result) => {
        setCurrentStepCount(result.steps);
      });
    }
  };
  useEffect(() => {
    navigation.getParent()?.setOptions({
      title: "Steps Count(Pedometer)",
      headerRight: () => null,
    });
    const subscription: any = subscribe();

    return () => subscription && subscription.remove();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        You have taken: {`${currentStepCount} Steps`}
      </Text>
      <RingProgress progress={pastStepCount / 10000} />
      <View style={styles.valuesContainer}>
        <View style={styles.values}>
          <Value label="Today" value={`${pastStepCount}`} />
          <Value
            label="Distance covered"
            value={`${(pastStepCount * 0.0008).toFixed(2)} Km`}
          />
          <Value label="Yesterday steps" value={`${yesterdayStepCount}`} />
        </View>
      </View>
    </View>
  );
};

export default Platform.OS == "ios" ? StepsCounter : LightComponent;

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
  },
  title: {
    fontSize: 34,
    fontWeight: "700",
    paddingVertical: "10%",
  },
  valuesContainer: {
    paddingHorizontal: "10%",
    paddingVertical: "10%",
  },
  values: {
    flexDirection: "row",
    gap: 10,
    flexWrap: "wrap",
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
  linkText: {
    fontSize: 14,
    color: "#2e78b7",
  },
});
