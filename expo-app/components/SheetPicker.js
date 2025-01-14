import {useEffect, useState} from 'react';
import {BackHandler, StyleSheet, FlatList, View, Text, ToastAndroid, TextInput} from 'react-native';
import * as FileSystem from 'expo-file-system';

import Button from './Button';

export default function SheetPicker({
  preferencesFilePath,
  currentSheet, setCurrentSheet,
  exitAction
  }) {



  useEffect(() => {
    const handleBackButtonPress = () => {
      exitAction();
      return true;
    };
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      handleBackButtonPress
    );
    return () => {
      backHandler.remove();
    };
  }, [exitAction]); 

  const updateFile = async (newYearNum, newMonthNum) => {
    try {
      const strMonth = locMonth(language, newMonthNum); 
      setCurrentMonthLoc(strMonth);
      const fullTimeData = {
        month: newMonthNum,
        year: newYearNum,
        "locMonth": strMonth
      };
      await FileSystem.writeAsStringAsync(monthYearFilePath, JSON.stringify([fullTimeData]));
      console.log(`Set time: ${strMonth} [${newMonthNum}], ${newYearNum}.`); 
      ToastAndroid.show('Nova marca temporal guardada', ToastAndroid.SHORT)
    } catch (error) {
      console.error(`Error getting time localization for the set language (${language}):`, error);
    }
  };

  
  const renderFileButton = ({ item, index }) => (
    (newMonth === index + 1 ) ? (
      <Button
        theme={'type-selected'}
        label={item}
        background = {'white'}
        onPress = {()=> setNewMonth('')}
      />
    ) : (
      <Button
        theme={'type-unselected'}
        label={item}
        background = {'white'}
        onPress = {()=> {setNewMonth(index+1); handleChangeMonth(index+1);}}
      />
    )
  );

  return (
    <View style={styles.bigBox}>
      <View style={styles.topRow}>
        <Text style={styles.header}>Canvia la marca temporal</Text>
      </View>

      <View style={[styles.innerBox, {top: 105}]}>
        <FlatList
            data={months}
            renderItem={renderMonthButton}
            keyExtractor={(item, index) => index.toString()}
            numColumns={3}
            columnWrapperStyle={styles.columnWrapper}
          />
      </View>

      <View style={[styles.innerBox, {position: 'absolute', top: 380, flexDirection:'row', gap: 10}]}>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={newYear}
            onChangeText={handleYearChange}
            maxLength={4}
          />
        </View> 
        <Button theme='change-time' onPress={()=>handleChangeYear()} />
      </View>

    </View>
  )
}

const styles = StyleSheet.create({
  bigBox: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '85%',
    height: '80%',
    borderRadius: 10,
    backgroundColor: 'transparent',
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: 50,
    width: '100%',
    top: 90,
  },
  header: {
    fontSize: 20,
    paddingLeft: 10,
    fontWeight: 'bold',
    color: 'white',
  },
  innerBox: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  inputContainer: {
    top: 10,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    width: 120,
    borderRadius: 3,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  input: {
    flex: 1,
    fontSize: 18,
    padding: 10,
    color: 'white',
  },
  columnWrapper: {
    justifyContent: 'space-between',
  },
});