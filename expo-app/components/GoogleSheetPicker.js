import { React, useEffect, useState } from "react";
import { StyleSheet, View, Text } from "react-native";

import { listGoogleSheets } from "../fun/googleSheets";

export default function GoogleSheetPicker() {
  const [spreadsheets, setSpreadsheets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      await listGoogleSheets(setSpreadsheets, setLoading);
      console.log(spreadsheets);
    };
    fetchData();
  }, [listGoogleSheets, spreadsheets, setSpreadsheets, loading, setLoading]);

  return (
    <View style={styles.container}>
      loading? <Text>Loading...</Text> : <Text>Done!</Text>
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
