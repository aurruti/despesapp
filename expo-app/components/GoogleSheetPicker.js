import { React, useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { WebView } from "react-native-webview";

import { pickGoogleSheet } from "../fun/googleSheets";

export default function GoogleSheetPicker() {
  const { htmlContent, setHtmlContent } = useState("");

  useEffect(() => {
    const fetchData = async () => {
      await pickGoogleSheet(setHtmlContent);
    };
    fetchData();
  }, [pickGoogleSheet, setHtmlContent]);

  return (
    <View style={styles.container}>
      <WebView
        originWhitelist={["*"]}
        source={{ html: htmlContent }}
        style={styles.webview}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  webview: {
    flex: 1,
  },
});
