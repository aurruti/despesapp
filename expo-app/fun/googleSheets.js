import { API_URL } from "@env";
import * as SecureStore from "expo-secure-store";
import { ToastAndroid } from "react-native";

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
  setSheets,
  setError
) {
  try {
    const sheetId = extractSheetId(newSheetUrl);
    if (!sheetId) {
      setError("Invalid sheet URL or ID");
      return;
    }

    // Verify sheet access
    const sessionToken = await SecureStore.getItemAsync("sessionToken");
    const response = await fetch(`${API_URL}/api/sheets/verify/${sheetId}`, {
      headers: {
        Authorization: `Bearer ${sessionToken}`,
      },
    });
    if (!response.ok) {
      throw new Error("Unable to access sheet");
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
    setError("");
    return sheetData.name, sheetData.id;
  } catch (e) {
    setError("Error adding sheet: " + e.message);
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
    console.log(currentMonthLoc, currentYear, sheetName, sheetId);
    await fetch(`${API_URL}/api/sheets/addspending`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionToken}`,
      },
      body: JSON.stringify({
        sheetId,
        amount,
        type,
        month,
        year,
        colOffset,
        rowOffset,
      }),
    });

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
  } catch (e) {
    console.error("Error adding spending:", e);
    ToastAndroid.show("No s'ha pogut afegir la despesa.", ToastAndroid.SHORT);
  }
}
