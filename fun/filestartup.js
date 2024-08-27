import * as FileSystem from 'expo-file-system';
import * as defaultPreferences from './default_preferences.json';
import { locMonth } from './locMonth';

const defaultTypelist = [
  { sheet: 'default', type: 'Default Type 1', color: '#FF5733' },
  { sheet: 'default', type: 'Default Type 2', color: '#DC6E6A' },
  { sheet: 'default', type: 'Default Type 3', color: '#A0DC6A' },
];

export default async function appStartup( preferencesFilePath, typelistFilePath, monthYearFilePath ) {
  console.log("---  DespesApp Startup Process  ---");
  
  // await FileSystem.deleteAsync(preferencesFilePath);  ////Delete!
  
  try {
    const preferencesExists = await FileSystem.getInfoAsync(preferencesFilePath);

    if (!preferencesExists.exists) {
      console.log("No preferences exist. Creating from default...");
      await FileSystem.writeAsStringAsync(preferencesFilePath, JSON.stringify(defaultPreferences));
      console.log("Preferences created successfully.");
    } else {
      console.log("Check correct: Preferences already exist.");
    }
  } catch (error) {
    console.error("Error initializing preferences:", error);
  }
  try {
    const fileExists = await FileSystem.getInfoAsync(typelistFilePath);

    if (!fileExists.exists) {
      console.log("Typelist file doesn't exist. Creating it...");
      await FileSystem.writeAsStringAsync(typelistFilePath, JSON.stringify(defaultTypelist));
      console.log("Typelist file created successfully.");
    } else {
      console.log("Check correct: Typelist file already exists.");
    }
  } catch (error) {
    console.error("Error initializing typelist file:", error);
  }
  try {
    const now = new Date(); 
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1;
    const initialData = {
        month: currentMonth,
        year: currentYear,
        "locMonth": ""
      };
    await FileSystem.writeAsStringAsync(monthYearFilePath, JSON.stringify([initialData]));
  } catch (error) {
    console.error("Error getting current time:", error);
  }
  const preferencesData = await FileSystem.readAsStringAsync(preferencesFilePath);
  const { language } = JSON.parse(preferencesData);
  try {
    const timeData = await FileSystem.readAsStringAsync(monthYearFilePath);
    const [timeEntry] = JSON.parse(timeData); 
    const { month: currentMonth, year: currentYear } = timeEntry;
    const strMonth = locMonth(language, currentMonth); 
    const fullTimeData = {
      month: currentMonth,
      year: currentYear,
      "locMonth": strMonth
    };
    await FileSystem.writeAsStringAsync(monthYearFilePath, JSON.stringify([fullTimeData]));
    console.log(`Set time: ${strMonth} [${currentMonth}], ${currentYear}.`); 
  } catch (error) {
    console.error(`Error getting time localization for the set language (${language}):`, error);
  }
  console.log("--- DespesApp Startup Complete  ---")
}
