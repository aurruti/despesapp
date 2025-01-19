import { API_URL } from "@env";
import * as SecureStore from "expo-secure-store";
import { ToastAndroid } from "react-native";

export async function listGoogleSheets(setSpreadsheets, setLoading) {
  try {
    const sessionToken = await SecureStore.getItemAsync("sessionToken");
    if (!sessionToken) {
      throw new Error("No session token found. Please log in first.");
    }

    const headers = {
      Authorization: `Bearer ${sessionToken}`,
    };

    const response = await fetch(`${API_URL}/api/sheets/list`, { headers });

    if (response.ok) {
      console.log(response);
      const result = await response.json();
      setSpreadsheets(result.spreadsheets);
    } else {
      throw new Error(response.status || "Failed to fetch spreadsheets.");
    }
  } catch (error) {
    console.error("Error fetching spreadsheets:", error);
    ToastAndroid.show("Error loading spreadsheets.", ToastAndroid.SHORT);
  } finally {
    setLoading(false);
  }
}
