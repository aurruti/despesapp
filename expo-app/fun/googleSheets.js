import { API_URL } from "@env";
import * as SecureStore from "expo-secure-store";

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
  } catch (e) {
    setError("Error adding sheet: " + e.message);
  }
}
