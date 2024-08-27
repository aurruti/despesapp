/**
 * This function takes a language code and a month number (1-12).
 * and returns the localized name of the month.
 * 
 * @param {string} language - The language code (e.g., "cat" for Catalan).
 * @param {number} month - The month number (1 for January, 12 for December).
 * @returns {string} - The localized name of the month.
 */

export function locMonth(language, month) {
  const catalanMonths = [
    "Gener", "Febrer", "Març", "Abril", "Maig", "Juny",
    "Juliol", "Agost", "Setembre", "Octubre", "Novembre", "Desembre"
  ];

  const englishMonths = [
    "January", "February", "March", "April", "May", "June", 
    "July", "August", "September", "October", "November", "December"
  ]

  switch (language) {
    case "cat":
      return catalanMonths[month-1]; 
    case "eng":
      return englishMonths[month-1];
    default:
      console.error(`Unsupported language: ${language}. For now, the available languages are Catalan (cat) and English (eng).`);
      return ""; 
  }
}