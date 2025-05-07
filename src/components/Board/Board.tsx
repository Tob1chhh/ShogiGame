import React, { useEffect } from 'react';
import { useUnit } from 'effector-react';
import { 
  $availableMoves, $board, 
  $capturedPieces, $checkState, 
  $currentPlayer, $gameState, $selectedHandPiece, 
  $selectedPiece, movePiece, 
  openModal, 
  resetGame, 
  selectCapturedPiece, selectNullCell
} from '../../store/game';
import { switchMainStateScreen } from '../../store/screens';
import { selectPiece } from '../../store/game';
import { CellProps, Move } from '../../store/game.types';
import { promptPromotion, shouldPromote } from '../../services/calculateMoves';
import { GamePiece } from '../Piece/Piece';
import { ModalPromote } from '../Screens/ModalPromote';
import { ModalResultGame } from '../Screens/ModalResultGame';

export const Board = () => {
  const game = useUnit($gameState);
  const board = useUnit($board);
  const availableMoves = useUnit($availableMoves);
  const currentPlayer = useUnit($currentPlayer);
  const capturedPieces = useUnit($capturedPieces);
  const checkState = useUnit($checkState);

  console.log(game);

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
    <div className="flex justify-center items-center h-screen gap-16">

      {/* Левая панель с руками игроков */}
      <div className="flex flex-col justify-between h-[540px]">
        <div className="flex flex-col justify-center items-center">
          <span className="hand_players__title">Рука игрока 'Готэ'</span>
          <div className="w-80 h-48 bg-white border-2 border-gray-400 rounded-md flex items-center justify-center shadow-md player_hand">
            {capturedPieces.Gote.map((piece) => (
              <GamePiece type={piece.type}
                        color={piece.color}
                        position={piece.position}
                        promoted={piece.promoted}
                        onClick={() => { if (piece.color === currentPlayer) selectCapturedPiece(piece) }}
              />
            ))}
          </div>
        </div>
        <div className="flex flex-col justify-center items-center">
          <span className="hand_players__title">Рука игрока 'Сэнтэ'</span>
          <div className="w-80 h-48 bg-white border-2 border-gray-400 rounded-md flex items-center justify-center shadow-md player_hand">
            {capturedPieces.Sente.map((piece) => (
              <GamePiece type={piece.type}
                        color={piece.color}
                        position={piece.position}
                        promoted={piece.promoted}
                        onClick={() => { if (piece.color === currentPlayer) selectCapturedPiece(piece) }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Игровая доска */}
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
          )})
        )}
      </div>

      {/* Правая панель с кнопками */}
      <div className="flex justify-center items-center h-screen flex-col gap-8">
        <div className="w-[90%] max-w-4xl pl-2 pr-2 pt-8 pb-8 bg-orange-100 border-4 border-orange-900 rounded-3xl shadow-2xl">
          <div className="flex justify-center items-center w-full h-full">
            <span className="text-center font-bold text-2xl">Ход игрока: {currentPlayer === 'Sente' ? 'Сэнтэ ↑' : 'Готэ ↓'}</span>
          </div>
        </div>
        <div className="w-[90%] max-w-4xl p-12 bg-orange-100 border-4 border-orange-900 rounded-3xl shadow-2xl">
          <div className="flex flex-col justify-center items-center gap-8">
            <button className="w-56 h-12 bg-green-600 text-white font-bold rounded-md shadow-md 
                              hover:bg-green-700 transition duration-300"
            >
              Сохранить
            </button>
            <button className="w-56 h-12 bg-green-600 text-white font-bold rounded-md shadow-md 
                              hover:bg-green-700 transition duration-300"
            >
              Загрузить
            </button>
            <button className="w-56 h-12 bg-green-600 text-white font-bold rounded-md shadow-md 
                              hover:bg-green-700 transition duration-300"
            >
              Обучение
            </button>
            <button className="w-56 h-12 bg-green-600 text-white font-bold rounded-md shadow-md 
                              hover:bg-green-700 transition duration-300"
                    onClick={() => {
                      resetGame();
                      switchMainStateScreen('startScreen');
                    }}
            >
              Главное меню
            </button>
          </div>
        </div>
      </div>
      <ModalPromote />
      <ModalResultGame />
    </div>
  );
};

const Cell = React.memo(({ row, col, isHighlighted, isCheck, piece }: CellProps) => {
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
          selectedPiece: board[selectedPiece.row][selectedPiece.col],
        }
        if ((newMove.selectedPiece?.type === 'Pawn' 
              || newMove.selectedPiece?.type === 'Lance' 
              || newMove.selectedPiece?.type === 'Horse_Knight') 
            && (row === 8 || row === 0)) newMove.promotes = true;
        else if (shouldPromote(board[newMove.from.row][newMove.from.col], { row: newMove.to.row, col: newMove.to.col })) {
          const shouldPromote = await promptPromotion();
          if (shouldPromote) newMove.promotes = shouldPromote;
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
