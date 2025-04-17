import React from 'react';
import { useUnit } from 'effector-react';
import { $availableMoves, $board, $currentPlayer, $gameState, $selectedPiece, movePiece } from '../../store/game';
import { switchMainStateScreen } from '../../store/screens';
import { selectPiece } from '../../store/game';
import { CellProps, Move } from '../../store/game.types';
import { promptPromotion, shouldPromote } from '../../services/calculateMoves';
import { GamePiece } from '../Piece/Piece';
import { ModalPromote } from '../Screens/ModalPromote';

export const Board = () => {
  const board = useUnit($board);
  const availableMoves = useUnit($availableMoves);
  const currentPlayer = useUnit($currentPlayer);

  // const game = useUnit($gameState);
  // console.log(game);

  const Cell = React.memo(({ row, col, isHighlighted, piece }: CellProps) => {
    const selectedPiece = useUnit($selectedPiece);
  
    const onClick = async () => {
      if (isHighlighted && selectedPiece) {
        const newMove: Move = {
          from: { row: selectedPiece.row, col: selectedPiece.col },
          to: { row: row, col: col },
          selectedPiece: board[selectedPiece.row][selectedPiece.col],
        }
        if (shouldPromote(board[newMove.from.row][newMove.from.col], { row: newMove.to.row, col: newMove.to.col })) {
          const shouldPromote = await promptPromotion();
          if (shouldPromote) {
            newMove.promotes = shouldPromote;
          }
        }
        movePiece(newMove);
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
              border-2 border-orange-900
            `}>
        {piece}
      </div>
    );
  });

  return (
    <div className="flex justify-center items-center h-screen gap-16">

      {/* Левая панель с руками игроков */}
      <div className="flex flex-col justify-between h-[540px]">
        <div className="w-60 h-32 bg-white border-2 border-gray-400 rounded-md flex items-center justify-center shadow-md">
          <span className="text-gray-500">Рука игрока 1</span>
        </div>
        <div className="w-60 h-32 bg-white border-2 border-gray-400 rounded-md flex items-center justify-center shadow-md">
          <span className="text-gray-500">Рука игрока 2</span>
        </div>
      </div>

      {/* Игровая доска */}
      <div className="grid grid-cols-9 border-2 border-orange-900">
        {board.map((row, rowIndex) => 
          row.map((piece, colIndex) => (
            <Cell row={piece ? piece.position.row : rowIndex}
                  col={piece ? piece.position.col : colIndex}
                  isHighlighted={availableMoves.some(m => m.row === rowIndex && m.col === colIndex)}
                  piece={
                    piece === null ? null
                    : <GamePiece
                        type={piece.type}
                        color={piece.color}
                        position={piece.position}
                        promoted={piece.promoted}
                        onClick={() => {
                          if (piece.color === currentPlayer) selectPiece(piece);
                        }}
                    />
                  }>
            </Cell>
          ))
        )}
      </div>

      {/* Правая панель с кнопками */}
      <div className="flex justify-center items-center h-screen">
        <div className="w-[90%] max-w-4xl p-12 bg-orange-100 border-8 border-orange-900 rounded-3xl shadow-2xl">
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
                    onClick={() => switchMainStateScreen('startScreen')}
            >
              Главное меню
            </button>
          </div>
        </div>
      </div>
      <ModalPromote />
    </div>
  );
};
