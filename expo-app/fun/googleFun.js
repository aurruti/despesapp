import { API_URL, GOOGLE_CLIENT_ID } from "@env";
import * as WebBrowser from "expo-web-browser";
import * as SecureStore from "expo-secure-store";
import { ToastAndroid, Linking } from "react-native";

export async function loginGoogle() {
  async function handleDeepLink() {
    Linking.addEventListener("url", async (event) => {
      const url = event.url;
      const queryParams = new URLSearchParams(new URL(url).search);
      const sessionToken = queryParams.get("session_token");
      const userInfo = queryParams.get("user_info");

      if (sessionToken) {
        await SecureStore.setItemAsync("sessionToken", sessionToken);
        await SecureStore.setItemAsync("userInfo", userInfo);
        console.log("Logged in successfully");
        ToastAndroid.show("Sessió iniciada correctament.", ToastAndroid.SHORT);
      } else {
        console.warn("Login failed: No session token");
        ToastAndroid.show(
          "Error al iniciar sessió: No s'ha trobat el token de sessió.",
          ToastAndroid.SHORT
        );
      }
    });
  }

  try {
    handleDeepLink();

    const googleAuthUrl =
      `https://accounts.google.com/o/oauth2/v2/auth?` +
      `client_id=${GOOGLE_CLIENT_ID}` +
      `&redirect_uri=${encodeURIComponent(`${API_URL}/api/oauth/callback`)}` +
      `&response_type=code` +
      `&scope=${encodeURIComponent("email profile")}` +
      `&access_type=offline` +
      "&prompt=consent";
    const redirectUri = `${API_URL}/api/oauth/callback`;
    console.log(redirectUri);
    // Open browser for Google login
    const result = await WebBrowser.openAuthSessionAsync(
      googleAuthUrl,
      redirectUri
    );
    WebBrowser.maybeCompleteAuthSession();

    console.log(result);

    if (result.type === "success") {
      console.log("Check correct.");
      ToastAndroid.show("Check correct.", ToastAndroid.SHORT);
    } else {
      ToastAndroid.show(
        "Error al iniciar sessió: " + result.type,
        ToastAndroid.SHORT
      );
      console.warn("Login failed: " + result.type);
    }
  } catch (error) {
    console.error("Login failed: " + error.message);
  }
  return null;
}

export async function checkSession() {
  try {
    const sessionToken = await SecureStore.getItemAsync("sessionToken");
    if (!sessionToken) {
      console.warn("No session found");
      return;
    }

    const response = await fetch(`${API_URL}/api/me`, {
      headers: {
        Authorization: `Bearer ${sessionToken}`,
      },
    });

    const data = await response.json();
    console.log(`Session active for: ${data.email}`);
    return data.name;
  } catch (error) {
    console.error("Session check failed: " + error.message);
  }
  return null;
}

export async function logoutGoogle() {
  try {
    const sessionToken = await SecureStore.getItemAsync("sessionToken");
    if (sessionToken) {
      await fetch(`${API_URL}/api/logout`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${sessionToken}`,
        },
      });
      await SecureStore.deleteItemAsync("sessionToken");
      console.log("Logged out successfully");
      ToastAndroid.show("S'ha tancat la sessió.", ToastAndroid.SHORT);
    } else {
      console.log("No session to logout");
      ToastAndroid.show("No hi ha cap sessió per tancar.", ToastAndroid.SHORT);
    }
  } catch (error) {
    ToastAndroid.show("Error al tancar la sessió.", ToastAndroid.SHORT);
    console.error("Logout failed: " + error.message);
  }
  return null;
}
