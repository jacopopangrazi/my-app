import React from "react";
import styled from "styled-components";

function Square(props) {
  const Square = styled.button`
    background: #fff;
    border: 1px solid rgb(114, 114, 114);
    float: left;
    font-size: 40px;
    font-weight: bold;
    line-height: 64px;
    height: 64px;
    margin-right: -1px;
    margin-top: -1px;
    padding: 0;
    text-align: center;
    width: 64px;

    ${props.highlight
      ? "transition: background 0.1s linear;" +
        "animation: backgroundAnim 1s forwards;"
      : ""}

    &:focus {
      outline: none;
    }
  `;

  return <Square onClick={props.onClick}>{props.value}</Square>;
}

export default Square;
