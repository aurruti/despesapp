import { API_URL } from "@env";
import * as WebBrowser from "expo-web-browser";
import * as SecureStore from "expo-secure-store";

import { handleDeepLink } from "./googleFun";

export async function pickGoogleSheet() {
  try {
    handleDeepLink();

    const sessionToken = await SecureStore.getItemAsync("sessionToken");
    if (!sessionToken) {
      throw new Error("No session token found. Please log in first.");
    }

    const headers = {
      Authorization: `Bearer ${sessionToken}`,
    };

    const pickerUrl = `${API_URL}/api/sheets/picker`;

    console.log("Picker URL:", pickerUrl);

    const response = await fetch(pickerUrl, { headers });
    const htmlContent = await response.text();

    if (!response.ok) {
      throw new Error(
        `Failed to load Google Sheets picker: ${response.statusText}`
      );
    }

    await WebBrowser.openBrowserAsync(
      `data:text/html,${encodeURIComponent(htmlContent)}`
    );

    WebBrowser.maybeCompleteAuthSession();
  } catch (error) {
    console.error("Failed to pick Google Sheet:", error);
    ToastAndroid.show("Error selecting Google Sheet", ToastAndroid.SHORT);
  }
}
