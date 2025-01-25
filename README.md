# DespesApp

DespesApp is a tool to simplify spending tracking. It has been envisoned as an easier way to udpate your Google Sheets with your expenses, without having to do so with the often cumbersome Google Sheets app.

Developed with React Native + Expo for the frontend; while a relatively simple fastAPI handles backend calls. For the backend deployement and more, take a look at the server actually handling this, the Nåidd project: https://github.com/aurruti/naidd .

## How-to

The current release (version 0.2.1) is only compatible with Android phones. Just install the APK and launch it! Remeber to accept foreign apk origins when installing. Note that the UI is completely in Catalan for the moment; while month localizations are only available in Catalan and English. I do not plan on working on localization for now, but if you are interested do let me know.

### Logging in and adding sheets

To log in, simply go to Settings (top-right corner gear) and log in through the giant "Log in with Google" button. The current version of the app has not been review by Google, meaning the functionalities are reserved to authorized "tester" email adresses.

Sheets are added from the bottom left button, by pasting either the full adress of the Google Sheets file or its ID.

### Expected sheet structure

Edition of your Google Sheets requires that your expense tracking sheet is structured as follows:

- Sheet name marks the year (i.e. "2025").
- Column headers, strictly on the first (1) row, mark the month by name according to your language settings (i.e. "Octubre", "May", ...).
- Row headers, striclty on the first (A) column, mark the spending type by name. The name should match exactly your type name defined in the app.

### Known issues and limitations

- Once added, sheets cannot be removed (lol).

- If using the app for too long on one go (just how many expenses do you have?), it is possible for the login token to expire without warning. This is because for now the token refresh happens only on startup. If this happens, you can either just restart the app (removing it from background apps). If that does not solve the issue, try logging out and back in again.

- Column and Row offset settings are global rather than sheet-specific. This means that if you are working with multiple sheets with different offset needs you will have to switch these manually.

You can see an example sheets: https://docs.google.com/spreadsheets/d/1YcTP6GPbXzbwf53ooIaO_Nggs-okboPcYxu-incYyLA/edit

## Acknogledgements

The icon and the splashcreen image has been extracted from https://www.pxfuel.com/en/desktop-wallpaper-dgmxw - if you are the original artist, please contact me!

The code included herein can contain some Copilot-generated lines of code in the instances where the use made sense and generated useful results; always with suprevision and testing.

## CC BY-SA 4.0 Licensing

DespesApp © 2025 by Aitor Urruticoechea is licensed under CC BY-SA 4.0. To view a copy of this license, visit http://creativecommons.org/licenses/by-sa/4.0/

Under Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International you are free to:

- Share - copy and redistribute the material in any medium or format.
- Adapt - remix, transform, and build upon the material.

The licensor cannot revoke these freedoms as long as you follow the license terms. Under the following terms:

- Attribution - You must give appropriate credit , provide a link to the license, and indicate if changes were made. You may do so in any reasonable manner, but not in any way that suggests the licensor endorses you or your use.
- ShareAlike - If you remix, transform, or build upon the material, you must distribute your contributions under the same license as the original.
- No additional restrictions - You may not apply legal terms or technological measures that legally restrict others from doing anything the license permits.
