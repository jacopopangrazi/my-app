import React from "react";
import Board from "./Board";
import styled from "styled-components";

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [
        {
          squares: Array(9).fill(null),
          // location serve a segnare la posizione
          // in col-row
          location: []
        }
      ],
      stepNumber: 0,
      xIsNext: true,
      isDescending: true
    };
    this.sortHistory = this.sortHistory.bind(this);
  }

  // FUNZIONI:

  // richiamata nel render:
  // trova se un giocatore ha vinto controllando se
  // nei possibili pattern di vincità ci sia sempre lo
  // stesso valore (X o O)
  calculateWinner(squares) {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6]
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (
        squares[a] &&
        squares[a] === squares[b] &&
        squares[a] === squares[c]
      ) {
        return { player: squares[a], line: [a, b, c] };
      }
    }
    return null;
  }
  // step è passato cliccando su un tasto delle mosse precedenti
  // e riporta lo stato delle mosse a quella selezionata oltre a
  // controllare quale sia il giocatore attuale
  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: step % 2 === 0
    });
  }

  handleClick(i) {
    const locations = [
      [1, 1],
      [2, 1],
      [3, 1],
      [1, 2],
      [2, 2],
      [3, 2],
      [1, 3],
      [2, 3],
      [3, 3]
    ];
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();

    // se è stato già trovato un vincitore o la casella
    // cliccata è già piena interrompo la funzione
    if (this.calculateWinner(squares) || squares[i]) {
      return;
    }
    // altrimenti seleziono la casella dove inserire
    // X o O
    squares[i] = this.state.xIsNext ? "X" : "O";
    // aggiorno gli stati concatenando la nuova disposizione
    // dei valori nell'array delle caselle, il numero di mosse
    // fatte e quale giocatore sarà il prossimo
    this.setState({
      history: history.concat([
        {
          squares: squares,
          location: locations[i]
        }
      ]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext
    });
  }

  sortHistory() {
    this.setState({
      isDescending: !this.state.isDescending
    });
  }

  render() {
    // array contenente i diversi stati della tabella di gioco
    const history = this.state.history;
    // in questa variabile vado ad inserire lo stato della tabella corrente
    const current = history[this.state.stepNumber];
    const winner = this.calculateWinner(current.squares);

    // styled components:

    const Game = styled.div`
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
      background: #fff;
      min-height: 400px;
      width: 500px;
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
    `;

    const GameBoard = styled.div`
      box-sizing: border-box;
    `;

    const GameInfo = styled.div`
      position: relative;
      min-width: 150px;
      margin-left: 20px;
    `;

    const Status = styled.div`
      position: relative;
      z-index: 1;
      text-align: center;
      text-transform: uppercase;
      padding: 3px;
      user-select: none;
      padding: 10px;
      color: white;
      margin-bottom: 10px;

      &::before {
        content: "";
        display: block;
        height: 100%;
        width: 100%;
        position: absolute;
        top: 0;
        left: 0;
        z-index: -1;
        transition: all 0.1s linear;
        background: rgb(238, 0, 0);

        ${winner ? "background: rgb(104, 255, 117);" : ""}
      }

      &:hover::before {
        transform: skewX(-10deg);
      }
    `;

    const Arrow = styled.button`
      display: flex;
      justify-content: center;
      align-items: center;
      position: absolute;
      top: 50%;
      right: -40px;
      height: min-content;
      width: min-content;
      border: none;
      background: none;
      outline: none;
      cursor: pointer;
      transform: rotate(-90deg);

      ${this.state.isDescending ? "transform: rotate(90deg);" : ""}

      img {
        width: 25px;
        height: 25px;
      }
    `;

    // genero un tasto per ogni array nello stato history
    const moves = history.map((step, move) => {
      const desc = move
        ? "Go to move #" + move + " @ " + history[move].location
        : "Go to game start";
      // lo stile dei bottoni è inserito qui per permettere
      // l'utilizzo della variabile move nel controllo dello stile
      const Button = styled.button`
        color: black;
        cursor: pointer;
        display: block;
        width: 100%;
        background: #ebebeb;
        border: none;
        box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);
        padding: 5px;
        margin-bottom: 10px;

        &:hover {
          background: #fdfdfd;
        }

        ${move === this.state.stepNumber ? "background: #fff;" : ""}
      `;

      return (
        <li key={move}>
          <Button onClick={() => this.jumpTo(move)}>{desc}</Button>
        </li>
      );
    });

    // se la costante 'winner' non è più null
    // è stato trovato un vincitore e viene segnato,
    // altrimenti continua ad indicare il prossimo
    // giocatore
    let status; // elemento che segna il prossimo giocatore o il vincitore
    if (winner) {
      status = "Winner: " + winner.player;
    } else if (!current.squares.includes(null)) {
      status = "draw";
    } else {
      status = "Next player: " + (this.state.xIsNext ? "X" : "O");
    }

    // JSX principale
    return (
      <Game>
        <GameBoard>
          <Board
            // se è stato trovato un vincitore,
            // mando la linea da evidenziare per la vittoria
            highlight={winner ? winner.line : []}
            // passo come props lo stato attuale
            // delle caselle per farle renderizzare al
            // componente board
            squares={current.squares}
            onClick={i => this.handleClick(i)}
          />
        </GameBoard>
        <GameInfo>
          {/* se c'è un vincitore la scritta cambia colore aggiungendo la classe 'win' */}
          <Status>{status}</Status>
          <Arrow onClick={this.sortHistory}>
            <img
              src="https://img.icons8.com/ios-glyphs/30/000000/arrow.png"
              alt="arrow button"
            />
          </Arrow>
          <ol>{this.state.isDescending ? moves : moves.reverse()}</ol>
        </GameInfo>
      </Game>
    );
  }
}

export default Game;
