import { createStore, createEvent } from 'effector';
import { GameMode, GameState, ModalState, Move, Piece } from './game.types';
import { getAvailableResetsWithCheck, getAvailableMovesWithCheck } from '../services/calculateMoves';
import { makeMove } from '../services/helpGameLogic';
import { initialBoard, initialBoardLimits, initialBoardNewFigure } from './game.boards';

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
  movesForPoints: null,
  gamePoints: { Sente: 0, Gote: 0 },
  positionHistory: []
});

// Производные состояния
export const $gameMode = $gameState.map(state => state.gameMode);
export const $board = $gameState.map(state => state.board);
export const $aiLevel = $gameState.map(state => state.aiLevel);
export const $currentPlayer = $gameState.map(state => state.currentPlayer);
export const $selectedPiece = $gameState.map(state => state.selectedPiece);
export const $selectedHandPiece = $gameState.map(state => state.selectedHandPiece);
export const $availableMoves = $gameState.map(state => state.availableMoves);
export const $capturedPieces = $gameState.map(state => state.capturedPieces);
export const $checkState = $gameState.map(state => state.checkState);
export const $gamePhase = $gameState.map(state => state.gamePhase);
export const $movesForPoints = $gameState.map(state => state.movesForPoints);

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
    availableMoves: getAvailableMovesWithCheck(piece, piece.position, state.board, state.checkState, state.gameMode),
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
    movesForPoints: null,
    gamePoints: { Sente: 0, Gote: 0 },
    positionHistory: [],
  }))
  .on(changeGameMode, (state, mode) => {
    if (mode === 'Points') {
      return {
        ...state,
        gameMode: mode,
        movesForPoints: 50,
        board: JSON.parse(JSON.stringify(initialBoard)),
      }
    } 
    if (mode === 'Limits') {
      return {
        ...state,
        gameMode: mode,
        board: JSON.parse(JSON.stringify(initialBoardLimits)),
      }
    } 
    if (mode === 'NewFigure') {
      return {
        ...state,
        gameMode: mode,
        board: JSON.parse(JSON.stringify(initialBoardNewFigure)),
      }
    }
    return {
      ...state,
      gameMode: mode,
    }
  })
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

export const $learningModal = createStore<boolean>(false);
export const openLearningModal = createEvent();
export const closeLearningModal = createEvent();
$learningModal
  .on(openLearningModal, () => true)
  .on(closeLearningModal, () => false);