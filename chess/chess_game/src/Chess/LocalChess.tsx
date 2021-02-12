import React, {useCallback, useState} from "react";
import { View, StyleSheet, Button, Text} from "react-native";
import Board from "./Board";
import {Chess as ChessJS} from "chess.js";
import { useConst } from "../components/AnimatedHelpers";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgb(36, 35, 32)",
  },
});

function LocalChess(){
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
  return (
    <View style={styles.container}>
      <Board chess={chess} state={state} setState={setState} onTurn={onTurn}/>
    </View>

  );
};

export default LocalChess;
