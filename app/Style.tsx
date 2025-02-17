// Style.tsx
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  // Container für den gesamten Bildschirm (mit Hintergrundfarbe)
  mainContainer: {
    flex: 1,
    backgroundColor: '#e0e0e0', // Helles Grau für den Hintergrund
  },

  // Container für den Titel (oben ausgerichtet)
  titleContainer: {
    paddingTop: 50, // Abstand nach oben
    alignItems: 'center', // Zentriert den Titel horizontal
  },

  // Style für den Titeltext
  titleText: {
    fontFamily: 'Orbitron, "Times New Roman", sans-serif', // Schriftart: Ausgabe in Orbitron, falls nicht vorhanden, dann Times New Roman, ansonsten Sans-serif
    fontSize: 42, // Schriftgröße
    fontWeight: 'bold', // Fettgedruckt
    color: '#1a237e', // Dunkelblaue Farbe
    textShadowColor: '#000', // Schwarzer Schatten
    textShadowOffset: { width: 1, height: 3 }, // Schattenposition
    textShadowRadius: 5, // Schattenintensität
  },

  // Container für die Buttons (zentriert auf dem Bildschirm)
  buttonContainer: {
    flex: 1,
    justifyContent: 'center', // Zentriert die Buttons vertikal
    alignItems: 'center', // Zentriert die Buttons horizontal
    marginBottom: 0, // Kein Abstand nach unten
  },

  // Style für die benutzerdefinierten Buttons
  customButtonStyle: {
    backgroundColor: '#1a237e', // Dunkelblaue Hintergrundfarbe
    paddingVertical: 15, // Vertikales Padding (Abstand oben und unten)
    paddingHorizontal: 40, // Horizontales Padding (Abstand links und rechts)
    borderRadius: 20, // Abgerundete Ecken
    shadowColor: '#606060', // Dunkelgrauer Schatten
    shadowOffset: { width: 0, height: 5 }, // Schattenposition
    shadowOpacity: 0.3, // Transparenz des Schattens
    shadowRadius: 5, // Radius des Schattens
    elevation: 10, // Erhöht den Button (für Android)
    marginBottom: 50, // Abstand nach unten
    alignItems: 'center', // Zentriert das Icon und den Text innerhalb des Buttons
    flexDirection: 'row', // Horizontaler Layout-Flow für das Icon und den Text
    justifyContent: 'center', // Zentriert Inhalt (Icon und Text)
  },

  //Style für Log on (Log in/Register) Buttons
  logOnButtonStyle: {
      backgroundColor: '#87CEEB',
      paddingVertical: 15,
      paddingHorizontal: 20,
      borderRadius: 20,
      shadowColor: '#606060', 
      shadowOffset: { width: 0, height: 5 },
      shadowOpacity: 0.3, 
      shadowRadius: 5, 
      elevation: 10,
      marginBottom: 50,
      alignItems: 'center', 
      flexDirection: 'row', 
      justifyContent: 'center',
  },

  // Style für den Text innerhalb der Buttons
  customButtonTextStyle: {
    color: 'white', // Weiße Schriftfarbe
    fontSize: 33, // Schriftgröße
    fontWeight: 'bold', // Fettgedruckt
    marginLeft: 10, // Abstand zum Icon
  },

  //Style für Texteingaben
  textInput: {
    height: 40,  // Höhe des Textfelds
    borderColor: 'gray',  // Randfarbe
    borderWidth: 1,  // Randbreite
    marginTop: 40,  //Abstand nach oben
    marginBottom: 40,  // Abstand nach unten
    width: '60%',  // Breite des Textfelds
    paddingLeft: 10,  // Innenabstand links
    borderRadius: 5,  // Abgerundete Ecken
    fontSize: 16,  // Schriftgröße
    alignSelf:'center', //Zentrieren des Textfelds
  },

  //Style für Ionicons - Icons
  iconStyle:{
      size: 33,
      color: 'white',
  },
});

export default styles;
