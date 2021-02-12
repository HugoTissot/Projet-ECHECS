import React, {useCallback, useEffect, useState} from "react";
import { View, StyleSheet, Button, Text} from "react-native";
import Board from "./Board";
import {post_fen, get_fen} from "./GameRequest"
import {Chess as ChessJS} from "chess.js";
import { useConst } from "../components/AnimatedHelpers";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgb(36, 35, 32)",
  },
});

function Chess({navigation}){
  const chess = useConst(() => new ChessJS());
  const [state, setState] = useState({
    player: "w",
    board: chess.board(),
  });
  const onTurn = useCallback(() => {
    setState({
      player: state.player === "w" ? "b" : "w",
      board: chess.board(),
    });
  }, [chess, state.player]);
  
  useEffect(() => {
    const interval = setInterval(() => {
      get_fen(chess)
      .then(() => setState({player: chess.turn(), board: chess.board()}))
      .then(() => chess.game_over() ? navigation.navigate("Home").
      then(() => post_fen('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1')) : null).catch(() => {})
    }, 1000);
    return () => clearInterval(interval);
  }, [])

  return (
    <View style={styles.container}>
      <Board chess={chess} state={state} setState={setState} onTurn={onTurn}/>
      <Button type="submit" value="submit" title="Abandonner" variant="primary" size="lg" onPress=
      {() => post_fen('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1')}/>
    </View>  );
};

export default Chess;
