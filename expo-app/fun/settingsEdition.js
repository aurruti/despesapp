import * as FileSystem from 'expo-file-system';

let preferences = require('./default_preferences.json');

export default async function settingsEdition(
    preferencesFilePath,
    preferenceName,
    newPreferenceValue
){
    let ogValue = preferences[preferenceName];
    if (preferenceName === 'colOffset' || preferenceName === 'rowOffset') {
        try {
            newPreferenceValue = parseInt(newPreferenceValue);
        } catch (error) {
            console.error('Error converting offset to integer:', error);
            newPreferenceValue = ogValue;   
        }
    } 
    preferences[preferenceName] = newPreferenceValue;
    try {
        await FileSystem.writeAsStringAsync(preferencesFilePath, JSON.stringify(preferences));
    } catch (error) {
        console.error('Error writing new preferences:', error);
        preferences[preferenceName] = ogValue;
    }
    return newPreferenceValue;
};