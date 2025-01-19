import { useState, useEffect } from "react";
import { Alert, ToastAndroid, View, StyleSheet } from "react-native";
import { StatusBar } from "expo-status-bar";
import * as FileSystem from "expo-file-system";

import Button from "./components/Button";
import CircleButton from "./components/CircleButton";
import AddSpendingBox from "./components/AddSpendingBox";
import AddTypeBox from "./components/AddTypeBox";
import SettingsScreen from "./components/Settings";
import MonthPicker from "./components/MonthPicker";
import appStartup from "./fun/filestartup.js";
import { checkLoggedIn, refreshToken } from "./fun/googleFun.js";

const preferencesFilePath = `${FileSystem.documentDirectory}preferences.json`;
const typelistFilePath = `${FileSystem.documentDirectory}typelist.json`;
const monthYearFilePath = `${FileSystem.documentDirectory}monthyear.json`;

export default function App() {
  const [showAppOptions, setShowAppOptions] = useState(false);
  const [showAddSpending, setShowAddSpending] = useState(false);
  const [showAddType, setShowAddType] = useState(false);
  const [showMonthPicker, setShowMonthPicker] = useState(false);
  const [showFilePicker, setShowFilePicker] = useState(false);

  const [language, setLanguage] = useState("");
  const [currency, setCurrency] = useState("");
  const [colOffset, setColOffset] = useState(0);
  const [rowOffset, setRowOffset] = useState(0);
  const [currentSheet, setCurrentSheet] = useState("");

  const [currentMonth, setCurrentMonth] = useState("");
  const [currentMonthLoc, setCurrentMonthLoc] = useState("");
  const [currentYear, setCurrentYear] = useState("");
  const currentMonthYearLoc = `${currentMonthLoc} ${currentYear}`;

  const [spendAmount, setSpendAmount] = useState("");
  const [spendType, setSpendType] = useState("");

  const [loggedIn, setLoggedIn] = useState(false);

  {
    /*INITIALIZATION */
  }
  useEffect(() => {
    const Startup = async () => {
      try {
        await appStartup(
          preferencesFilePath,
          typelistFilePath,
          monthYearFilePath
        );

        const preferencesData = await FileSystem.readAsStringAsync(
          preferencesFilePath
        );
        const { language, currency, lastSheet, colOffset, rowOffset } =
          JSON.parse(preferencesData);
        setLanguage(language);
        setCurrency(currency);
        setCurrentSheet(lastSheet);
        setColOffset(colOffset);
        setRowOffset(rowOffset);

        const monthYearData = await FileSystem.readAsStringAsync(
          monthYearFilePath
        );
        const [timeEntry] = JSON.parse(monthYearData);
        const { month, year, locMonth } = timeEntry;
        setCurrentMonth(month);
        setCurrentYear(year);
        setCurrentMonthLoc(locMonth);
      } catch (error) {
        console.error("DespesApp Startup Error:", error);
      }
    };

    const TokenRefreshWrap = async () => {
      await checkLoggedIn(setLoggedIn);
      if (loggedIn) {
        await refreshToken();
      }
    };

    Startup();
    TokenRefreshWrap();
  }, []);

  const triggerAddSpend = async () => {
    ToastAndroid.show(
      "La despesa s'ha afegit correctament",
      ToastAndroid.SHORT
    );
    setSpendAmount("");
  };

  return (
    <View style={styles.container}>
      {showAppOptions ? (
        <SettingsScreen
          setShowAppOptions={setShowAppOptions}
          setShowAddType={setShowAddType}
          setShowAddSpending={setShowAddSpending}
          setLanguage={setLanguage}
          setCurrency={setCurrency}
          setRowOffset={setRowOffset}
          setColOffset={setColOffset}
          preferencesFilePath={preferencesFilePath}
          loggedIn={loggedIn}
          setLoggedIn={setLoggedIn}
        />
      ) : (
        <>
          <View style={styles.topContainer}>
            <CircleButton
              type="settings"
              border="transparent"
              onPress={() => {
                setShowAppOptions(true);
                setShowAddType(false);
                setShowAddSpending(false);
              }}
            />
          </View>
          {showAddType ? (
            <AddTypeBox
              currentSheet={currentSheet}
              typelistpath={typelistFilePath}
              returnAction={() => setShowAddType(false)}
              exitAction={() => {
                setShowAddSpending(false);
                setShowAddType(false);
              }}
            />
          ) : showAddSpending ? (
            <AddSpendingBox
              currentSheet={currentSheet}
              currency={currency}
              typelistFilePath={typelistFilePath}
              amount={spendAmount}
              setAmount={setSpendAmount}
              typeSpend={spendType}
              setTypeSpend={setSpendType}
              addAction={triggerAddSpend}
              addTypeAction={() => setShowAddType(true)}
              exitAction={() => setShowAddSpending(false)}
            />
          ) : showMonthPicker && !showAppOptions ? (
            <MonthPicker
              monthYearFilePath={monthYearFilePath}
              language={language}
              currentMonth={currentMonth}
              setCurrentMonth={setCurrentMonth}
              currentMonthLoc={currentMonthLoc}
              setCurrentMonthLoc={setCurrentMonthLoc}
              currentYear={currentYear}
              setCurrentYear={setCurrentYear}
              exitAction={() => setShowMonthPicker(false)}
            />
          ) : (
            <CircleButton
              type="add"
              border="#6CD049"
              onPress={() => setShowAddSpending(true)}
            />
          )}
          <View style={styles.optionsRow}>
            <Button
              theme="spreadsheet"
              label={currentSheet}
              onPress={() =>
                Alert.alert(
                  "No disponible",
                  "L'opció de canviar de full de despeses encara no està implementada. Vindrà en properes actualizacions de l'app!"
                )
              }
            />
            <Button
              theme="month"
              label={showMonthPicker ? "Torna a l'inici" : currentMonthYearLoc}
              onPress={() => {
                setShowMonthPicker(!showMonthPicker);
                setShowAddType(false);
                setShowFilePicker(false);
                setShowAddSpending(false);
              }}
            />
          </View>
        </>
      )}
      <StatusBar style="dark" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#25292e",
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: 25,
    gap: 12,
  },

  topContainer: {
    flexDirection: "row-reverse",
    justifyContent: "flex-start",
    alignItems: "center",
    height: 60,
    width: "100%",
    position: "absolute",
    top: 60,
  },
  optionsRow: {
    alignItems: "center",
    flexDirection: "row",
    position: "absolute",
    bottom: 50,
  },
});
