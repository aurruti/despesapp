import { useState, useEffect } from 'react';
import { Alert, BackHandler, Text, ToastAndroid, View, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';

import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import { WEB_CLIENT_ID } from '@env';

import Button from './Button';
import CircleButton from './CircleButton';
// import AddTypeBox from './AddTypeBox'; // FUTURE FEATURE

// Configure Google Sign-In
GoogleSignin.configure({
  webClientId: WEB_CLIENT_ID, // From Google Cloud Console
  offlineAccess: true,
});

export default function SettingsScreen ({
  showAppOptions, setShowAppOptions,
  showAddType, setShowAddType,
  showAddSpending, setShowAddSpending,
  currentSheet, typelistFilePath,
  triggerTestScript
}) {

  const signIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      console.log("Check: Informació d'usuari", userInfo);
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        console.error('User cancelled the login flow');
      } else if (error.code === statusCodes.IN_PROGRESS) {
        console.error('Autenticació en progrés');
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        console.error('Play services no està disponible o està desactualitzat');
      } else {
        console.error('Alguna cosa no ha funcionat: ', error);
      }
    }
  };

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
        <Text style={styles.title}> Ajustaments </Text>
      </View>
      <View>
        {/*TO-DO tipus de despesa, scroll thingy, change defaults, etc*/}
        <Button label="Autentica't a Google" onPress={signIn}/>
        <Button label="Test button" onPress={triggerTestScript} /> 
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
    gap:12,
  },
  title : {
    color: 'white',
    fontSize: 18,
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
    zIndex:-10,
  },
  placeholder: {
    flex: 1, 
    backgroundColor: 'transparent', 
  },
});