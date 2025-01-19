import { API_URL } from "@env";
import * as SecureStore from "expo-secure-store";
import { ToastAndroid } from "react-native";

export async function pickGoogleSheet(setHtmlContent) {
  try {
    console.log("Picking Google Sheet...");

    const sessionToken = await SecureStore.getItemAsync("sessionToken");
    if (!sessionToken) {
      throw new Error("No session token found. Please log in first.");
    }

    const headers = {
      Authorization: `Bearer ${sessionToken}`,
    };

    const pickerUrl = `${API_URL}/api/sheets/picker`;
    const response = await fetch(pickerUrl, { headers });
    const htmlContent = await response.text();

    if (!response.ok) {
      throw new Error(
        `Failed to load Google Sheets picker: ${response.statusText}`
      );
    }

    // Pass the HTML content to a state or handler function
    setHtmlContent(htmlContent);
  } catch (error) {
    console.error("Failed to pick Google Sheet:", error);
    ToastAndroid.show("Error selecting Google Sheet", ToastAndroid.SHORT);
  }
}
