import { CheckState, Coordinates, Piece, PlayerColor } from "../store/game.types";
import { calculateAvailableMoves, getAvailableResets } from "./calculateMoves";
import { getOpponent } from "./helpGameLogic";

export const isKingInCheck = (
  board: (Piece | null)[][],
  kingColor: PlayerColor
): boolean => {
  const kingPos = findKingPosition(board, kingColor);
  // Проверяем все фигуры противника
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      const piece = board[row][col];
      if (piece && piece.color !== kingColor) {
        const moves = calculateAvailableMoves(piece, board);
        if (kingPos && moves.some(move => move.row === kingPos.row && move.col === kingPos.col)) {
          return true; // Шах обнаружен
        }
      }
    }
  }
  return false;
};

// Вспомогательная функция для поиска короля
export const findKingPosition = (
  board: (Piece | null)[][], 
  color: PlayerColor
): Coordinates | null => {
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      const piece = board[row][col];
      if (piece?.type === 'King' && piece.color === color) {
        return { row, col };
      }
    }
  }
  return null;
};

export const detectCheck = (
  board: (Piece | null)[][], 
  kingColor: PlayerColor,
  capturedPieces: Piece[],
): CheckState | null => {
  const kingPos = findKingPosition(board, kingColor);
  if (!kingPos) return null;

  const attackers: Coordinates[] = [];
  const opponentColor = getOpponent(kingColor);

  // Находим все фигуры, атакующие короля
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      const piece = board[row][col];
      if (piece?.color === opponentColor) {
        const moves = calculateAvailableMoves(piece, board);
        if (moves.some(m => m.row === kingPos.row && m.col === kingPos.col)) {
          attackers.push({ row, col });
        }
      }
    }
  }
  if (attackers.length === 0) return null;

  return {
    attacker: attackers[0], // Берём первую атакующую фигуру
    kingPosition: kingPos,
    escapeMoves: calculateKingEscapeMoves(board, kingPos, kingColor),
    blockMoves: calculateBlockingMoves(board, kingPos, attackers[0], kingColor, capturedPieces)
  };
};

const calculateKingEscapeMoves = (
  board: (Piece | null)[][],
  kingPos: Coordinates,
  kingColor: PlayerColor
): Coordinates[] => {
  const moves: Coordinates[] = [];
  const directions = [
    { dr: -1, dc: -1 }, { dr: -1, dc: 0 }, { dr: -1, dc: 1 },
    { dr: 0, dc: -1 },                     { dr: 0, dc: 1 },
    { dr: 1, dc: -1 },  { dr: 1, dc: 0 },  { dr: 1, dc: 1 }
  ];

  directions.forEach(({ dr, dc }) => {
    const newRow = kingPos.row + dr;
    const newCol = kingPos.col + dc;
    
    if (newRow >= 0 && newRow < 9 && newCol >= 0 && newCol < 9) {
      const piece = board[newRow][newCol];
      if (!piece || piece.color !== kingColor) {
        // Симулируем ход короля
        const tempBoard = simulateKingMove(board, kingPos, { row: newRow, col: newCol });
        if (!isKingInCheck(tempBoard, kingColor)) {
          moves.push({ row: newRow, col: newCol });
        }
      }
    }
  });
  return moves;
};

const calculateBlockingMoves = (
  board: (Piece | null)[][],
  kingPos: Coordinates,
  attackerPos: Coordinates,
  kingColor: PlayerColor,
  capturedPieces: Piece[]
) => {
  const attacker = board[attackerPos.row][attackerPos.col]!;
  const path = getAttackPath(attacker, attackerPos, kingPos);
  const blockingOptions: CheckState['blockMoves'] = [];

  // Ищем фигуры, которые могут перекрыть путь атаки или съесть атакующую фигуру
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      const piece = board[row][col];
      if (piece?.color === kingColor && piece.type !== 'King') {
        const moves = calculateAvailableMoves(piece, board);
        const blockingCells = moves.filter(move => 
          path.some(cell => cell.row === move.row && cell.col === move.col) || 
          (move.row === attackerPos.row && move.col === attackerPos.col)
        );
        
        if (blockingCells.length > 0) {
          blockingOptions.push({
            piece: { row, col },
            path: blockingCells
          });
        }
      }
    }
  }

  capturedPieces.forEach((piece) => {
    const resets = getAvailableResets(piece, board);
    const blockingCells = resets.filter(reset => 
      path.some(cell => cell.row === reset.row && cell.col === reset.col)
    );

    if (blockingCells.length > 0) {
      blockingOptions.push({
        piece: { row: piece.position.row, col: piece.position.col },
        path: blockingCells
      });
    }
  });

  return blockingOptions;
};

// Получаем путь атаки между фигурой и королем
const getAttackPath = (
  attacker: Piece,
  attackerPos: Coordinates,
  kingPos: Coordinates
): Coordinates[] => {
  if (attacker.type === 'Horse_Knight') return []; // Конь не атакует по линии

  // console.log(attacker, attackerPos, kingPos);
  
  const path: Coordinates[] = [];
  const dr = Math.sign(kingPos.row - attackerPos.row);
  const dc = Math.sign(kingPos.col - attackerPos.col);
  let row = attackerPos.row + dr;
  let col = attackerPos.col + dc;
  
  
  while (row !== kingPos.row || col !== kingPos.col) {
    path.push({ row, col });
    row += dr;
    col += dc;
  }
  
  return path;
};

// Вспомогательная функция для симуляции хода
const simulateKingMove = (
  board: (Piece | null)[][],
  from: Coordinates,
  to: Coordinates
): (Piece | null)[][] => {
  const newBoard = JSON.parse(JSON.stringify(board));
  newBoard[to.row][to.col] = newBoard[from.row][from.col];
  newBoard[from.row][from.col] = null;
  return newBoard;
};