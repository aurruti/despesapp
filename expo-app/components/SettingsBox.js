import { useEffect, useState } from "react";
import { Text, TextInput, ToastAndroid, View, StyleSheet } from "react-native";
import * as FileSystem from "expo-file-system";

import settingsEdition from "../fun/settingsEdition";

export default function SettingsBox({
  title,
  preferenceName,
  preferencesFilePath,
  setPreferenceVar,
}) {
  const [preferenceValue, setPreferenceValue] = useState("");
  let preferences = {};

  useEffect(() => {
    const loadPreference = async () => {
      try {
        preferences = JSON.parse(
          await FileSystem.readAsStringAsync(preferencesFilePath)
        );
        if (preferenceName === "colOffset" || preferenceName === "rowOffset") {
          preferences[preferenceName] = String(preferences[preferenceName]);
        }
        setPreferenceValue(preferences[preferenceName] || "");
      } catch (error) {
        ToastAndroid.show("Error loading preference", ToastAndroid.SHORT);
      }
    };

    loadPreference();
  }, []);

  const handleText = async () => {
    try {
      await settingsEdition(
        preferencesFilePath,
        preferenceName,
        preferenceValue
      );
      ToastAndroid.show(
        "S'han actualitzat les preferències",
        ToastAndroid.SHORT
      );
      preferences = await JSON.parse(
        await FileSystem.readAsStringAsync(preferencesFilePath)
      );
      console.log("New preferences saved: ", preferences);
    } catch (error) {
      console.error("Error updating preference:", error);
      ToastAndroid.show(
        "Error en actualitzar les preferències",
        ToastAndroid.SHORT
      );
    }
    setPreferenceVar(preferenceValue);
  };

  let formattedText = "";
  const checkText = (text) => {
    switch (preferenceName) {
      case "language":
        formattedText = text.replace(/[^a-z]/g, "");
        setPreferenceValue(formattedText);
        break;
      case "currency":
        formattedText = text.replace(/[^a-zA-Z€$¥]/g, "");
        setPreferenceValue(formattedText);
        break;
      case "colOffset":
        formattedText = text.replace(/(?!^-)[^-0-9]/g, "");
        if (formattedText.indexOf("-") > 0) {
          formattedText = formattedText.replace(/-/g, "");
        }
        setPreferenceValue(formattedText);
        break;
      case "rowOffset":
        formattedText = text.replace(/(?!^-)[^-0-9]/g, "");
        if (formattedText.indexOf("-") > 0) {
          formattedText = formattedText.replace(/-/g, "");
        }
        setPreferenceValue(formattedText);
        break;
    }
  };

  return (
    <View style={styles.settingsSubContainer}>
      <Text style={styles.miniTitle}>{title}</Text>
      <TextInput
        style={styles.input}
        value={preferenceValue}
        onChangeText={checkText}
        onEndEditing={handleText}
        onPressOut={handleText}
        maxLength={3}
        keyboardType={
          preferenceName === "colOffset" || preferenceName === "rowOffset"
            ? "numeric"
            : "default"
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  settingsSubContainer: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "flex-start",
    width: "45%",
  },
  miniTitle: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 10,
  },
  input: {
    backgroundColor: "white",
    width: "100%",
    height: 40,
    borderRadius: 5,
    paddingLeft: 10,
  },
});
