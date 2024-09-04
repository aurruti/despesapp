import { useState, useEffect } from 'react';
import { Alert, ToastAndroid, View, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import * as FileSystem from 'expo-file-system';

import Button from './components/Button';
import CircleButton from './components/CircleButton';
import AddSpendingBox from './components/AddSpendingBox';
import AddTypeBox from './components/AddTypeBox';
import SettingsScreen from './components/Settings';
import MonthPicker from './components/MonthPicker';
import appStartup from './fun/filestartup.js';

const preferencesFilePath = `${FileSystem.documentDirectory}preferences.json`;
const typelistFilePath = `${FileSystem.documentDirectory}typelist.json`;
const monthYearFilePath = `${FileSystem.documentDirectory}monthyear.json`;

export default function App() {
  const [showAppOptions, setShowAppOptions] = useState(false);
  const [showAddSpending, setShowAddSpending] = useState(false);
  const [showAddType, setShowAddType] = useState(false);
  const [showMonthPicker, setShowMonthPicker] = useState(false);
  const [showFilePicker, setShowFilePicker] = useState(false);

  const [language, setLanguage] = useState('');
  const [currency, setCurrency] = useState('');
  const [currentSheet, setCurrentSheet] = useState('');

  const [currentMonth, setCurrentMonth] = useState('');
  const [currentMonthLoc, setCurrentMonthLoc] = useState('');
  const [currentYear, setCurrentYear] = useState('');
  const currentMonthYearLoc = `${currentMonthLoc} ${currentYear}`;

  const [spendAmount, setSpendAmount] = useState('');
  const [spendType, setSpendType] = useState('');

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

        const preferencesData = await FileSystem.readAsStringAsync(preferencesFilePath);
        const { language, currency, lastSheet } = JSON.parse(preferencesData);
        setLanguage(language);
        setCurrency(currency);
        setCurrentSheet(lastSheet);

        const monthYearData = await FileSystem.readAsStringAsync(monthYearFilePath);
        const [timeEntry] = JSON.parse(monthYearData);
        const { month, year, locMonth } = timeEntry;
        setCurrentMonth(month);
        setCurrentYear(year);
        setCurrentMonthLoc(locMonth);
      } catch (error) {
        console.error('DespesApp Startup Error:', error);
      }
    };

    Startup();
  }, []);

  const triggerTestScript = async () => {
    try {
      const response = await fetch(ngrokurl + 'test-script', {
        headers: {
          'ngrok-skip-browser-warning': 'true',
        },
      });
      const data = await response.json();
      Alert.alert('Bon Test!', data.message);
    } catch (e) {
      console.log(e);
      Alert.alert('Error', "No s'ha pogut exectuar el test.");
    }
  };

  const triggerAdd100Script = async () => {
    const data = {
      where: 'localcsv',
      file: 'despesa.csv',
      month: 'Agost',
      month_row: 0,
      money_type: 'Altres',
      money_type_col: 0,
      money: 100,
      col_offset: 0,
    };

    try {
      const response = await fetch(ngrokurl + 'add-expense', {
        method: 'POST',
        headers: {
          'ngrok-skip-browser-warning': 'true',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      Alert.alert('Fet!', result.message);
    } catch (error) {
      Alert.alert('Error', 'Alguna cosa no ha anat bé...');
    }
  };

  const triggerAddSpend = async () => {
    ToastAndroid.show(
      "La despesa s'ha afegit correctament",
      ToastAndroid.SHORT
    );
    setSpendAmount('');
  };

  return (
    <View style={styles.container}>
      {showAppOptions ? (
        <SettingsScreen
          currentSheet={currentSheet}
          typelistFilePath={typelistFilePath}
          showAppOptions={showAppOptions}
          setShowAppOptions={setShowAppOptions}
          showAddType={showAddType}
          setShowAddType={setShowAddType}
          showAddSpending={showAddSpending}
          setShowAddSpending={setShowAddSpending}
          triggerTestScript={triggerTestScript}
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
            < MonthPicker
              monthYearFilePath = {monthYearFilePath} language = {language}
              currentMonth = {currentMonth} setCurrentMonth = {setCurrentMonth}
              currentMonthLoc = {currentMonthLoc} setCurrentMonthLoc = {setCurrentMonthLoc}
              currentYear = {currentYear} setCurrentYear = {setCurrentYear}
              exitAction = {() => setShowMonthPicker(false)}
            />
          ) : (
            <CircleButton
              type="add"
              border="#6CD049"
              onPress={() => setShowAddSpending(true)}
            />
          )}
          <View style={styles.optionsRow}>
            <Button theme="spreadsheet" label={currentSheet} onPress = {()=> Alert.alert("No disponible", "L'opció de canviar de full de despeses encara no està implementada. Vindrà en properes actualizacions de l'app!")} />
            <Button theme="month" label={currentMonthYearLoc} onPress={()=>{
                setShowMonthPicker(!showMonthPicker); setShowAddType(false); 
                setShowFilePicker(false); setShowAddSpending(false)
              }} />
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
    backgroundColor: '#25292e',
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 25,
    gap: 12,
  },

  topContainer: {
    flexDirection: 'row-reverse',
    justifyContent: 'flex-start',
    alignItems: 'center',
    height: 60,
    width: '100%',
    position: 'absolute',
    top: 60,
    zIndex: -10,
  },
  optionsRow: {
    alignItems: 'center',
    flexDirection: 'row',
    position: 'absolute',
    bottom: 50,
  },
});
