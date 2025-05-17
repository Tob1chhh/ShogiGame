import { createStore, createEvent } from 'effector';
import { GameMode, GameState, ModalState, Move, Piece } from './game.types';
import { getAvailableResetsWithCheck, getAvailableMovesWithCheck } from '../services/calculateMoves';
import { makeMove } from '../services/helpGameLogic';

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
  // [ null, null, null, null, 
  //   { type: 'King', color: 'Gote', position: {row: 0, col: 4}, promoted: false }, 
  //   null, null, null, null ],
  Array(9).fill(null),
  Array(9).fill(null),
  Array(9).fill(null),
  // [ null, null, null, null, 
  //   { type: 'Silver', color: 'Gote', position: {row: 4, col: 4}, promoted: false }, 
  //   null, null, null, null ],
  // [null, null, null, null, { type: 'King', color: 'Gote', position: {row: 2, col: 4}, promoted: false }, null, null, null, null],
  // Array(9).fill(null),
  // Array(9).fill(null),
  // [{ type: 'Rook', color: 'Sente', position: {row: 5, col: 0}, promoted: false }, { type: 'Gold', color: 'Gote', position: {row: 5, col: 1}, promoted: false }, null, null, null, null, null, null, null],
  // [null, null, null, 
  //   { type: 'Rook', color: 'Sente', position: {row: 6, col: 3}, promoted: false }, 
  //   null, 
  //   { type: 'Rook', color: 'Sente', position: {row: 6, col: 5}, promoted: false }, 
  //   null, null, null],
  // Array(9).fill(null),
  // [null, null, null, null, { type: 'King', color: 'Sente', position: {row: 7, col: 4}, promoted: false }, null, null, null, null],
  // Array(9).fill(null),
  // [ null, null, null, null, 
  //   { type: 'Pawn', color: 'Sente', position: {row: 6, col: 4}, promoted: false }, 
  //   null, null, null, null ],
  // Array(9).fill(null),
  // [ { type: 'Pawn', color: 'Sente', position: {row: 8, col: 0}, promoted: false }, { type: 'Pawn', color: 'Sente', position: {row: 8, col: 1}, promoted: false }, null, null, 
  //   { type: 'King', color: 'Sente', position: {row: 8, col: 4}, promoted: false }, 
  //   null, null, null, null ],
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

// Основное состояние игры
export const $gameState = createStore<GameState>({
  gameMode: 'Classic',
  aiLevel: null,
  board: JSON.parse(JSON.stringify(initialBoard)),
  currentPlayer: 'Sente',
  selectedPiece: null,
  selectedHandPiece: null,
  availableMoves: [],
  capturedPieces: {
    Sente: [],
    Gote: [],
  },
  checkState: null,
  gamePhase: 'Normal',
  gameResult: null,
});

// Производные состояния
export const $board = $gameState.map(state => state.board);
export const $aiLevel = $gameState.map(state => state.aiLevel);
export const $currentPlayer = $gameState.map(state => state.currentPlayer);
export const $selectedPiece = $gameState.map(state => state.selectedPiece);
export const $selectedHandPiece = $gameState.map(state => state.selectedHandPiece);
export const $availableMoves = $gameState.map(state => state.availableMoves);
export const $capturedPieces = $gameState.map(state => state.capturedPieces);
export const $checkState = $gameState.map(state => state.checkState);
export const $gamePhase = $gameState.map(state => state.gamePhase);

// События
export const selectPiece = createEvent<Piece>();                    // Выбор фигуры
export const movePiece = createEvent<Move>();                       // Перемещение фигуры
export const selectNullCell = createEvent();                        // Сброс выбранной фигуры
export const selectCapturedPiece = createEvent<Piece>();            // Выбор захваченной фигуры
export const resetGame = createEvent();                             // Сброс на начальное состояние игры при выходе в главное меню
export const changeGameMode = createEvent<GameMode>();              // Смена игрового режима
export const setAILevel = createEvent<'Hard' | 'Easy' | null>();    // Установка уровня сложности ИИ

// Обработка событий
$gameState
  .on(selectPiece, (state, piece) => ({
    ...state,
    selectedPiece: piece.position,
    selectedHandPiece: null,
    availableMoves: getAvailableMovesWithCheck(piece, piece.position, state.board, state.checkState),
  }))
  .on(movePiece, (state, move) => {
    return makeMove(state, move);
  })
  .on(selectCapturedPiece, (state, piece) => ({
    ...state,
    selectedPiece: null,
    selectedHandPiece: piece,
    availableMoves: getAvailableResetsWithCheck(piece, piece.position, state.board, state.checkState),
  }))
  .on(selectNullCell, (state) => ({
    ...state,
    selectedPiece: null,
    selectedHandPiece: null,
    availableMoves: [],
  }))
  .on(resetGame, () => ({
    gameMode: 'Classic',
    aiLevel: null,
    board: JSON.parse(JSON.stringify(initialBoard)),
    currentPlayer: 'Sente',
    selectedPiece: null,
    selectedHandPiece: null,
    availableMoves: [],
    capturedPieces: {
      Sente: [],
      Gote: [],
    },
    checkState: null,
    gamePhase: 'Normal',
    gameResult: null,
  }))
  .on(changeGameMode, (state, mode) => ({
    ...state,
    gameMode: mode,
  }))
  .on(setAILevel, (state, aiLevel) => ({
    ...state,
    aiLevel: aiLevel,
  }));


// Открытие модального окна переворота фигуры
export const $promotionModal = createStore<ModalState>({ isOpen: false });
export const askPromotion = createEvent<{ response: (answer: boolean) => void }>();
export const promotionAnswer = createEvent<boolean>();
$promotionModal
  .on(askPromotion, (_, { response }) => ({ isOpen: true, response }))
  .on(promotionAnswer, (state, answer) => {
    state.response?.(answer);
    return { isOpen: false, response: undefined };
  });

  // Открытие модального окна результата игры
export const $resultGameModal = createStore<ModalState>({ isOpen: false });
export const openModal = createEvent<string>('');
export const closeModal = createEvent();
$resultGameModal
  .on(openModal, (_, info) => ({isOpen: true, resultString: info}))
  .on(closeModal, () => ({isOpen: false}));
