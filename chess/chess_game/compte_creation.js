import React, {useState} from 'react';
import {FlatList,TextInput, Button, View, Text} from 'react-native';
import {encode} from 'base-64'


export default function nouvel_utilisateur(pseudo, nom, prenom, motdepasse){
    const route = "/utilisateur"
    const url = new URL(route, 'http://localhost:5000/')
    console.log("Requesting " + url.toString() + pseudo+motdepasse)
    fetch(url, {
      method : 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        nom: nom,
        prenom: prenom,
        pseudo: pseudo,
        mdp: motdepasse
  
      })
    }
    ).catch(
      (e) => {alert('Something went wrong ' + e.message)}
    )
  }