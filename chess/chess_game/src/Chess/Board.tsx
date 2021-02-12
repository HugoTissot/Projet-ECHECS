import React, { useCallback, useState } from "react";
import { View, StyleSheet, Dimensions } from "react-native";

import Background from "./Background";
import Piece from "./Piece";

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    width,
    height: width,
  },
});

const Board = (props) => {
  return (
    <View style={styles.container}>
      <Background />
      {props.state.board.map((row, y) =>
        row.map((piece, x) => {
          if (piece !== null) {
            return (
              <Piece
                key={`${x}-${y}`}
                id={`${piece.color}${piece.type}`}
                startPosition={{ x, y }}
                chess={props.chess}
                onTurn={props.onTurn}
                enabled={props.state.player === piece.color}
              />
            );
          }
          return null;
        })
      )}
    </View>
  );
};

export default Board;
