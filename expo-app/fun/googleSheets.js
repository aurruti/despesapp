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

    const pickerUrl = `${API_URL}/api/sheets/picker?session_token=${sessionToken}`;
    console.log("Picker URL:", pickerUrl);
    await WebBrowser.openAuthSessionAsync(
      pickerUrl,
      `${API_URL}/api/sheets/picker/callback`
    );

    WebBrowser.maybeCompleteAuthSession();
  } catch (error) {
    console.error("Failed to pick Google Sheet:", error);
    ToastAndroid.show("Error selecting Google Sheet", ToastAndroid.SHORT);
  }
}
