import {useEffect, useState} from 'react';
import {Alert, BackHandler, StyleSheet, FlatList, View, Text, ToastAndroid, TextInput} from 'react-native';
import * as FileSystem from 'expo-file-system';

import Button from './Button';
import CircleButton from './CircleButton';

export default function AddTypeBox({currentSheet, typelistpath, returnAction, exitAction}) {
  const [typelist, setTypelist] = useState([]);
  const [newType, setNewType] = useState('');
  const [newColor, setNewColor] = useState('#FFFFFF');

  const loadTypelist = async () => {
    try {
      const file = await FileSystem.readAsStringAsync(typelistpath);
      return JSON.parse(file);
    } catch (error) {
      console.error("Error loading typelist:", error);
      Alert.alert('Error!', "Hi ha hagut un error en carregar la llista de tipus de despesa.")
      return [];
    }
  };

  if (returnAction === 0) {
    useEffect(() => {
      const fetchTypelist = async () => {
        const loadedTypelist = await loadTypelist();
        setTypelist(loadedTypelist);
      };

      fetchTypelist();

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
  } else {
    useEffect(() => {
      const fetchTypelist = async () => {
        const loadedTypelist = await loadTypelist();
        setTypelist(loadedTypelist);
      };

      fetchTypelist();

      const handleBackButtonPress = () => {
        returnAction();
        return true;
      };
      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        handleBackButtonPress
      );
      return () => {
        backHandler.remove();
      };
    }, [returnAction]); 
  }
  

  const addType = () => {
    if (newType && newColor) {
      const updatedTypelist = [...typelist, { sheet: currentSheet, type: newType, color: newColor }];
      setTypelist(updatedTypelist);
      saveTypelist(updatedTypelist);
      setNewColor('#FFFFFF');
      setNewType('');
    } else {
      Alert.alert('Avís', 'Cal que afegiu un nom al tipus de despesa.');
      consle.error("")
    }
  };

  const removeType = (index) => {
    Alert.alert(
      "Confirmació",
      "Esteu segurs de voler esborrar aquest tipus de despesa? Noteu que aquesta acció no esborrarà cap de les despeses del vostre full, només treurà l'opció d'afegir noves despeses d'aquest tipus.",
      [
        { text: 'Cancel·la', style: 'cancel' },
        { text: 'Esborra', onPress: () => {
          const updatedTypelist = typelist.filter((_, i) => i !== index);
          setTypelist(updatedTypelist);
          saveTypelist(updatedTypelist);
          ToastAndroid.show('Tipus esborrat', ToastAndroid.SHORT);
        } }
      ]
    );
  };

  const saveTypelist = async (updatedTypelist) => {
    try {
      await FileSystem.writeAsStringAsync(typelistpath, JSON.stringify(updatedTypelist));
      console.log('Check correct:', 'Typelist updated successfully');
    } catch (error) {
      console.error("Error saving typelist:", error);
      Alert.alert('Error', "La llista de tipus de despesa no s'ha pogut desar correctament.");
    }
  };

  function triggerAddType() {
    try {
      addType();
      ToastAndroid.show('Nou tipus afegit correctament', ToastAndroid.SHORT);
    } catch (error) {
      console.error("Error: No s'ha afegit nou tipus", error)
    }
    
  }

  const handleTypeChange = (text) => {
    let formattedText = text.replace('=', '');
    
    setNewType(formattedText);
  };

  const filteredTypelist = typelist.filter(item => item.sheet === currentSheet);

  return (
    <View style={styles.container}>
    <View style={styles.bigBox}>
      <View style={styles.topRow}>
        <CircleButton type='exit-top-2' border='transparent' onPress={exitAction}/>
      </View>
      {returnAction === 0 ? (
        <View style={[styles.topRow,{left:'30%', width:'60%'}]}>
          <Text style={styles.header}>Tipus de despeses</Text>
        </View>
      ) : (
        <View style={[styles.topRow,{width:'85%'}]}>
          <CircleButton type='return' border='transparent' onPress={returnAction}/>
          <Text style={styles.header}>Tipus de despeses</Text>
        </View>
      )}
      
      
      <View style={[styles.innerBox, {top: 70}]}>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={newType}
            onChangeText={handleTypeChange}
            placeholder="Nou tipus"
          />
        </View>
        <Button theme='addtype' onPress={triggerAddType}/>
      </View>

      {filteredTypelist.length === 0 ? (
        <View style={[styles.innerBox, {top: 150, height:'45%', marginLeft:90, alignItems:'center'}]}>
          <Text stle={styles.textWarning}> Defineixi en aquesta finestra els seus tipus de despesa habituals. </Text>
        </View>
      ) : (
        <View style={[styles.innerBox, {top: 150, height:'45%'}]}>
          <FlatList
            data={filteredTypelist}
            renderItem={({ item, index }) => (
              <View style={{ width:'80%', flexDirection: 'row', alignItems:'center', justifyContent: 'space-between', marginLeft: 20 }}>
                <Button title="Remove" theme="removetype" onPress={() => removeType(index)} />
                <Text style={styles.textTypeList}>{item.type}</Text>
                <View style={[styles.colorTypeList, {backgroundColor:item.color}]} />
              </View>
            )}
            keyExtractor={(item, index) => index.toString()}
          />
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
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    width:"50%",
    borderRadius: 3,
    paddingHorizontal: 10,
    flex : 4/5,
  },
  input: {
    flex: 1,
    fontSize: 18,
    padding: 10,
  },
  textTypeList:{
    color:'black',
    marginBottom: 2,
    flex:1,
    fontSize: 14,
    padding: 10,
  },
  colorTypeList:{
    height:20,
    width:20,
    borderRadius:10,
    borderColor:'black',
    borderWidth:1
  },
  textWarning:{
    width:'85%',
    fontSize: 24,
    color:'black',
    textAlign:'center',
    textAlignVertical:'center',
  },
});