import { useEffect, useState } from 'react';
import { Text, TextInput, ToastAndroid, View, StyleSheet } from 'react-native';
import * as FileSystem from 'expo-file-system';

import settingsEdition from '../fun/settingsEdition';

export default function SettingsBox({
    title, preferenceName,
    preferencesFilePath
}) {
    const [preferenceValue, setPreferenceValue] = useState('');

    useEffect(() => {
        const loadPreference = async () => {
            try {
                let preferences = JSON.parse(await FileSystem.readAsStringAsync(preferencesFilePath));
                if (preferenceName === 'colOffset' || preferenceName === 'rowOffset') {
                    preferences[preferenceName] = parseInt(preferences[preferenceName]);
                }
                setPreferenceValue(preferences[preferenceName] || '');
            } catch (error) {
                ToastAndroid.show('Error loading preference', ToastAndroid.SHORT);
            }
        };

        loadPreference();
    }, [preferencesFilePath, preferenceName]);

    const handleTextChange = async (text) => {
        try {
            await settingsEdition(preferencesFilePath, preferenceName, text);
            ToastAndroid.show('Preference updated!', ToastAndroid.SHORT);
            console.log("New preferences saved: ", preferences);
        } catch (error) {
            ToastAndroid.show('Error updating preference', ToastAndroid.SHORT);
        }
    };

    const checkText = (text) => {
        // switch (preferenceName) {
        //     case 'language':
        //         if (!/^[a-zA-Z]{2}$/.test(text)) {
        //             ToastAndroid.show("Codi d'idioma invàlid", ToastAndroid.SHORT);
        //             setPreferenceValue(preferences[preferenceName] || '');
        //         }
        //         break;
        //     case 'currency':
        //         if (!/^[A-Z]{3}$/.test(text) && !['€', '$', '¥'].includes(text)) {
        //             ToastAndroid.show('Símbol de moneda invàlid', ToastAndroid.SHORT);
        //             setPreferenceValue(preferences[preferenceName] || '');
        //         }
        //         break;
        //     case 'colOffset':
        //         if (!/^\d+$/.test(text) || text.includes('.') || parseInt(text) < 0) {
        //             ToastAndroid.show('Offset invàlid', ToastAndroid.SHORT);
        //             setPreferenceValue(preferences[preferenceName] || '');
        //         }
        //         break;
        //     case 'rowOffset':
        //         if (!/^\d+$/.test(text) || text.includes('.') || parseInt(text) < 0) {
        //             ToastAndroid.show('Offset invàlid', ToastAndroid.SHORT);
        //             setPreferenceValue(preferences[preferenceName] || '');
        //         }
        //         break;
        // }
    };

    return (
        <View style={styles.settingsSubContainer}>
            <Text style={styles.miniTitle}>{title}</Text>
            <TextInput 
                style={styles.input} 
                value={preferenceValue}
                //onEditing={checkText}
                onEndEditing={handleTextChange}
            />
        </View>
    )
};

const styles = StyleSheet.create({
    settingsSubContainer: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'flex-start',
        paddingLeft: 10,
        width: '40%',
        height: '40%',
    },
    miniTitle : {
        color: 'white',
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    input : {
        backgroundColor: 'white',
        width: '100%',
        height: 30,
        borderRadius: 3,
        paddingLeft: 5,
    },
});