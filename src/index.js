import React from "react";
import ReactDOM from "react-dom";
import "./index.css";

//###############################################################

function Square(props) {
  console.log(props.highlight);
  return (
    <button
      className={"square " + (props.highlight ? "hl" : "")}
      onClick={props.onClick}
    >
      {props.value}
    </button>
  );
}

//###############################################################

class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square
        highlight={this.props.highlight.includes(i)}
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  createBoard() {
    let board = [];
    for (let i = 0; i < 9; i = i + 3) {
      board.push(
        <div key={"row:" + i} className="board-row">
          {this.renderSquare(i)}
          {this.renderSquare(i + 1)}
          {this.renderSquare(i + 2)}
        </div>
      );
    }
    return board;
  }

  render() {
    return <div>{this.createBoard()}</div>;
  }
}

//###############################################################

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [
        {
          squares: Array(9).fill(null)
        }
      ],
      stepNumber: 0,
      xIsNext: true
    };
  }

  // funzioni:

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
          squares: squares
        }
      ]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext
    });
  }

  render() {
    // array contenente i diversi stati della tabella di gioco
    const history = this.state.history;
    // in questa variabile vado ad inserire lo stato della tabella corrente
    const current = history[this.state.stepNumber];
    const winner = this.calculateWinner(current.squares);

    // genero un tasto per ogni array nello stato history
    const moves = history.map((step, move) => {
      const desc = move ? "Go to move #" + move : "Go to game start";
      return (
        <li key={move}>
          <button className="btn" onClick={() => this.jumpTo(move)}>
            {desc}
          </button>
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
    } else {
      status = "Next player: " + (this.state.xIsNext ? "X" : "O");
    }
    // JSX principale
    return (
      <div className="container">
        <h1 className="title">Tic Tac Toe</h1>
        <div className="game">
          <div className="game-board">
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
          </div>
          <div className="game-info">
            <div className="status">{status}</div>
            <ol>{moves}</ol>
          </div>
        </div>
      </div>
    );
  }
}

//###############################################################

ReactDOM.render(<Game />, document.getElementById("root"));
