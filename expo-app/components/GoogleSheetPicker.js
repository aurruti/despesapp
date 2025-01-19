import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  Pressable,
  StyleSheet,
} from "react-native";

import { loadSavedSheets, addNewSheet } from "../fun/googleSheets";

export default function GoogleSheetPicker(currentSheet, setCurrentSheet) {
  const [sheets, setSheets] = useState([]);
  const [newSheetUrl, setNewSheetUrl] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    loadSavedSheets(setSheets);
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={newSheetUrl}
          onChangeText={setNewSheetUrl}
          placeholder="Enter Google Sheet URL or ID"
        />
        <Pressable
          style={styles.button}
          onPress={() =>
            addNewSheet(
              newSheetUrl,
              setNewSheetUrl,
              sheets,
              setSheets,
              setError
            )
          }
        >
          <Text style={styles.buttonText}>Add</Text>
        </Pressable>
      </View>

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <FlatList
        data={sheets}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.sheetItem}>
            <Text>{item.name}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  inputContainer: {
    flexDirection: "row",
    marginBottom: 16,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    padding: 8,
    marginRight: 8,
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
  },
  error: {
    color: "red",
    marginBottom: 16,
  },
});
