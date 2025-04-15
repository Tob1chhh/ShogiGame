import { Piece, Coordinates } from '../store/game.types';

// Проверка наличия фигуры на клетке игрового поля
const getPiece = (board: (Piece | null)[][], coords: Coordinates): boolean => {
  if (board[coords.row][coords.col] !== null) return true;
  return false;
}

// Общая проверка для выхода за границы доски
const isValidPosition = (r: number, c: number) => 
  r >= 0 && r < 9 && c >= 0 && c < 9;

// Проверка на возможность захвата
const canCapture = (r: number, c: number, board: (Piece | null)[][], piece: Piece) => {
  if (!isValidPosition(r, c)) return false;
  const target = board[r][c];
  return !target || target.color !== piece.color;
};

const getBasicMoves = (piece: Piece, board: (Piece | null)[][]): Coordinates[] => {
  const moves: Coordinates[] = [];
  const { type, color, position, promoted } = piece;
  const { row, col } = position;
  const direction = color === 'Gote' ? 1 : -1;

  const goldMoves = [
    { row: row + direction, col },            // Вперед
    { row, col: col + 1 },                    // Вправо
    { row, col: col - 1 },                    // Влево
    { row: row - direction, col },            // Назад
    { row: row + direction, col: col + 1 },   // Вперед-вправо
    { row: row + direction, col: col - 1 },   // Вперед-влево
  ];
  const horseMoves = [
    { row: row + direction * 2, col: col + 1 },
    { row: row + direction * 2, col: col - 1 },
  ];
  const silverMoves = [
    { row: row + direction, col },            // Вперед
    { row: row + direction, col: col + 1 },   // Вперед-вправо
    { row: row + direction, col: col - 1 },   // Вперед-влево
    { row: row - direction, col: col + 1 },   // Назад-вправо
    { row: row - direction, col: col - 1 },   // Назад-влево
  ];
  const bishopDirections = [
    { dr: 1, dc: 1 }, { dr: 1, dc: -1 },
    { dr: -1, dc: 1 }, { dr: -1, dc: -1 }
  ];
  const rookDirections = [
    { dr: 1, dc: 0 }, { dr: -1, dc: 0 },
    { dr: 0, dc: 1 }, { dr: 0, dc: -1 }
  ];
  const kingMoves = [
    { row: row + 1, col }, { row: row - 1, col },
    { row, col: col + 1 }, { row, col: col - 1 },
    { row: row + 1, col: col + 1 }, { row: row + 1, col: col - 1 },
    { row: row - 1, col: col + 1 }, { row: row - 1, col: col - 1 }
  ];

  // Реализация правил движения для каждой фигуры
  switch (type) {
    case 'Pawn':
      // Обычная пешка
      if (!promoted) {
        const newRow = row + direction;
        if (isValidPosition(newRow, col) && !board[newRow][col]) {
          moves.push({ row: newRow, col: col });
        }
      } 
      // Перевернутая пешка
      else {
        goldMoves.forEach(move => {
          if (canCapture(move.row, move.col, board, piece)) moves.push(move);
        });
      }
      break;
    case 'Lance':
      // Обычное копье
      if (!promoted) {
        if (color === 'Gote') {
          for (let i = position.row + 1; i < 9; i++) {
            if (!getPiece(board, { row: i, col: position.col })) {
              moves.push({ row: i, col: position.col });
            } else break;
          }
        }
        if (color === 'Sente') {
          for (let i = position.row - 1; i >= 0; i--) {
            if (!getPiece(board, { row: i, col: position.col })) {
              moves.push({ row: i, col: position.col });
            } else break;
          }
        }
      }
      // Перевернутое копье
      else {
        goldMoves.forEach(move => {
          if (canCapture(move.row, move.col, board, piece)) moves.push(move);
        });
      }
      break;
    case 'Horse_Knight':
      // Обычный конь
      if (!promoted) {
        horseMoves.forEach(move => {
          if (canCapture(move.row, move.col, board, piece)) moves.push(move);
        });
      }
      // Перевернутый конь
      else {
        goldMoves.forEach(move => {
          if (canCapture(move.row, move.col, board, piece)) moves.push(move);
        });
      }
      break;
    case 'Silver':
      // Обычный серебряный генерал
      if (!promoted) {
        silverMoves.forEach(move => {
          if (canCapture(move.row, move.col, board, piece)) moves.push(move);
        });
      }
      // Перевернутый серебряный генерал
      else {
        goldMoves.forEach(move => {
          if (canCapture(move.row, move.col, board, piece)) moves.push(move);
        });
      }
      break;
    case 'Gold':
      goldMoves.forEach(move => {
        if (canCapture(move.row, move.col, board, piece)) moves.push(move);
      });
      break;
    case 'Bishop':
      // Обычный слон
      bishopDirections.forEach(({ dr, dc }) => {
        let newRow = row + dr, newCol = col + dc;
        while (isValidPosition(newRow, newCol)) {
          moves.push({ row: newRow, col: newCol });
          if (board[newRow][newCol]) {
            if (board[newRow][newCol]?.color !== color 
                || board[newRow][newCol]?.color === color) break;
          }
          newRow += dr; newCol += dc;
        }
      });
      // Перевернутый слон (добаляются ходы короля)
      if (promoted) {
        kingMoves.forEach(move => {
          if (canCapture(move.row, move.col, board, piece)) moves.push(move);
        });
      }
      break;
    case 'Rook':
      // Обычная ладья
      rookDirections.forEach(({ dr, dc }) => {
        let newRow = row + dr, newCol = col + dc;
        while (isValidPosition(newRow, newCol)) {
          moves.push({ row: newRow, col: newCol });
          if (board[newRow][newCol]) {
            if (board[newRow][newCol]?.color !== color 
                || board[newRow][newCol]?.color === color) break;
          }
          newRow += dr; newCol += dc;
        }
      });
      // Перевернутая ладья (добаляются ходы короля)
      if (promoted) {
        kingMoves.forEach(move => {
          if (canCapture(move.row, move.col, board, piece)) moves.push(move);
        });
      }
      break;
    case 'King':
      kingMoves.forEach(move => {
        if (canCapture(move.row, move.col, board, piece)) moves.push(move);
      });
      break;
    default:
      break;
  }

  // Фильтрация невозможных ходов
  return moves.filter(move => 
    isValidPosition(move.row, move.col) && 
    (!board[move.row][move.col] || board[move.row][move.col]?.color !== color)
  );
};

export const calculateAvailableMoves = (
  piece: Piece | null,
  board: (Piece | null)[][]
): Coordinates[] => {
  if (!piece) return [];
  
  const basicMoves = getBasicMoves(piece, board);
  // const promotionMoves: Coordinates[] = [];
  
  // Проверка возможности превращения
  // const shouldPromote = (piece.color === 'Gote' && piece.position.row >= 6) || 
  //                       (piece.color === 'Sente' && piece.position.row <= 2);
  
  // if (shouldPromote && !piece.promoted && piece.type !== 'Gold' && piece.type !== 'King') {
  //   basicMoves.forEach(move => {
  //     promotionMoves.push({ ...move, promotes: true });
  //   });
  // }

  return [...basicMoves]; //, ...promotionMoves
};