import React from "react";
import ReactDOM from "react-dom";
import Game from "./components/Game";
import styled from "styled-components";
import "./index.css";

const Container = styled.div`
  height: 100%;
  width: 100%;
  margin: 0;
  padding: 0;
  display: flex;
  flex-flow: column nowrap;
  justify-content: center;
  align-items: center;
`;

const Title = styled.h1`
  background: #fff;
  margin: 60px 0 60px 0;
  font: 3rem "CustomFont";
  text-align: center;
  min-width: 60%;
  display: block;
  padding: 25px 25px 40px;
  border: 5px solid black;
`;

function App() {
  return (
    <Container>
      <Title>Tic Tac Toe</Title>
      <Game />
    </Container>
  );
}

ReactDOM.render(<App />, document.getElementById("root"));
