import React, { useState, useEffect } from 'react';
import { GameSection } from './components/layout/GameSection';
import { StatusSection } from './components/layout/StatusSection';
import { getUniqueSudoku } from './solver/UniqueSudoku';
import { useSudokuContext } from './context/SudokuContext';

export const Game: React.FC<{}> = () => {
  let {
    numberSelected, setNumberSelected,
    gameArray, setGameArray,
    difficulty, setDifficulty,
    cellSelected, setCellSelected,
    initArray, setInitArray,
    setWon } = useSudokuContext();
  let [history, setHistory] = useState<string[][]>([]);
  let [solvedArray, setSolvedArray] = useState<string[]>([]);
  let [overlay, setOverlay] = useState<boolean>(false);

  function _createNewGame(e?: React.ChangeEvent<HTMLSelectElement>) {
    let [temporaryInitArray, temporarySolvedArray] = getUniqueSudoku(difficulty, e);

    setInitArray(temporaryInitArray);
    setGameArray(temporaryInitArray);
    setSolvedArray(temporarySolvedArray);
    setNumberSelected('0');
    setCellSelected(-1);
    setHistory([]);
    setWon(false);
  }

  function _isSolved(index: number, value: string) {
    if (gameArray.every((cell: string, cellIndex: number) => {
      if (cellIndex === index)
        return value === solvedArray[cellIndex];
      else
        return cell === solvedArray[cellIndex];
    })) {
      return true;
    }
    return false;
  }

  function _fillCell(index: number, value: string) {
    if (initArray[index] === '0') {
      let tempArray = gameArray.slice();
      let tempHistory = history.slice();
      tempHistory.push(gameArray.slice());
      setHistory(tempHistory);

      tempArray[index] = value;
      setGameArray(tempArray);

      if (_isSolved(index, value)) {
        setOverlay(true);
        setWon(true);
      }
    }
  }

  function _userFillCell(index: number, value: string) {
    _fillCell(index, value);
  }

  function onClickNewGame() {
    _createNewGame();
  }

  function onClickCell(indexOfArray: number) {
    setCellSelected(indexOfArray);
  }

  function onChangeDifficulty(e: React.ChangeEvent<HTMLSelectElement>) {
    setDifficulty(e.target.value);
    _createNewGame(e);
  }

  function onClickNumber(number: string) {
    if (cellSelected !== -1) {
      _userFillCell(cellSelected, number);
    }
  }

  function onClickUndo() {
    if (history.length) {
      let tempHistory = history.slice();
      let tempArray = tempHistory.pop();
      setHistory(tempHistory);
      if (tempArray !== undefined)
        setGameArray(tempArray);
    }
  }

  function onClickErase() {
    if (cellSelected !== -1 && gameArray[cellSelected] !== '0') {
      _fillCell(cellSelected, '0');
    }
  }

  function onClickOverlay() {
    setOverlay(false);
    _createNewGame();
  }

  useEffect(() => {
    _createNewGame();
  }, []);

  return (
    <>
      <div className={overlay ? "container blur" : "container"}>
        <div className="App-header">
          <p>{'REACT SUDOKU'}</p>
        </div>
        <div className="innercontainer">
          <GameSection
            onClick={(indexOfArray: number) => onClickCell(indexOfArray)}
          />
          <StatusSection
            onClickNumber={(number: string) => onClickNumber(number)}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => onChangeDifficulty(e)}
            onClickUndo={onClickUndo}
            onClickErase={onClickErase}
            onClick={onClickNewGame}
          />
        </div>
      </div>
      <div className={overlay
        ? "overlay overlay--visible"
        : "overlay"
      }
        onClick={onClickOverlay}
      >
        <h2 className="overlay__text">
          You <span className="overlay__textspan1">solved</span> <span className="overlay__textspan2">it!</span>
        </h2>
      </div>
    </>
  );
}
