//app/Style.tsx

import { StyleSheet } from 'react-native';
import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  // Container f�r den gesamten Bildschirm (mit Hintergrundfarbe)
  mainContainer: {
    flex: 1,
    backgroundColor: '#e0e0e0',
  },

  // Container f�r den Titel
  titleContainer: {
    paddingTop: 50,
    alignItems: 'center',
  },

  // Style f�r den Titeltext
  titleText: {
    fontFamily: 'Orbitron, "Times New Roman", sans-serif',
    fontSize: 42,
    fontWeight: 'bold',
    color: '#1a237e',
    textShadowColor: '#000',
    textShadowOffset: { width: 1, height: 3 },
    textShadowRadius: 5,
  },

  // Container f�r die Buttons
  buttonContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 0,
  },

  // Style f�r benutzerdefinierte Buttons
  customButtonStyle: {
    backgroundColor: '#1a237e',
    paddingVertical: 15,
    paddingHorizontal: 40,
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

  // Style f�r LogOn Buttons
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

  // Style f�r Button-Text
  customButtonTextStyle: {
    color: 'white',
    fontSize: 33,
    fontWeight: 'bold',
    marginLeft: 10,
  },

  // Style f�r TextInput
  textInput: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginTop: 40,
    marginBottom: 40,
    width: '60%',
    paddingLeft: 10,
    borderRadius: 5,
    fontSize: 16,
    alignSelf: 'center',
  },

  // Style f�r Icons
  iconStyle: {
    size: 33,
    color: 'white',
  },

  // Style f�r Listenelemente
  gameItem: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    padding: 15,
    marginVertical: 5,
    backgroundColor: 'white',
    borderRadius: 10,
    shadowColor: '#606060',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    alignSelf: 'center',
    width: '85%',
    flex: 1,
  },

  // Style f�r Listenbuttons
  listButtonStyle: {
    backgroundColor: '#1a237e',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
    shadowColor: '#606060',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 6,
    alignItems: 'center',
    justifyContent: 'center',
    width: '80%',
    height: 50,
    marginVertical: 10,
    alignSelf: 'center',
  },

  // Style f�r Listenbutton-Text
  listButtonTextStyle: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },

  // Style f�r Spieltitel
  gameTitle: {
    fontSize: 30,
    fontFamily: 'Orbitron-ExtraBold',
    fontWeight: '900',
    color: '#1a237e',
  },

  // Style f�r Metadaten
  metaText: {
    fontSize: 16,
    color: '#333',
    marginTop: 6,
    marginBottom: 2,
  },

  // Style f�r Titelbild
  gameImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
  },

  // Style f�r Remove-Button
  removeButton: {
    backgroundColor: '#d32f2f',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 10,
    shadowColor: '#606060',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 6,
    alignItems: 'center',
    justifyContent: 'center',
    width: 'auto',
    minWidth: 100,
    height: 40,
    marginVertical: 10,
    alignSelf: 'center',
    
    
  },

  // Style f�r Plattform-Icons
  platformIcons: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    flexWrap: 'wrap',
    marginTop: 10,
    marginBottom: 10,
  },

  // Zeile f�r Plattform-Icons und Text nebeneinander
  platformContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    flexWrap: 'wrap',
    marginBottom: 10,
  },

  platformItem: {
    alignItems: 'center',
    marginRight: 10,
    marginBottom: 10,
  },

  // Style f�r Plattformtext unter Icons
  platformText: {
    fontSize: 14,
    color: '#333',
    marginTop: 5,
  },

});

export default styles;
