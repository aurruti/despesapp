import { API_URL } from "@env";
import * as SecureStore from "expo-secure-store";
import { Alert, ToastAndroid } from "react-native";

const STORAGE_KEY = "accessedSheets";

export async function loadSavedSheets(setSheets) {
  try {
    const savedSheets = await SecureStore.getItemAsync(STORAGE_KEY);
    if (savedSheets) {
      setSheets(JSON.parse(savedSheets));
    }
  } catch (e) {
    console.error("Error loading sheets:", e);
  }
}

const extractSheetId = (url) => {
  // Handle both URLs and direct IDs
  try {
    if (url.includes("/")) {
      // It's a URL - extract the ID
      const matches = url.match(/[-\w]{25,}/);
      return matches ? matches[0] : null;
    }
    // Assume it's already an ID
    return url;
  } catch (e) {
    return null;
  }
};

export async function addNewSheet(
  newSheetUrl,
  setNewSheetUrl,
  sheets,
  setSheets
) {
  try {
    const sheetId = extractSheetId(newSheetUrl);
    if (!sheetId) {
      Alert.alert(
        "Error en afegir el full",
        "La URL o el codi proporcionat no és vàlid."
      );
      return [null, null];
    }

    // Verify sheet access
    const sessionToken = await SecureStore.getItemAsync("sessionToken");
    const response = await fetch(`${API_URL}/api/sheets/verify/${sheetId}`, {
      headers: {
        Authorization: `Bearer ${sessionToken}`,
      },
    });
    if (!response.ok) {
      throw new Error(
        "No s'ha pogut accedir al full. Comproveu que el codi o la URL sigui correcta i que el vostre compte de Google hi tingui accés."
      );
    }

    const sheetData = await response.json();

    // Add to local storage
    const newSheet = {
      id: sheetId,
      name: sheetData.name,
    };

    const updatedSheets = [...sheets, newSheet];
    await SecureStore.setItemAsync(STORAGE_KEY, JSON.stringify(updatedSheets));
    setSheets(updatedSheets);
    setNewSheetUrl("");
    return sheetData.name, sheetData.id;
  } catch (e) {
    Alert.alert("Error en afegir el full", e.message);
    return [null, null];
  }
}

export async function addSpendingToSheet(
  amount,
  type,
  sheetName,
  sheetId,
  currentMonthLoc,
  currentYear,
  colOffset,
  rowOffset
) {
  try {
    const sessionToken = await SecureStore.getItemAsync("sessionToken");
    console.log("Attempting to add spending to sheet", sheetId);
    console.log(type, currentMonthLoc, currentYear, sheetName, sheetId);
    const response = await fetch(`${API_URL}/api/sheets/addspending`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionToken}`,
      },
      body: JSON.stringify({
        sheetId,
        amount,
        type,
        month: currentMonthLoc,
        year: currentYear,
        colOffset,
        rowOffset,
      }),
    });

    console.log("Response status:", response.status);
    if (response.status !== 200) {
      const errorData = await response.json();
      if (response.status === 500) {
        Alert.alert("No s'ha pogut afegir la despesa", errorData.detail);
      } else {
        throw new Error(errorData.detail);
      }
    } else {
      console.log(
        "Added",
        amount,
        "under type",
        type,
        "for ",
        currentMonthLoc,
        currentYear,
        "to",
        sheetName,
        "(" + sheetId + ") with offset (row, col)",
        rowOffset,
        colOffset
      );
      ToastAndroid.show("S'ha afegit la despesa.", ToastAndroid.SHORT);
    }
  } catch (e) {
    console.error("Error adding spending:", e);
    // ToastAndroid.show("No s'ha pogut afegir la despesa.", ToastAndroid.SHORT);
  }
}
