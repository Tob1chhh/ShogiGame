import { createStore, createEvent } from 'effector';

interface SelectedPiece {
  row: number | null,
  col: number | null
}

export const mainStateScreen = createStore<string>("startScreen");
export const switchMainStateScreen = createEvent<string>();
mainStateScreen.on(switchMainStateScreen, (_, newState) => newState);

// Событие перемещения
export const movePiece = createEvent<{ from: { row: number; col: number }; to: { row: number; col: number } }>();

// Событие выбора фигуры
export const selectPiece = createEvent<{ row: number | null, col: number | null }>();
export const $selectedPiece = createStore<SelectedPiece>({ row: null, col: null });
$selectedPiece.on(selectPiece, (_, { row, col }) => { return { row, col } });

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

// Effector Store для хранения состояния доски
export const $board = createStore<string[][]>(initialBoard).on(movePiece, (state, { from, to }) => {
  const newBoard = state.map(row => [...row]);
  newBoard[to.row][to.col] = newBoard[from.row][from.col];
  newBoard[from.row][from.col] = 'Empty';
  return newBoard;
});
