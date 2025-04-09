import { ReactNode } from "react";

export interface Coordinates {
  row: number;
  col: number;
}

export interface CellProps {
  row: number;
  col: number;
  piece: ReactNode | null;
}

export interface Piece {
  type: string;
  color: string;
  position: Coordinates;
  promoted: boolean;
  onClick: () => void;
}

export interface GameState {
  board: Array<Array<Piece | null>>;
  currentPlayer: 'player1' | 'player2';
  selectedPiece: Coordinates | null;
  availableMoves: Coordinates[];
  capturedPieces: {
    player1: Piece[];
    player2: Piece[];
  };
}
