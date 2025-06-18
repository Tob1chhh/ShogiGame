import { GamePhase, GameState, Move, Piece, PlayerColor } from "../store/game.types";
import { detectCheck } from "./calculateKingCheck";
import { checkInsufficientMaterial, checkRepetitionDraw } from "./drawCheck";
import { getPieceValue } from "./helpAILogic";

//! Совершение хода в игре
export const makeMove = (game: GameState, move: Move): GameState => {
  const updatedBoard: (Piece | null)[][] = [...game.board];
  const opponent = getOpponent(game.currentPlayer);
  let capturedPieceForHand: Piece | null = null;
  if (move.selectedPiece) {
    if (move.promotes) {
      move.selectedPiece.promoted = true;
    }
    if (move.capturedPiece) {
      if (game.gameMode === 'Points') {
        console.log(getPieceValue((move.capturedPiece.promoted ? 'Promoted' : '') + move.capturedPiece.type));
        game.currentPlayer === 'Sente' ?
          game.gamePoints!.Sente += getPieceValue((move.capturedPiece.promoted ? 'Promoted' : '') + move.capturedPiece.type) :
          game.gamePoints!.Gote += getPieceValue((move.capturedPiece.promoted ? 'Promoted' : '') + move.capturedPiece.type);
      }

      capturedPieceForHand = JSON.parse(JSON.stringify(move.capturedPiece));
      if (capturedPieceForHand) {
        capturedPieceForHand.promoted = false;
        capturedPieceForHand.color = game.currentPlayer;
      }
      
      if (game.currentPlayer === 'Sente') game.capturedPieces.Sente.push(capturedPieceForHand!);
      else game.capturedPieces.Gote.push(capturedPieceForHand!);
    }
    updatedBoard[move.to.row][move.to.col] = move.selectedPiece;
    move.selectedPiece.position = { row: move.to.row, col: move.to.col };
    updatedBoard[move.from.row][move.from.col] = null;
  } else if (move.selectedHandPiece) {
    updatedBoard[move.to.row][move.to.col] = move.selectedHandPiece!;
    move.selectedHandPiece!.position = { row: move.to.row, col: move.to.col };
    if (game.currentPlayer === 'Sente') {
      const resetPiece = game.capturedPieces.Sente.findIndex(piece => piece === move.selectedHandPiece);
      game.capturedPieces.Sente.splice(resetPiece, 1);
    } else {
      const resetPiece = game.capturedPieces.Gote.findIndex(piece => piece === move.selectedHandPiece);
      game.capturedPieces.Gote.splice(resetPiece, 1);
    }
  }
  if (game.gameMode === 'Points') {
    return {
      ...game,
      board: updatedBoard,
      currentPlayer: opponent,
      selectedPiece: null,
      selectedHandPiece: null,
      availableMoves: [],
      movesForPoints: game.movesForPoints ? game.movesForPoints - 1 : null,
    }
  } else {
    // Проверка шаха, мата и ничьи
    const newCheckState = detectCheck(updatedBoard, opponent, opponent === 'Sente' ? game.capturedPieces.Sente : game.capturedPieces.Gote, game.gameMode); 
    let phase: GamePhase = 'Normal';
    if (checkInsufficientMaterial(updatedBoard) || 
        checkRepetitionDraw(updatedBoard, game.positionHistory)) phase = 'Draw';
    else if (!newCheckState) phase = 'Normal';
    else if (newCheckState?.escapeMoves?.length === 0 && 
              newCheckState?.blockMoves?.length === 0) phase = 'Checkmate';
    else phase = 'Check';
    
    return {
      ...game,
      board: updatedBoard,
      currentPlayer: opponent,
      selectedPiece: null,
      selectedHandPiece: null,
      availableMoves: [],
      checkState: newCheckState,
      gamePhase: phase,
    }
  }

}

export const getOpponent = (player: PlayerColor): PlayerColor => player === 'Sente' ? 'Gote' : 'Sente';

export const simulateMove = (game: GameState, move: Move): GameState => {
  const gameState = JSON.parse(JSON.stringify(game)) as GameState;
  const newGameState = makeMove(gameState, move);
  return newGameState;
} 