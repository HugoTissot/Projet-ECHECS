import React, {useState} from 'react'
import nouvel_utilisateur from '../compte_creation.js'
import {styles} from './Style.js'

import {FlatList,TextInput, Button, View, Text, StyleSheet,ImageBackground} from 'react-native';
import {NavigationContainer} from '@react-navigation/native'
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs'
import {createStackNavigator} from '@react-navigation/stack'
import {encode} from 'base-64'

import {chess_game,MyStack} from '../App.js'

export function Nouvcompte({navigation}) {
  const [nom, setnom] = useState("")
  const [prenom, setprenom] = useState("")
  const [pseudo, setpseudo] = useState("")
  const [motdepasse, setmotdepasse] = useState("")


    return(
      <View>
        <ImageBackground
                source={require('./image_accueil.jpg')}
                style={styles.image}
            >
    <View style={{ flex: 1, alignItems: 'center' }}>
    <Text style={styles.head}>Création de compte{"\n"}
    Veuillez entrer vos informations</Text>
    <Text style={styles.text}> {"\n"} </Text>
    
    <TextInput style={styles.input} value={nom} placeholder={'Nom'} onChangeText={(txt) => {setnom(txt)}}/>
    <Text style={styles.text}>{"\n"}</Text>
    
    <TextInput style={styles.input} value={prenom} placeholder={'Prénom'}onChangeText={(txt) => {setprenom(txt)}}/>
    <Text style={styles.text}>{"\n"}</Text>
    <TextInput style={styles.input} value={pseudo} placeholder={'Pseudo'} onChangeText={(txt) => {setpseudo(txt)}}/>
    <Text style={styles.text}>{"\n"}</Text>
    <TextInput style={styles.input} secureTextEntry={true} placeholder={'Mot de passe'} value={motdepasse} onChangeText={(txt) => {setmotdepasse(txt)}}/>
    <Text style={styles.text}>{"\n"}</Text>
    <Button type='submit' value='submit' color="#841584" title = "Envoyer"  onPress={(evt) =>{navigation.navigate("Connexion"),nouvel_utilisateur(pseudo,nom,prenom,motdepasse)}}
    variant="primary" size="lg"/>
    </View>
      </ImageBackground>
    </View>
    );
}


