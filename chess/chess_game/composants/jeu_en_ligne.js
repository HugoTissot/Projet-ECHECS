



import React, {useState, useEffect} from 'react';
import {FlatList,TextInput, Button, View, Text, StyleSheet,ImageBackground} from 'react-native';
import {NavigationContainer} from '@react-navigation/native'
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs'
import {createStackNavigator} from '@react-navigation/stack'
import {encode} from 'base-64'

import {chess_game,MyStack} from '../App.js'
import {styles} from './Style.js'


export function jeu_en_ligne({navigation}){
  return(
    <View>
    <ImageBackground
            source={require('./image_accueil.jpg')}
            style={styles.image}
        >
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <View style={{flex: 1,padding: 150}}>
              <View style={styles.space}>
                  <Button title = 'Se Connecter' color="#841584" onPress={() => navigation.navigate("Connexion")} variant='primary' size='lg' active></Button>
              </View>
              
              <View style={styles.space}> 
                  <Button containerStyle={styles.button1} color="#841584" title = "S'inscrire" variant='primary' size='lg' onPress={() => navigation.navigate("Nouveau compte")} activate></Button>
              </View>
              
              
          </View>
      </View>
      </ImageBackground>
      </View>
      );
}


