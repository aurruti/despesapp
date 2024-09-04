import { useState, useEffect } from 'react';
import { Alert, BackHandler, Text, ToastAndroid, View, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
// import * as WebBrowser from 'expo-web-browser';

import { EXPO_CLIENT_ID, IOS_CLIENT_ID, ANDROID_CLIENT_ID, WEB_CLIENT_ID, EXPO_URI } from '@env';
// import * as FileSystem from 'expo-file-system';
// import * as DocumentPicker from 'expo-document-picker';

import Button from './Button';
import CircleButton from './CircleButton';
// import AddTypeBox from './AddTypeBox'; // FUTURE FEATURE

// WebBrowser.maybeCompleteAuthSession();

export default function SettingsScreen ({
  showAppOptions, setShowAppOptions,
  showAddType, setShowAddType,
  showAddSpending, setShowAddSpending,
  currentSheet, typelistFilePath,
  triggerTestScript
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
        <Text style={styles.title}> Ajustaments </Text>
      </View>
      <View>
        {/*TO-DO tipus de despesa, scroll thingy, change defaults, etc*/}
        <Button label="Autentica't a Google" onPress={()=> { promptAsync();} }/>
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