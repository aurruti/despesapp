import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  Pressable,
  StyleSheet,
  ToastAndroid,
} from "react-native";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import * as FileSystem from "expo-file-system";

import { loadSavedSheets, addNewSheet } from "../fun/googleSheets";
import { LoadingOverlay } from "./Loading";

export default function GoogleSheetPicker({
  setCurrentSheet,
  currentSheetId,
  setCurrentSheetId,
  preferencesFilePath,
}) {
  const [sheets, setSheets] = useState([]);
  const [newSheetUrl, setNewSheetUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadSavedSheets(setSheets);
  }, [loadSavedSheets, setSheets]);

  async function newSheet() {
    if (!isLoading) {
      setIsLoading(true);
      const [newSheetName, newSheetId] = await addNewSheet(
        newSheetUrl,
        setNewSheetUrl,
        sheets,
        setSheets
      );
      setIsLoading(false);
      setNewSheetUrl("");
      if (newSheetName) {
        setCurrentSheet(newSheetName);
        setCurrentSheetId(newSheetId);
      }
    } else {
      console.warn("Aborted addNewSheet: something is still loading.");
    }
  }

  async function changeSheet(id, name) {
    setCurrentSheet(name);
    setCurrentSheetId(id);
    try {
      let preferences = JSON.parse(
        await FileSystem.readAsStringAsync(preferencesFilePath)
      );
      preferences["lastSheet"] = name;
      preferences["lastSheetId"] = id;
      await FileSystem.writeAsStringAsync(
        preferencesFilePath,
        JSON.stringify(preferences)
      );
      console.log("Sheet changed to: ", name, " with ID: ", id);
      ToastAndroid.show("S'ha sel·leccionat: " + name, ToastAndroid.SHORT);
    } catch (error) {
      console.error("Error changing sheet:", error);
      ToastAndroid.show(
        "Hi ha hagut un error en sel·leccionar el full.",
        ToastAndroid.SHORT
      );
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.inputSuperContainer}>
        <Text style={{ color: "white", fontSize: 10 }}>
          {isLoading
            ? "S'està afegint el nou full..."
            : "Afegeix un nou full amb URL o codi"}
        </Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={newSheetUrl}
            onChangeText={setNewSheetUrl}
          />
          <LoadingOverlay
            visible={isLoading}
            borderRadius={4}
            marginTop={0}
            color="white"
            backgroundColor={styles.button.backgroundColor}
            opacity={1}
            scale={0.7}
          />
          <Pressable
            style={styles.button}
            onPress={() => {
              newSheet();
            }}
          >
            <Text style={styles.buttonText}>Afegeix</Text>
          </Pressable>
        </View>
      </View>

      <FlatList
        data={sheets}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Pressable
            style={styles.sheetItem}
            onPress={() => {
              changeSheet(item.id, item.name);
            }}
          >
            <MaterialCommunityIcons
              name={
                item.id === currentSheetId
                  ? "checkbox-marked-circle-outline"
                  : "checkbox-blank-circle-outline"
              }
              color="white"
              size={18}
              marginTop={1}
              marginRight={10}
            />
            <Text
              style={{
                color: "white",
                fontWeight: item.id === currentSheetId ? "bold" : "normal",
              }}
            >
              {item.name}
            </Text>
          </Pressable>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: "40%",
    padding: 16,
  },
  inputSuperContainer: {
    flexDirection: "column",
    gap: 5,
    width: "100%",
    justifyContent: "left",
  },
  inputContainer: {
    flexDirection: "row",
    marginBottom: 16,
    alignContent: "center",
    justifyContent: "center",
    height: 35,
    width: "100%",
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    padding: 8,
    marginRight: 8,
    color: "#C3CBCA",
    pla: "#C3CBCA",
  },
  button: {
    backgroundColor: "#007AFF",
    padding: 8,
    borderRadius: 4,
    justifyContent: "center",
  },
  buttonText: {
    color: "white",
  },
  sheetItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
  },
});
