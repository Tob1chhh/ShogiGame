import { createStore, createEvent } from 'effector';
import { Coordinates, GameState } from './game.types';

// Начальное состояние доски
const initialBoard: string[][] = [
  ['Gote_Lance', 'Gote_Horse_Knight', 'Gote_Silver', 'Gote_Gold', 'Gote_King', 'Gote_Gold', 'Gote_Silver', 'Gote_Horse_Knight', 'Gote_Lance'],  
  ['Empty', 'Gote_Rook', 'Empty', 'Empty', 'Empty', 'Empty', 'Empty', 'Gote_Bishop', 'Empty'],  
  ['Gote_Pawn', 'Gote_Pawn', 'Gote_Pawn', 'Gote_Pawn', 'Gote_Pawn', 'Gote_Pawn', 'Gote_Pawn', 'Gote_Pawn', 'Gote_Pawn'],  
  Array(9).fill('Empty'),
  Array(9).fill('Empty'),
  Array(9).fill('Empty'),
  ['Sente_Pawn', 'Sente_Pawn', 'Sente_Pawn', 'Sente_Pawn', 'Sente_Pawn', 'Sente_Pawn', 'Sente_Pawn', 'Sente_Pawn', 'Sente_Pawn'],  
  ['Empty', 'Sente_Bishop', 'Empty', 'Empty', 'Empty', 'Empty', 'Empty', 'Sente_Rook', 'Empty'], 
  ['Sente_Lance', 'Sente_Horse_Knight', 'Sente_Silver', 'Sente_Gold', 'Sente_King', 'Sente_Gold', 'Sente_Silver', 'Sente_Horse_Knight', 'Sente_Lance'],  
];

// Основное состояние игры
export const $gameState = createStore<GameState>({
  board: initialBoard,
  currentPlayer: 'player1',
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
export const selectPiece = createEvent<Coordinates>();                              // Выбор фигуры
export const movePiece = createEvent<{ from: Coordinates; to: Coordinates }>();     // Перемещение фигуры

$gameState
  .on(selectPiece, (state, coords) => ({
    ...state,
    selectedPiece: coords,
    availableMoves: [],
  }));