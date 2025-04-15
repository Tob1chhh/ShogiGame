import { createStore, createEvent, sample } from 'effector';
import { Coordinates, GameState, Piece } from './game.types';
import { calculateAvailableMoves } from '../services/calculateMoves';

// Начальное состояние доски
const initialBoard: Piece[][] = [
  [ { type: 'Lance',        color: 'Gote', position: {row: 0, col: 0}, promoted: false }, 
    { type: 'Horse_Knight', color: 'Gote', position: {row: 0, col: 1}, promoted: false },
    { type: 'Silver',       color: 'Gote', position: {row: 0, col: 2}, promoted: false },
    { type: 'Gold',         color: 'Gote', position: {row: 0, col: 3}, promoted: false },
    { type: 'King',         color: 'Gote', position: {row: 0, col: 4}, promoted: false },
    { type: 'Gold',         color: 'Gote', position: {row: 0, col: 5}, promoted: false },
    { type: 'Silver',       color: 'Gote', position: {row: 0, col: 6}, promoted: false },
    { type: 'Horse_Knight', color: 'Gote', position: {row: 0, col: 7}, promoted: false },
    { type: 'Lance',        color: 'Gote', position: {row: 0, col: 8}, promoted: false } ],
  [ null, 
    { type: 'Rook',         color: 'Gote', position: {row: 1, col: 1}, promoted: false }, 
    null, null, null, null, null, 
    { type: 'Bishop',       color: 'Gote', position: {row: 1, col: 7}, promoted: false }, 
    null ],
  [ { type: 'Pawn', color: 'Gote', position: {row: 2, col: 0}, promoted: false }, 
    { type: 'Pawn', color: 'Gote', position: {row: 2, col: 1}, promoted: false },
    { type: 'Pawn', color: 'Gote', position: {row: 2, col: 2}, promoted: false },
    { type: 'Pawn', color: 'Gote', position: {row: 2, col: 3}, promoted: false },
    { type: 'Pawn', color: 'Gote', position: {row: 2, col: 4}, promoted: false },
    { type: 'Pawn', color: 'Gote', position: {row: 2, col: 5}, promoted: false },
    { type: 'Pawn', color: 'Gote', position: {row: 2, col: 6}, promoted: false },
    { type: 'Pawn', color: 'Gote', position: {row: 2, col: 7}, promoted: false },
    { type: 'Pawn', color: 'Gote', position: {row: 2, col: 8}, promoted: false } ],
  Array(9).fill(null),
  // Array(9).fill(null),
  // Array(9).fill(null),
  Array(9).fill(null),
  // [null, null, null, null, { type: 'King', color: 'Sente', position: {row: 4, col: 4}, promoted: false }, null, null, null, null],
  Array(9).fill(null),
  // Array(9).fill(null),
  // Array(9).fill(null),
  // Array(9).fill(null),
  [ { type: 'Pawn', color: 'Sente', position: {row: 6, col: 0}, promoted: false }, 
    { type: 'Pawn', color: 'Sente', position: {row: 6, col: 1}, promoted: false },
    { type: 'Pawn', color: 'Sente', position: {row: 6, col: 2}, promoted: false },
    { type: 'Pawn', color: 'Sente', position: {row: 6, col: 3}, promoted: false },
    { type: 'Pawn', color: 'Sente', position: {row: 6, col: 4}, promoted: false },
    { type: 'Pawn', color: 'Sente', position: {row: 6, col: 5}, promoted: false },
    { type: 'Pawn', color: 'Sente', position: {row: 6, col: 6}, promoted: false },
    { type: 'Pawn', color: 'Sente', position: {row: 6, col: 7}, promoted: false },
    { type: 'Pawn', color: 'Sente', position: {row: 6, col: 8}, promoted: false } ],
  [ null, 
    { type: 'Bishop',       color: 'Sente', position: {row: 7, col: 1}, promoted: false }, 
    null, null, null, null, null, 
    { type: 'Rook',         color: 'Sente', position: {row: 7, col: 7}, promoted: false }, 
    null ],
  [ { type: 'Lance',        color: 'Sente', position: {row: 8, col: 0}, promoted: false }, 
    { type: 'Horse_Knight', color: 'Sente', position: {row: 8, col: 1}, promoted: false },
    { type: 'Silver',       color: 'Sente', position: {row: 8, col: 2}, promoted: false },
    { type: 'Gold',         color: 'Sente', position: {row: 8, col: 3}, promoted: false },
    { type: 'King',         color: 'Sente', position: {row: 8, col: 4}, promoted: false },
    { type: 'Gold',         color: 'Sente', position: {row: 8, col: 5}, promoted: false },
    { type: 'Silver',       color: 'Sente', position: {row: 8, col: 6}, promoted: false },
    { type: 'Horse_Knight', color: 'Sente', position: {row: 8, col: 7}, promoted: false },
    { type: 'Lance',        color: 'Sente', position: {row: 8, col: 8}, promoted: false } ],
];

/* 
  [null, null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null, null],
*/

// Основное состояние игры
export const $gameState = createStore<GameState>({
  board: initialBoard,
  currentPlayer: 'Sente',
  selectedPiece: null,
  availableMoves: [],
  capturedPieces: {
    player1: [],
    player2: [],
  }
});

// Производные состояния
export const $board = $gameState.map(state => state.board);
export const $currentPlayer = $gameState.map(state => state.currentPlayer);
export const $selectedPiece = $gameState.map(state => state.selectedPiece);
export const $availableMoves = $gameState.map(state => state.availableMoves);
export const $capturedPieces = $gameState.map(state => state.capturedPieces);

// События
export const selectPiece = createEvent<Piece>();                                    // Выбор фигуры
export const movePiece = createEvent<{ from: Coordinates; to: Coordinates }>();     // Перемещение фигуры

$gameState
  .on(selectPiece, (state, piece) => ({
    ...state,
    selectedPiece: piece.position,
    availableMoves: calculateAvailableMoves(piece, state.board),
  }));

// Логика перемещения фигуры
// sample({
//   source: { board: $board, selected: $selectedPiece, moves: $availableMoves },
//   clock: movePiece,
//   filter: (_: any, targetPos: { row: number; col: number; }) => $availableMoves.getState().some(m => m.row === targetPos.row && m.col === targetPos.col),
//   fn: ({ board, selected }: any, targetPos: { row: number; col: number; }) => {
//     if (!selected) return board;
    
//     const newBoard = [...board];
//     const piece = newBoard[selected.row][selected.col];
    
//     if (piece) {
//       newBoard[targetPos.row][targetPos.col] = piece;
//       newBoard[selected.row][selected.col] = null;
//     }
    
//     return newBoard;
//   },
//   target: $board
// });