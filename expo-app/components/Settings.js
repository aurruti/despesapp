import { useEffect } from 'react';
import { BackHandler, Text, TextInput, ToastAndroid, View, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';

import Button from './Button';
import CircleButton from './CircleButton';
import SettingsBox from './SettingsBox';


export default function SettingsScreen ({
  showAppOptions, setShowAppOptions,
  showAddType, setShowAddType,
  showAddSpending, setShowAddSpending,
  preferencesFilePath
}) {

  exitAction = () => {
    setShowAddType(false);
    setShowAddSpending(false);
    setShowAppOptions(false);
  }

  useEffect(()=>{
  // Handle Back Button Press
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

  return (
    <View style={styles.container}>
      <View style={styles.topContainer}>
        <CircleButton type='exit-top' border='#25292e' 
          onPress={() => {setShowAppOptions(false); 
          setShowAddType(false); setShowAddSpending(false);}} 
        />
        <View style={[styles.placeholder, {flex:5/6}]} />
        <Text style={styles.title}> Configuració </Text>
      </View>
      <View style={{justifyContent:"center", alignItems:"center"}}>
        <Button label="Autentica't a Google" onPress={()=> ToastAndroid.show("Encara no disponible", ToastAndroid.SHORT) }/>
        <View style={styles.settingsContainer}>
          <SettingsBox title="Codi d'Idioma" preferenceName="language" preferencesFilePath={preferencesFilePath}/>
          <SettingsBox title="Símbol de Moneda" preferenceName="currency" preferencesFilePath={preferencesFilePath}/>
          <SettingsBox title="Offset de Columna" preferenceName="colOffset" preferencesFilePath={preferencesFilePath}/>
          <SettingsBox title="Offset de Fila" preferenceName="rowOffset" preferencesFilePath={preferencesFilePath}/>
        </View>
      </View>
      <StatusBar style="dark" />
    </View>
  )
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
  title: {
    color: 'white',
    paddingTop: 2,
    fontSize: 27,
    fontWeight: 'bold',
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
  settingsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    width: '100%',
    paddingTop: '10%',
    paddingLeft: '5%',
    paddingRight: '5%',
  },
  placeholder: {
    flex: 1,
    backgroundColor: 'transparent',
  },
});