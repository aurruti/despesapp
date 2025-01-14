import { useState, useEffect } from 'react';
import {Alert, BackHandler, StyleSheet, View, Text, TextInput, FlatList, ScrollView} from 'react-native';
import * as FileSystem from 'expo-file-system';

import Button from './Button';
import CircleButton from './CircleButton';

export default function AddSpendingBox({currentSheet, currency, typelistFilePath, amount, setAmount, typeSpend, setTypeSpend, addAction, addTypeAction, exitAction}) {
  const [typelist, setTypelist] = useState([]);
  const typeWarning = "No hi ha cap tipus de despesa definit pel full sel·leccionat. Afegiu-ne una!"
  const handleAmountChange = (text) => {
    // Replace commas with periods
    let formattedText = text.replace(',', '.');
    
    // Allow only numbers and a single decimal point, plus the negative
    formattedText = formattedText.replace(/[^0-9.-]/g, '');
    
    // Ensure there is only one decimal point
    const decimalIndex = formattedText.indexOf('.');
    if (decimalIndex !== -1) {
      formattedText = formattedText.slice(0, decimalIndex + 1) + formattedText.slice(decimalIndex + 1).replace(/\./g, '');
    }
    // Negative only at the begining
    if (formattedText.startsWith('-')) {
      formattedText = '-' + formattedText.slice(1).replace(/-/g, '');
    }

    setAmount(formattedText);
  };

  useEffect(() => {
    const loadTypelist = async () => {
      try {
        const fileContents = await FileSystem.readAsStringAsync(typelistFilePath);
        setTypelist(JSON.parse(fileContents));
      } catch (error) {
        console.error("Error loading typelist:", error);
      }
    };

    loadTypelist();
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

  const filteredTypes = typelist.filter(button => button.sheet === currentSheet);
  const renderButton = ({ item }) => (
    (item.type === typeSpend) ? (
      <Button theme='type-selected' label = {item.type} background = {item.color} onPress={() => setTypeSpend(item.type)}/>
     ) : (
      <Button theme='type-unselected' label = {item.type} background = {item.color} onPress={() => setTypeSpend(item.type)}/>
     )
  );

  const typeAmountCheck = () => {
    if (filteredTypes.length === 0){
      Alert.alert("Avís: cap tipus definit", "No s'ha definit cap tipus de despesa pel full sel·leccionat. Cada despesa ha de correspondre a un tipus de despesa. Afegiu-ne alguns per començar a comptar despeses!");
    } else if (amount === '') {
      Alert.alert("Avís: despesa nul·la", "La despesa a afegir ha de tenir un valor numèric diferent a zero.")
    } else if (typeSpend === '') {
      Alert.alert("Avís: no s'ha triat tipus",'No heu triat cap tipus de despesa! Cada despesa ha de correspondre a un tipus de despesa.');
    } else {
      addAction();
    }
  };

  return (
    <View style={styles.container}>
    <View style={styles.bigBox}>
      <View style={styles.topRow}>
        <CircleButton type='exit-top-2' border='transparent' onPress={exitAction}/>
        <Text style={styles.header}>Afegeix una nova despesa</Text>
      </View>
      <View style={[styles.innerBox, {top: 70}]}>
        <View style={[styles.inputContainer, {flex:2/3}]}>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={amount}
            onChangeText={handleAmountChange}
            placeholder="0.00"
          />
          <Text style={styles.currencySymbol}>{currency}</Text>
        </View>
        <Button theme='addspend' onPress={typeAmountCheck}/>
      </View>
      
      {filteredTypes.length === 0 ? (
        <View style={[styles.innerBox, {top: 150, height:'42%'}]}>
          <Text style={styles.textWarning}>{typeWarning}</Text>
          <Button theme='addtypetext' label='Nou tipus' onPress={addTypeAction}/>
        </View>
      ) : filteredTypes.length === 1 ? (
        <View style={[styles.innerBox, {top: 150, height:'45%'}]}>
          {renderButton({ item: filteredTypes[0] })}
          <Button theme='addtypetext' label='Nou tipus' onPress={addTypeAction}/>
        </View>
      ) : filteredTypes.length === 2 ? (
        <View style={[styles.innerBox, {top: 150, height:'45%'}]}>
          {renderButton({ item: filteredTypes[0] })}
          {renderButton({ item: filteredTypes[1] })}
          <Button theme='addtypetext' label='Nou tipus' onPress={addTypeAction}/>
        </View>
      ) : (
        <View style={[styles.innerBox, {alignItems:"center", flexDirection:"column", top: 140, height:'55%'}]}>
          <FlatList
            data={filteredTypes}
            renderItem={renderButton}
            keyExtractor={(item, index) => index.toString()}
            numColumns={3} 
          />
          <Button theme='addtypetext' label='Nou tipus' onPress={addTypeAction}/>
        </View>
      )}
    </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width:'85%',
    backgroundColor: 'transparent'
  },
  bigBox: {
    justifyContent:'center',
    alignItems:'center',
    width: '100%',  
    height: 350, // height: '50%',    
    borderRadius: 10,
    backgroundColor: '#F6F8F8',
  },
  topRow: {
    flexDirection: 'row', 
    justifyContent: 'flex-start', 
    alignItems: 'center', 
    height: 50, 
    width: '108%', 
    position: 'absolute', 
    top: 0,
  },
  header : {
    fontSize: 16,
    paddingLeft: 10,
    fontWeight: 'bold',
  },
  innerBox: {
    flexDirection:'row',
    flexWrap: 'wrap',
    justifyContent:'center',
    alignItems:'flex-start',
    position:'absolute',
    flex: 1/3,
    gap: 10,
  },
  textWarning:{
    width:'85%',
    fontSize: 18,
    color:'black',
    marginLeft: 35,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    width:"50%",
    borderRadius: 3,
    paddingHorizontal: 10,
    flex : 1,
  },
  input: {
    flex: 1,
    fontSize: 18,
    padding: 10,
  },
  currencySymbol: {
    fontSize: 18,
    marginLeft: 5,
  },
  buttoncontainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
});