// Style.tsx
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  // Container f�r den gesamten Bildschirm (mit Hintergrundfarbe)
  mainContainer: {
    flex: 1,
    backgroundColor: '#e0e0e0', // Helles Grau f�r den Hintergrund
  },

  // Container f�r den Titel (oben ausgerichtet)
  titleContainer: {
    paddingTop: 50, // Abstand nach oben
    alignItems: 'center', // Zentriert den Titel horizontal
  },

  // Style f�r den Titeltext
  titleText: {
    fontFamily: 'Orbitron, "Times New Roman", sans-serif', // Schriftart: Ausgabe in Orbitron, falls nicht vorhanden, dann Times New Roman, ansonsten Sans-serif
    fontSize: 42, // Schriftgr��e
    fontWeight: 'bold', // Fettgedruckt
    color: '#1a237e', // Dunkelblaue Farbe
    textShadowColor: '#000', // Schwarzer Schatten
    textShadowOffset: { width: 1, height: 3 }, // Schattenposition
    textShadowRadius: 5, // Schattenintensit�t
  },

  // Container f�r die Buttons (zentriert auf dem Bildschirm)
  buttonContainer: {
    flex: 1,
    justifyContent: 'center', // Zentriert die Buttons vertikal
    alignItems: 'center', // Zentriert die Buttons horizontal
    marginBottom: 0, // Kein Abstand nach unten
  },

  // Style f�r die benutzerdefinierten Buttons
  customButtonStyle: {
    backgroundColor: '#1a237e', // Dunkelblaue Hintergrundfarbe
    paddingVertical: 15, // Vertikales Padding (Abstand oben und unten)
    paddingHorizontal: 40, // Horizontales Padding (Abstand links und rechts)
    borderRadius: 20, // Abgerundete Ecken
    shadowColor: '#606060', // Dunkelgrauer Schatten
    shadowOffset: { width: 0, height: 5 }, // Schattenposition
    shadowOpacity: 0.3, // Transparenz des Schattens
    shadowRadius: 5, // Radius des Schattens
    elevation: 10, // Erh�ht den Button (f�r Android)
    marginBottom: 50, // Abstand nach unten
    alignItems: 'center', // Zentriert das Icon und den Text innerhalb des Buttons
    flexDirection: 'row', // Horizontaler Layout-Flow f�r das Icon und den Text
    justifyContent: 'center', // Zentriert Inhalt (Icon und Text)
  },

  //Style f�r Log on (Log in/Register) Buttons
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

  // Style f�r den Text innerhalb der Buttons
  customButtonTextStyle: {
    color: 'white', // Wei�e Schriftfarbe
    fontSize: 33, // Schriftgr��e
    fontWeight: 'bold', // Fettgedruckt
    marginLeft: 10, // Abstand zum Icon
  },

  //Style f�r Texteingaben
  textInput: {
    height: 40,  // H�he des Textfelds
    borderColor: 'gray',  // Randfarbe
    borderWidth: 1,  // Randbreite
    marginTop: 40,  //Abstand nach oben
    marginBottom: 40,  // Abstand nach unten
    width: '60%',  // Breite des Textfelds
    paddingLeft: 10,  // Innenabstand links
    borderRadius: 5,  // Abgerundete Ecken
    fontSize: 16,  // Schriftgr��e
    alignSelf:'center', //Zentrieren des Textfelds
  },

  //Style f�r Ionicons - Icons
  iconStyle:{
      size: 33,
      color: 'white',
  },
});

export default styles;
