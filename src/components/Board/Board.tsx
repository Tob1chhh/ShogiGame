import React, { useEffect } from 'react';
import { useUnit } from 'effector-react';
import { 
  $availableMoves, $board, 
  $capturedPieces, $checkState, 
  $currentPlayer, $gameState, $selectedHandPiece, 
  $selectedPiece, movePiece, 
  openModal, selectNullCell
} from '../../store/game';
import { selectPiece } from '../../store/game';
import { CellProps, GameState, Move } from '../../store/game.types';
import { promptPromotion, shouldPromote } from '../../services/calculateMoves';
import { GamePiece } from '../Piece/Piece';
import { easyAILogic, hardAILogic } from '../../services/serviceAILogic';
import { getOpponent, simulateMove } from '../../services/helpGameLogic';
import { getAllPieces, getAllPossibleMoves } from '../../services/helpAILogic';

export const Board = () => {
  const game = useUnit($gameState);
  const board = useUnit($board);
  const availableMoves = useUnit($availableMoves);
  const currentPlayer = useUnit($currentPlayer);
  const checkState = useUnit($checkState);

  useEffect(() => {
    if (game.gamePhase === 'Checkmate')
      openModal(`Игра окончена!\nПобедитель: ${currentPlayer === 'Sente' ? 'Готэ ↓' : 'Сэнтэ ↑'}`);

    if (game.gamePhase === 'Draw')
      openModal(`Игра окончена!\nОбъявлена ничья!`);
  }, [game]);

  const getCellState = (row: number, col: number) => {
    if (checkState?.kingPosition 
        && checkState.kingPosition.row === row 
        && checkState.kingPosition.col === col) {
      return 'king-in-check';
    }
    return 'normal';
  };

  return (
    <div className="grid grid-cols-9 border-2 border-orange-900">
      {board.map((row, rowIndex) => 
        row.map((piece, colIndex) => {
          return (
            <Cell row={piece ? piece.position.row : rowIndex}
                  col={piece ? piece.position.col : colIndex}
                  isHighlighted={availableMoves.some(move => move.row === rowIndex && move.col === colIndex)}
                  isCheck={getCellState(piece ? piece.position.row : rowIndex, piece ? piece.position.col : colIndex) === 'king-in-check' && piece?.type === 'King'}
                  piece={
                    piece === null ? null
                    : <GamePiece
                        type={piece.type}
                        color={piece.color}
                        position={piece.position}
                        promoted={piece.promoted}
                        onClick={() => { if (piece.color === currentPlayer) selectPiece(piece) }}
                      />
                  }>
            </Cell>
          )
        })
      )}
    </div>
  );
};

const Cell = React.memo(({ row, col, isHighlighted, isCheck, piece }: CellProps) => {
  const game = useUnit($gameState);
  const board = useUnit($board);
  const currentPlayer = useUnit($currentPlayer);
  const capturedPieces = useUnit($capturedPieces);
  const selectedPiece = useUnit($selectedPiece);
  const selectedHandPiece = useUnit($selectedHandPiece);

  const onClick = async () => {
    if (piece === null) selectNullCell();
    if (isHighlighted) {
      let newMove: Move | null = null;
      if (selectedPiece) {
        newMove = {
          from: { row: selectedPiece.row, col: selectedPiece.col },
          to: { row: row, col: col },
          selectedPiece: JSON.parse(JSON.stringify(board[selectedPiece.row][selectedPiece.col])),
        }

        if (board[row][col] !== null) 
          newMove.capturedPiece = JSON.parse(JSON.stringify(board[row][col]));

        if (simulateMove(game, newMove).checkState) 
          newMove.setCheck = true;

        if (
          ((newMove.selectedPiece?.type === 'Pawn' || newMove.selectedPiece?.type === 'Lance') && (row === 8 || row === 0)) 
          || (newMove.selectedPiece?.type === 'Horse_Knight' && (row === 8 || row === 7 || row === 1 || row === 0))
        ) {
          newMove.needPromote = true;
          newMove.promotes = true;
        }
        else if (shouldPromote(board[newMove.from.row][newMove.from.col], { row: row, col: col })) {
          const shouldPromote = await promptPromotion();
          if (shouldPromote) {
            newMove.needPromote = shouldPromote;
            newMove.promotes = true;
          }
        }
      } else if (selectedHandPiece) {
        newMove = {
          from: { row: selectedHandPiece.position.row, col: selectedHandPiece.position.col },
          to: { row: row, col: col },
          selectedHandPiece: currentPlayer === 'Sente' 
            ? capturedPieces.Sente.find(piece => piece === selectedHandPiece)
            : capturedPieces.Gote.find(piece => piece === selectedHandPiece)
        }
      }
      movePiece(newMove!);

      const currentState = JSON.parse(JSON.stringify($gameState.getState())) as GameState; // Получаем актуальное состояние
      if (getAllPossibleMoves(
            getAllPieces(currentState.board, currentState.currentPlayer),
            currentState.currentPlayer === 'Gote' ? currentState.capturedPieces.Gote : currentState.capturedPieces.Sente,
            currentState.board, 
            currentState.checkState
      ).length === 0) openModal(`Игра окончена!\nХодов не осталось!\n
        Победитель: ${getOpponent(currentState.currentPlayer) === 'Gote' ? 'Готэ ↓' : 'Сэнтэ ↑'}`);
      if (currentState.currentPlayer === 'Gote' && currentState.aiLevel) {
        setTimeout(() => {
          const aiMove = currentState.aiLevel === 'Easy' ? 
            easyAILogic(currentState) : 
            hardAILogic(currentState, 'Gote', 3);
          if (aiMove) movePiece(aiMove);
          else openModal(`Игра окончена!\nХодов не осталось!\nПобедитель: 'Сэнтэ ↑'`);
        }, 1000);
      }
    }
  }

  return (
    <div key={`${row}-${col}`}
         id={`${row}-${col}`}
         onClick={onClick}
         className={`
           w-20 h-20 flex items-center justify-center 
           ${selectedPiece && 
             selectedPiece.row === row && 
             selectedPiece.col === col ? 'bg-red-500' 
             : isHighlighted ? 'bg-green-500' : 'bg-orange-200'}
           ${isCheck ? 'king-in-check' : ''}
           border-2 border-orange-900
         `}>
      {piece}
      {isCheck && <div className="absolute inset-0 border-2 border-red-500 rounded-sm pointer-events-none" />} 
    </div>
  );
});
