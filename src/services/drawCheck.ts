import { Piece } from "../store/game.types";

const positionHistory: string[] = [];

// Проверка повторения 
export const checkRepetitionDraw = (board: (Piece | null)[][]): boolean => {
  const currentPos = boardToString(board);
  const occurrences = positionHistory.filter(pos => pos === currentPos).length;
  positionHistory.push(currentPos);
  
  // Ничья при Четырехкратном повторении
  return occurrences >= 3;
};

const boardToString = (board: (Piece | null)[][]): string => {
  return board.map(row => 
    row.map(p => p ? `${p.type[0]}${p.color[0]}${p.promoted ? 'p' : ''}` : '--').join(',')
  ).join('|');
};

export const checkInsufficientMaterial = (board: (Piece | null)[][]): boolean => {
  const pieces = {
    Sente: { king: 0, others: 0 },
    Gote: { king: 0, others: 0 }
  };

  // Подсчет фигур
  for (const row of board) {
    for (const piece of row) {
      if (piece) {
        const side = piece.color;
        pieces[side].king += piece.type === 'King' ? 1 : 0;
        pieces[side].others += piece.type !== 'King' ? 1 : 0;
      }
    }
  }

  // Условия ничьи:
  // 1. У обоих только короли
  // 2. Король + 1 легкая фигура против короля
  return (
    (pieces.Sente.others === 0 && pieces.Gote.others === 0) ||
    (pieces.Sente.others <= 1 && pieces.Gote.others <= 1)
  );
};