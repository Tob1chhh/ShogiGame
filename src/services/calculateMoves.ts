import { askPromotion } from '../store/game';
import { Piece, Coordinates, CheckState } from '../store/game.types';
import { isKingInCheck } from './calculateKingCheck';

// Проверка наличия фигуры на клетке игрового поля
export const getPiece = (
  board: (Piece | null)[][], 
  coords: Coordinates
): boolean => {
  if (board[coords.row][coords.col] !== null) return true;
  return false;
}

// Общая проверка для выхода за границы доски
const isValidPosition = (r: number, c: number) => 
  r >= 0 && r < 9 && c >= 0 && c < 9;

// Проверка на возможность захвата
const canCapture = (
  r: number, c: number, 
  board: (Piece | null)[][], 
  piece: Piece
) => {
  if (!isValidPosition(r, c)) return false;
  const target = board[r][c];
  return !target || target.color !== piece.color;
};

const getBasicMoves = (
  piece: Piece, 
  board: (Piece | null)[][]
): Coordinates[] => {
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
        if (isValidPosition(newRow, col)) moves.push({ row: newRow, col: col });
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
  return [...basicMoves]; 
};

export const getAvailableMovesWithCheck = (
  piece: Piece,
  position: Coordinates,
  board: (Piece | null)[][],
  checkState: CheckState | null
): Coordinates[] => {
  const basicMoves = calculateAvailableMoves(piece, board);
  if (!checkState) return getAvailableMovesWithoutCheck(basicMoves, piece, board);

  // Король может ходить только на escapeMoves
  if (piece.type === 'King') {
    return basicMoves.filter(move => 
      checkState.escapeMoves!.some(em => 
        em.row === move.row && em.col === move.col
      )
    );
  }

  // Другие фигуры могут ходить только на блокирующие клетки
  return basicMoves.filter(move => {
    return checkState.blockMoves!.some(block => 
      block.piece.row === position.row &&
      block.piece.col === position.col &&
      block.path.some(cell => cell.row === move.row && cell.col === move.col)
    );
  });
};

// Функция для проверки ходов фигур (убирать ходы, подставляющие короля под шах)
const getAvailableMovesWithoutCheck = (
  moves: Coordinates[], 
  piece: Piece, 
  board: (Piece | null)[][]
): Coordinates[] => {
  return moves.filter(move => {
    // Создаем временную доску с предполагаемым ходом короля
    const tempBoard = JSON.parse(JSON.stringify(board)) as (Piece | null)[][];
    // Перемещаем фигуру на новую позицию
    tempBoard[move.row][move.col] = tempBoard[piece.position.row][piece.position.col];
    tempBoard[piece.position.row][piece.position.col] = null;
    // Проверяем, не находится ли король под шахом на обновленной доске
    return !isKingInCheck(tempBoard, piece.color);
  });
}

// Функция для проверки возможности переворота фигуры
export const shouldPromote = (
  selectedPiece: Piece | null, 
  toPosition: Coordinates
): boolean => {
  if (selectedPiece) {
    const promote = (selectedPiece.color === 'Gote' && toPosition.row >= 6) || 
                    (selectedPiece.color === 'Sente' && toPosition.row <= 2);
    if (promote && !selectedPiece.promoted 
        && selectedPiece.type !== 'Gold' 
        && selectedPiece.type !== 'King') {
      return true;
    }
  }
  return false;
}

// Функция-хэлпер для удобной проверки ответа модального окна переворота фигуры
export const promptPromotion = (): Promise<boolean> => {
  return new Promise((response) => {
    askPromotion({ response });
  });
};

// Функция расчета возможных позиция для сброса фигуры из "руки"
export const calculateAvailableResets = (
  piece: Piece | null,
  board: (Piece | null)[][]
): Coordinates[] => {
  if (!piece) return [];
  const emptyPlaces = board.map((row, rowIndex) => 
    row.map((piece, colIndex) => (piece === null ? { row: rowIndex, col: colIndex } : null)));
  const allEmptyPlaces = emptyPlaces.reduce((acc: Coordinates[], row) => {
    const notNullPlaces = row.filter(place => place !== null) as Coordinates[];
    return [...acc, ...notNullPlaces];
  }, []);

  if (piece.type === 'Pawn' || piece.type === 'Lance') {
    const condition = piece.color === 'Sente' 
      ? (item: Coordinates) => item.row !== 0
      : (item: Coordinates) => item.row !== 8;
    allEmptyPlaces.splice(0, allEmptyPlaces.length, ...allEmptyPlaces.filter(condition));
  }

  if (piece.type === 'Horse_Knight') {
    const condition = piece.color === 'Sente' 
      ? (item: Coordinates) => item.row !== 0 && item.row !== 1
      : (item: Coordinates) => item.row !== 8 && item.row !== 7;
    allEmptyPlaces.splice(0, allEmptyPlaces.length, ...allEmptyPlaces.filter(condition));
  }

  if (piece.type === 'Pawn') {
    const rowsWithPawnsNotPromoted: number[] = [];
    board.forEach((row) => 
      row.forEach((item) => {
        if (item !== null && item.type === 'Pawn' && item.color === piece.color) {
          rowsWithPawnsNotPromoted.push(item.position.col);
        }
      }));

    const filteredEmptyPlaces = allEmptyPlaces.filter(
      place => !rowsWithPawnsNotPromoted.includes(place.col)
    );
    return filteredEmptyPlaces;
  }

  return allEmptyPlaces;
}