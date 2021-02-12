import React from 'react';
import {FlatList,TextInput, Button, View, Text} from 'react-native';

export default function auth(pseudo, motdepasse) {
const route = "/auth"
const url = new URL(route, 'http://localhost:5000/')
console.log("Request " + url.toString())
return (fetch(url, {
  method : 'POST',
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    pseudo: pseudo,
    mdp: motdepasse

  })
}
).then(data => {return (data.json());}
).catch(
  (e) => {alert('Something went wrong ' + e.message)}
));
}
