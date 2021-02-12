import React, {useState} from 'react'
import {Text,View,TextInput,Button,ImageBackground,StyleSheet,TouchableOpacity} from 'react-native'
import auth from '../authentification'; 
import {styles} from './Style.js'

import {NavigationContainer} from '@react-navigation/native'
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs'
import {createStackNavigator} from '@react-navigation/stack'
import {encode} from 'base-64'

import {chess_game,MyStack} from '../App.js'

export function Connexion({navigation}){
  const[pseudo, setpseudo]=useState('');
  const[motdepasse, setmotdepasse]=useState('');
  const [isCorrect, setisCorrect]=useState(true);
    return(
      <View>
            
        <ImageBackground
                source={require('./image_accueil.jpg')}
                style={styles.image}
            >
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          


        <Text style={styles.head}>Veuillez entrer vos identifiants</Text>
        <Text style={styles.text}> {"\n"} </Text>
        

        <TextInput style={styles.input} placeholder='Pseudo' onChangeText = {text => setpseudo(text)}/>
        <Text style={styles.text}> {"\n"} </Text>

        {!isCorrect && <Text>Mot de passe incorrect!</Text>}
        <TextInput style={styles.input}  secureTextEntry={true} placeholder='mot de passe' clearTextOnFocus={true}
            onChangeText = {text => setmotdepasse(text)}/>
               <Text style={styles.text}> {"\n"} </Text>

        <Button type="submit" color="#841584" value="submit" title = "Connexion" variant="primary" size="lg" 
        onPress = {()=> {navigation.navigate("Game"),auth(pseudo, motdepasse).then(
          (data) => {setisCorrect(data==='true');if (data==='true');}).catch (
            () => {})}}/>
        
        </View>
        </ImageBackground>
        </View>
        );
}

