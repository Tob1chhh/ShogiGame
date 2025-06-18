import { CheckState, Coordinates, GameMode, GameState, Move, Piece, PlayerColor } from "../store/game.types";
import { getAvailableMovesWithCheck, getAvailableResetsWithCheck, shouldPromote } from "./calculateMoves";
import { getOpponent } from "./helpGameLogic";

// Веса фигур
export const PIECE_VALUES: Record<string, number> = {
  'King': 1000,
  'Rook': 10, 'PromotedRook': 15,
  'Bishop': 10, 'PromotedBishop': 15,
  'Tengu': 9, 'PromotedTengu': 12,
  'Gold': 8, 
  'Silver': 5, 'PromotedSilver': 6,
  'Knight': 3, 'PromotedKnight': 4,
  'Lance': 3, 'PromotedLance': 4,
  'Pawn': 1, 'PromotedPawn': 2,
};

export const getPieceValue = (pieceType: string): number => PIECE_VALUES[pieceType] || 0;

//! Функция получения всех доступных ходов
export const getAllPossibleMoves = (
  forMove: Piece[], 
  forReset: Piece[], 
  board: (Piece | null)[][],
  checkState: CheckState | null,
  gameMode: GameMode,
): Move[] => {
  const allMoves: Move[] = [];
  // Перебор всех фигур на поле и получение их ходов
  if (forMove) {
    forMove.forEach((piece) => {
      const movesEndCoordinates: Coordinates[] = getAvailableMovesWithCheck(piece, piece.position, board, checkState, gameMode);
      if (movesEndCoordinates.length > 0) {
        movesEndCoordinates.forEach((coordinates) => {
          const newMove: Move = {
            from: { row: piece.position.row, col: piece.position.col },
            to: { row: coordinates.row, col: coordinates.col },
            selectedPiece: JSON.parse(JSON.stringify(piece)),
          }
          if (board[coordinates.row][coordinates.col] !== null) 
            newMove.capturedPiece = JSON.parse(JSON.stringify(board[coordinates.row][coordinates.col]));
          
          if (
            ((piece.type === 'Pawn' || piece.type === 'Lance') && (coordinates.row === 8 || coordinates.row === 0)) 
            || (piece.type === 'Horse_Knight' && (coordinates.row === 8 || coordinates.row === 7 || coordinates.row === 0 || coordinates.row === 1))
          ) {
            newMove.needPromote = true;
            newMove.promotes = true;
          }
          else if (shouldPromote(board[newMove.from.row][newMove.from.col], coordinates, gameMode)) {
            newMove.needPromote = true;
            newMove.promotes = true;
          }
  
          allMoves.push(newMove);
        });
      }
    });
  }

  // Перебор всех фигур в руке и получение их ходов
  if (forReset) {
    forReset.forEach((piece) => {
      const movesEndCoordinates = getAvailableResetsWithCheck(piece, piece.position, board, checkState);
      if (movesEndCoordinates.length > 0) {
        movesEndCoordinates.forEach((coords) => {
          allMoves.push({
            from: { row: piece.position.row, col: piece.position.col },
            to: { row: coords.row, col: coords.col },
            selectedHandPiece: JSON.parse(JSON.stringify(piece)),
          });
        });
      }
    });
  }

  return allMoves;
}

//! Функция для получения всех доступных фигур
export const getAllPieces = (
  board: (Piece | null)[][], 
  player: PlayerColor
): Piece[] => {
  const availablePieces: Piece[] = [];
  board.map((row) => {
    row.map((piece) => {
      if (piece && piece?.color === player) availablePieces.push(JSON.parse(JSON.stringify(piece)));
    })
  });
  return availablePieces;
}

//! Функция сортировки с помощью эвристической оценки хода
export const getSortedMoves = (
  game: GameState, 
  moves: Move[]
): Move[] => {
  return moves.sort((a, b) => {
    return heuristicScore(b, game.board, game.currentPlayer, game.gameMode) - heuristicScore(a, game.board, game.currentPlayer, game.gameMode);
  });
}

const heuristicScore = (
  move: Move, 
  board: (Piece | null)[][], 
  currentPlayer: PlayerColor,
  gameMode: GameMode,
): number => {
  let score = 0;
  // 1. Взятие фигуры (чем ценнее фигура, тем лучше)
  if (move.capturedPiece) score += getPieceValue(
    move.capturedPiece.promoted ? 
    'Promoted' + move.capturedPiece.type : 
    move.capturedPiece.type
  );
  // 2. Превращение фигуры (усиливает свою фигуру)
  if (move.promotes) score += 3;
  // 3. Близость к вражескому королю (атакующий ход)
  const enemyKingPos = getEnemyKingPosition(board, getOpponent(currentPlayer), gameMode);
  if (enemyKingPos) {
    const distanceToKing = calculateDistanceToKing(move.to, enemyKingPos);
    score += (10 - distanceToKing);
  }

  return score;
}

export const getEnemyKingPosition = (
  board: (Piece | null)[][], 
  opponent: PlayerColor,
  gameMode: GameMode,
): Coordinates | null => {
  let sizeBoard: number = 9;
  if (gameMode === 'Limits') sizeBoard = 5;

  for (let row = 0; row < sizeBoard; row++) {
    for (let col = 0; col < sizeBoard; col++) {
      const piece = board[row][col];
      if (piece?.type === 'King' && piece?.color === opponent) return piece.position;
    }
  }
  return null;
}

const calculateDistanceToKing = (moveTo: Coordinates, enemyKingPos: Coordinates): number => {
  return Math.abs(moveTo.row - enemyKingPos.row) + Math.abs(moveTo.col - enemyKingPos.col);
}