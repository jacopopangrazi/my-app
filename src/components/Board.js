import React from "react";
import Square from "./Square";
import styled from "styled-components";

const BoardRow = styled.div`
  clear: both;
  content: "";
  display: table;
`;

const Board = props => {
  const renderSquare = i => {
    return (
      <Square
        highlight={props.highlight.includes(i)}
        value={props.squares[i]}
        onClick={() => props.onClick(i)}
      />
    );
  };

  const createBoard = () => {
    let board = [];
    for (let i = 0; i < 9; i = i + 3) {
      board.push(
        <BoardRow key={"row:" + i}>
          {renderSquare(i)}
          {renderSquare(i + 1)}
          {renderSquare(i + 2)}
        </BoardRow>
      );
    }
    return board;
  };

  return createBoard();
};

export default Board;
