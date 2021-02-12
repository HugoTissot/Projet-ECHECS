import Chess from "./src/Chess"
import LocalChess from "./src/Chess/LocalChess";
import React, {useState, useEffect} from 'react';
import {FlatList,TextInput, Button, View, Text, StyleSheet,ImageBackground} from 'react-native';
import {NavigationContainer} from '@react-navigation/native'
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs'
import {createStackNavigator} from '@react-navigation/stack'
import {encode} from 'base-64'
import {Connexion} from './composants/connexion.js'
import {Nouvcompte} from './composants/compte.js'
import {jeu_en_ligne} from './composants/jeu_en_ligne.js'
import {styles} from './composants/Style.js'

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function Accueil({navigation}){
  return(
    <View>
        <ImageBackground
                source={require('./composants/image_accueil.jpg')}
                style={styles.image}
            >
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <View style={{flex: 1,padding: 150}}>
              <View style={styles.space}>
                  <Button containerStyle={styles.button2} color="#841584" title = 'Partie locale' onPress={() => navigation.navigate("LocalGame")} variant='primary' size='lg' active></Button>
              </View>
              
              <View style={styles.space}> 
                  <Button containerStyle={styles.button} color="#841584" title = 'Partie en ligne' variant='primary' size='lg' onPress={() => navigation.navigate("jeu_en_ligne")} activate></Button>
              </View>
              
              
          </View>
      </View>
      </ImageBackground>
      </View>
      );
}






export function MyStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={Accueil}/>
      <Stack.Screen name="LocalGame" component={LocalChess}/>
      <Stack.Screen name="Nouveau compte" component={Nouvcompte}/>
      <Stack.Screen name="Game" component={Chess}/>
      <Stack.Screen name="Connexion" component={Connexion}/>
      <Stack.Screen name="jeu_en_ligne" component={jeu_en_ligne}/>

    </Stack.Navigator>
  )
}

const chess_game = () => {
  return(
    <NavigationContainer>
      <MyStack/>
    </NavigationContainer>
  )
}


export default chess_game;

