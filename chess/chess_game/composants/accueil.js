import { NavigationContainer } from '@react-navigation/native';
import React from 'react'
import {Text,View,Button,StyleSheet} from 'react-native'

export function Accueil({navigation}){
    return(
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <View style={{flex: 1,padding: 150}}>
                <View style={styles.space}>
                    <Button containerStyle={styles.button} title = 'Partie locale' onPress={() => navigation.navigate()} variant='primary' size='lg' active></Button>
                </View>
                <View style={styles.space}>
                    <Button containerStyle={styles.button} title = 'Partie rapide' variant='primary' size='lg' active></Button>
                </View>
                <View style={styles.space}> 
                    <Button containerStyle={styles.button} title = 'Partie en ligne' variant='primary' size='lg' disabled></Button>
                </View>
                
                
            </View>
        </View>
        );
}

const styles = StyleSheet.create({
    space : {
        padding: 35,
        width:300,
        height:150
    },
    button: {
        width:250,
        height:100
    }
})
