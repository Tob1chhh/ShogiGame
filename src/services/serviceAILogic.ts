// TODO: реализовать логику игры сложного уровня ИИ

import { GameState, Move, Piece, PlayerColor } from "../store/game.types"
import { getAllPieces, getAllPossibleMoves, getPieceValue, getSortedMoves } from "./helpAILogic";
import { getOpponent, simulateMove } from "./helpGameLogic";

//! Реализация Легкого уровня ИИ
export const easyAILogic = (
  game: GameState,
): Move | null => {
  if (game.currentPlayer === 'Gote') {
    // Получаем все фигуры, доступные ИИ
    const availableAIPieces: Piece[] = getAllPieces(game.board, 'Gote');
    // Получаем все доступные ходы для всех фигур доступных ИИ
    const allPossibleAIMoves: Move[] = getAllPossibleMoves(availableAIPieces, game.capturedPieces.Gote, game.board, game.checkState);
    // Выбирается случайный ход
    if (allPossibleAIMoves.length > 0) return allPossibleAIMoves[Math.floor(Math.random() * allPossibleAIMoves.length)];
  }

  return null;
}

//! Реализация Сложного уровня ИИ
// Оценочная функция (чем выше, тем лучше для `maximizingPlayer`)
const evaluate = (
  board: (Piece | null)[][], 
  currentPlayer: PlayerColor
): number => {
  let score = 0;
  // Материал (фигуры на доске + резерв)
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      const piece = board[row][col];
      if (!piece) continue;

      let pieceType = '';
      if (piece.promoted) pieceType = 'Promoted' + piece.type;
      else pieceType = piece.type;

      const value = getPieceValue(pieceType);
      score += piece.color === currentPlayer ? value : -value;
    }
  }

  return score;
}

// Minimax с Alpha-Beta
const minimaxWithAlphaBeta = (
  game: GameState,
  depth: number,
  alpha: number,
  beta: number,
  maximizingPlayer: boolean,
): number => {
  if (depth === 0 || 
    (game && game.gamePhase === 'Checkmate') || 
    (game && game.gamePhase === 'Draw')) {
    return evaluate(
      game.board, maximizingPlayer 
      ? game.currentPlayer 
      : getOpponent(game.currentPlayer)
    );
  }

  const moves: Move[] = getAllPossibleMoves(
    getAllPieces(game.board, game.currentPlayer),
    game.currentPlayer === 'Gote' ? game.capturedPieces.Gote : game.capturedPieces.Sente,
    game.board, 
    game.checkState
  );
  const sortedMoves = getSortedMoves(game, moves);
  const bestSortedMoves = sortedMoves.filter((move) => move.capturedPiece || move.setCheck);
  
  let maxEval = -Infinity;
  let minEval = +Infinity;

  if (bestSortedMoves.length !== 0) {
    // Если ход делает ИИ (максимизируем оценку)
    if (maximizingPlayer) {
      for (const move of bestSortedMoves) {
        const newGameState = simulateMove(game, move);
        const evalue = minimaxWithAlphaBeta(newGameState, depth - 1, alpha, beta, false);
        maxEval = Math.max(maxEval, evalue);
        alpha = Math.max(alpha, evalue);
        if (beta <= alpha) break; // Beta-отсечение
      }
      return maxEval;
    // Если ход делает игрок (минимизируем оценку)
    } else {
      for (const move of bestSortedMoves) {
        const newGameState = simulateMove(game, move);
        const evalue = minimaxWithAlphaBeta(newGameState, depth - 1, alpha, beta, true);
        minEval = Math.min(minEval, evalue);
        beta = Math.min(beta, evalue);
        if (beta <= alpha) break; // Alpha-отсечение
      }
      return minEval;
    }
  } else {
    const newGameState = simulateMove(game, sortedMoves[Math.floor(Math.random() * sortedMoves.length)]);
    if (maximizingPlayer) {
      const evalue = minimaxWithAlphaBeta(newGameState, depth - 1, alpha, beta, false);
      maxEval = Math.max(maxEval, evalue);
      alpha = Math.max(alpha, evalue);
    } else {
      const evalue = minimaxWithAlphaBeta(newGameState, depth - 1, alpha, beta, true);
      minEval = Math.min(minEval, evalue);
      beta = Math.min(beta, evalue);
    }
    return maximizingPlayer ? maxEval : minEval;
  }
}

export const hardAILogic = (
  game: GameState,
  currentPlayer: PlayerColor,
  depth: number = 3
): Move | null => {
  const moves: Move[] = getAllPossibleMoves(
    getAllPieces(game.board, 'Gote'),
    currentPlayer === 'Gote' ? game.capturedPieces.Gote : game.capturedPieces.Sente,
    game.board, 
    game.checkState
  );
  const sortedMoves = getSortedMoves(game, moves);

  if (sortedMoves.length === 0) return null;

  const bestSortedMoves = sortedMoves.filter((move) => move.capturedPiece || move.setCheck);
  let bestMove = bestSortedMoves.length !== 0 ? bestSortedMoves[0] : sortedMoves[Math.floor(Math.random() * sortedMoves.length)];
  let bestValue = -Infinity;

  console.log(bestSortedMoves);

  if (bestSortedMoves.length !== 0) {
    for (const move of bestSortedMoves) {
      const newGameState = simulateMove(game, move);
      const moveValue = minimaxWithAlphaBeta(newGameState, depth - 1, -Infinity, +Infinity, false);

      if (moveValue > bestValue) {
        bestValue = moveValue;
        bestMove = move;
      }
    }
  }

  return bestMove;
}