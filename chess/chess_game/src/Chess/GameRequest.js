import React from 'react';
import { Alert } from 'react-native';
import Board from "./Board";
import chess_game from '../../App';

export function post_fen(fen){
    const route = "/game"
    const url = new URL(route, 'http://localhost:5000/')
    console.log("OK")
    console.log(fen)
    return (fetch(url, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            config: fen,
            num: 1
        })
        }
        ).then(data => {return (data.json());}
        ).catch(
            (e) => {alert('Something went wrong' + e.message)}
        ));

    }

export function get_fen(chess) {
    const route = "/game"
    const url = new URL(route, 'http://localhost:5000/')
    return (fetch(url, {
        method: 'PUT',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            num: 1
        })
        }
        ).then(data => {return (data.json());}
        )
        .then(data => {chess.load(data)})
        .catch(
            (e) => {alert('Something went wrong' + e.message)}
        ));
}

