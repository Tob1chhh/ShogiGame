import { createStore, createEvent } from 'effector';
import { GameState, Move, Piece, PromotionModalState } from './game.types';
import { calculateAvailableMoves, shouldPromote } from '../services/calculateMoves';

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
  // Array(9).fill(null),
  [null, null, null, null, { type: 'Rook', color: 'Sente', position: {row: 4, col: 4}, promoted: false }, null, null, null, null],
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
export const selectPiece = createEvent<Piece>();    // Выбор фигуры
export const movePiece = createEvent<Move>();       // Перемещение фигуры

$gameState
  .on(selectPiece, (state, piece) => ({
    ...state,
    selectedPiece: piece.position,
    availableMoves: calculateAvailableMoves(piece, state.board),
  }))
  .on(movePiece, (state, move) => {
    const updatedBoard: (Piece | null)[][] = [...state.board];
    if (move.selectedPiece) {
      if (move.promotes) {
        move.selectedPiece.promoted = true;
      }
      updatedBoard[move.to.row][move.to.col] = move.selectedPiece;
      move.selectedPiece.position = { row: move.to.row, col: move.to.col };
      updatedBoard[move.from.row][move.from.col] = null;
    }
    
    return {
      ...state,
      board: updatedBoard,
      currentPlayer: state.currentPlayer === 'Sente' ? 'Gote' : 'Sente',
      selectedPiece: null,
      availableMoves: [],
    }
  });

// Открытие модального окна переворота фигуры
export const $promotionModal = createStore<PromotionModalState>({ isOpen: false });
export const askPromotion = createEvent<{ response: (answer: boolean) => void; }>();
export const promotionAnswer = createEvent<boolean>();
$promotionModal
  .on(askPromotion, (_, { response }) => ({ isOpen: true, response }))
  .on(promotionAnswer, (state, answer) => {
    state.response?.(answer);
    return { isOpen: false, response: undefined };
  });
