import { ReactNode } from "react";

export interface Coordinates {
  row: number;
  col: number;
  promotes?: boolean;
}

export interface CellProps {
  row: number;
  col: number;
  isHighlighted: boolean;
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
  color: 'Sente' | 'Gote';
  position: Coordinates;
  promoted: boolean;
  onClick: () => void;
}

export interface GameState {
  board: (Piece | null)[][];
  currentPlayer: 'Sente' | 'Gote';
  selectedPiece: Coordinates | null;
  selectedHandPiece: Piece | null;
  availableMoves: Coordinates[];
  capturedPieces: {
    Sente: Piece[];
    Gote: Piece[];
  };
}

export interface Move {
  from: Coordinates;
  to: Coordinates;
  selectedPiece?: Piece | null;
  selectedHandPiece?: Piece | null;
  promotes?: boolean;
}

export interface PromotionModalState {
  isOpen: boolean;
  response?: (response: boolean) => void;
}