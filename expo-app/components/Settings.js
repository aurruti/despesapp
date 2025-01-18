import { useEffect } from "react";
import {
  AppState,
  ToastAndroid,
  BackHandler,
  Text,
  View,
  StyleSheet,
} from "react-native";
import { StatusBar } from "expo-status-bar";

import { loginGoogle, checkSession, logoutGoogle } from "../fun/googleFun.js";
import Button from "./Button";
import CircleButton from "./CircleButton";
import SettingsBox from "./SettingsBox";

export default function SettingsScreen({
  setShowAppOptions,
  setShowAddType,
  setShowAddSpending,
  setLanguage,
  setCurrency,
  setRowOffset,
  setColOffset,
  preferencesFilePath,
}) {
  exitAction = () => {
    setShowAddType(false);
    setShowAddSpending(false);
    setShowAppOptions(false);
  };

  useEffect(() => {
    // Handle Back Button Press
    const handleBackButtonPress = () => {
      exitAction();
      return true;
    };
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      handleBackButtonPress
    );

    const subscription = AppState.addEventListener("change", (nextAppState) => {
      console.log(`App state changed to: ${nextAppState}`);
    });

    return () => {
      backHandler.remove();
      subscription.remove();
    };
  }, [exitAction]);

  async function checkSessionWithToast() {
    const session_name = await checkSession();
    if (session_name) {
      ToastAndroid.show(
        `Sessió activa per a: ${session_name}`,
        ToastAndroid.SHORT
      );
    } else {
      ToastAndroid.show("No hi ha cap sessió activa.", ToastAndroid.SHORT);
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.topContainer}>
        <CircleButton
          type="exit-top"
          border="#25292e"
          onPress={() => {
            setShowAppOptions(false);
            setShowAddType(false);
            setShowAddSpending(false);
          }}
        />
        <View style={[styles.placeholder, { flex: 5 / 6 }]} />
        <Text style={styles.title}> Configuració </Text>
      </View>
      <View style={{ justifyContent: "center", alignItems: "center" }}>
        <Button
          label="Autentica't a Google"
          onPress={async () => await loginGoogle()}
        />
        <Button
          label="Comprova la sessió"
          onPress={async () => await checkSessionWithToast()}
        />
        <Button
          label="Tanca la sessió"
          onPress={async () => await logoutGoogle()}
        />
        <View style={styles.placeholder} />
        <View style={styles.settingsContainer}>
          <SettingsBox
            title="Codi d'Idioma"
            preferenceName="language"
            preferencesFilePath={preferencesFilePath}
            setPreferenceVar={setLanguage}
          />
          <SettingsBox
            title="Símbol de Moneda"
            preferenceName="currency"
            preferencesFilePath={preferencesFilePath}
            setPreferenceVar={setCurrency}
          />
          <SettingsBox
            title="Offset de Columna"
            preferenceName="colOffset"
            preferencesFilePath={preferencesFilePath}
            setPreferenceVar={setColOffset}
          />
          <SettingsBox
            title="Offset de Fila"
            preferenceName="rowOffset"
            preferencesFilePath={preferencesFilePath}
            setPreferenceVar={setRowOffset}
          />
        </View>
      </View>
      <StatusBar style="dark" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#25292e",
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: 25,
    gap: 12,
  },
  title: {
    color: "white",
    paddingTop: 2,
    fontSize: 27,
    fontWeight: "bold",
  },
  topContainer: {
    flexDirection: "row-reverse",
    justifyContent: "flex-start",
    alignItems: "center",
    height: 60,
    width: "100%",
    position: "absolute",
    top: 60,
  },
  settingsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    alignItems: "flex-start",
    width: "100%",
    paddingTop: "10%",
    paddingLeft: "10%",
    paddingRight: "10%",
    rowGap: 20,
  },
  placeholder: {
    height: "20%",
  },
});
