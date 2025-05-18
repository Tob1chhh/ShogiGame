import { ReactNode } from "react";

export type GamePhase = 'Normal' | 'Check' | 'Checkmate' | 'Draw';
export type PlayerColor = 'Sente' | 'Gote';

export interface Coordinates {
  row: number;
  col: number;
  promotes?: boolean;
}

export interface CellProps {
  row: number;
  col: number;
  isHighlighted: boolean;
  isCheck: boolean;
  piece: ReactNode | null;
}

export type PieceType = 'Pawn' 
  | 'Lance' 
  | 'Horse_Knight' 
  | 'Silver'
  | 'Gold' 
  | 'King' 
  | 'Rook' 
  | 'Bishop';

export interface Piece {
  type: PieceType;
  color: PlayerColor;
  position: Coordinates;
  promoted: boolean;
  onClick: () => void;
}

export type GameMode = 'Classic'
  | 'Points' 
  | 'Limits'
  | 'NewFigure'

export interface GameState {
  gameMode: GameMode;
  aiLevel: 'Hard' | 'Easy' | null;
  board: (Piece | null)[][];
  currentPlayer: PlayerColor;
  selectedPiece: Coordinates | null;
  selectedHandPiece: Piece | null;
  availableMoves: Coordinates[];
  capturedPieces: {
    Sente: Piece[];
    Gote: Piece[];
  };
  checkState: CheckState | null;
  gamePhase: GamePhase;
  gameResult: PlayerColor | null;
}

export interface Move {
  from: Coordinates;
  to: Coordinates;
  selectedPiece?: Piece | null;
  selectedHandPiece?: Piece | null;
  needPromote?: boolean;
  promotes?: boolean;
  capturedPiece?: Piece | null;
  setCheck?: boolean;
}

export interface ModalState {
  isOpen: boolean;
  response?: (response: boolean) => void;
  resultString?: string;
}

export interface GameResult {
  type: GamePhase;
  winner?: PlayerColor;
  checkingPlayer?: PlayerColor;
}

export interface CheckState {
  attacker?: Coordinates | null; // Позиция атакующей фигуры
  kingPosition?: Coordinates;    // Позиция короля под шахом
  escapeMoves?: Coordinates[];   // Возможные ходы короля
  blockMoves?: {                 // Варианты блокировки
    piece: Coordinates;          // Какая фигура может блокировать
    path: Coordinates[];         // Какие клетки нужно перекрыть
  }[];
}

export type PieceRules = {
  name: string;
  image: string;
  promoteName?: string;
  promoteImage?: string;
  movesGif: string;
};