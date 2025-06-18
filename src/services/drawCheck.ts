import { Piece } from "../store/game.types";

// Проверка ничьи при четырехкратном повторении 
export const checkRepetitionDraw = (board: (Piece | null)[][], positionHistory: string[]): boolean => {
  const currentPos = boardToString(board);
  const occurrences = positionHistory.filter(pos => pos === currentPos).length;
  positionHistory.push(currentPos);
  // Обнуление истории ходов при совершении более 12 ходов (для оптимизации)
  if (positionHistory.length > 12) positionHistory.length = 0;

  return occurrences >= 3;
};

const boardToString = (board: (Piece | null)[][]): string => {
  return board.map(row => 
    row.map(p => p ? `${p.type[0]}${p.color[0]}${p.promoted ? 'p' : ''}` : '--').join(',')
  ).join('|');
};

// Проверка ничьи при наличии только королей у игроков или королей и 1 легкой фигуры
export const checkInsufficientMaterial = (board: (Piece | null)[][]): boolean => {
  const pieces = {
    Sente: { king: 0, lights: 0, strongs: 0 },
    Gote: { king: 0, lights: 0, strongs: 0 }
  };
  const strongPieces = ['Gold', 'Rook', 'Bishop'];
  const lightPieces = ['Pawn', 'Lance', 'Horse_Knight', 'Silver'];

  for (const row of board) {
    for (const piece of row) {
      if (piece) {
        const side = piece.color;
        pieces[side].king += piece.type === 'King' ? 1 : 0;
        pieces[side].lights += lightPieces.includes(piece.type) ? 1 : 0;
        pieces[side].strongs += strongPieces.includes(piece.type) ? 1 : 0;
      }
    }
  }
  
  return (pieces.Sente.lights <= 1 && pieces.Gote.lights <= 1 && pieces.Sente.strongs === 0 && pieces.Gote.strongs === 0);
};