import { useState } from 'react';
import { useUnit } from 'effector-react';
import { $board, selectPiece, switchMainStateScreen } from '../store/mainStore';
import { Piece } from './Piece';

const recolorSelectedPlace = (
  rowIndex: number, 
  colIndex: number, 
  selectedCell: { row: number, col: number } | null
) => {
  if (selectedCell) {
    const prevCell = document.getElementById(`${selectedCell.row}-${selectedCell.col}`);
    if (prevCell) prevCell.style.backgroundColor = '#F6D7B0';
  }
  const cell = document.getElementById(`${rowIndex}-${colIndex}`);
  if (cell) cell.style.backgroundColor = '#FF0000';
};

export const Board = () => {
  const board = useUnit($board);
  const [selectedCell, setSelectedCell] = useState<{ row: number, col: number } | null>(null);

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
          row.map((cell, colIndex) => (
            <div
              key={`${rowIndex}-${colIndex}`}
              id={`${rowIndex}-${colIndex}`}
              className={`
                w-20 h-20 
                flex items-center justify-center 
                bg-orange-200 border-2 border-orange-900
              `}
            >
              <Piece
                type={cell}
                position={{ row: rowIndex, col: colIndex }}
                onClick={() => {
                  selectPiece( { row: rowIndex, col: colIndex} );
                  recolorSelectedPlace(rowIndex, colIndex, selectedCell);
                  setSelectedCell({ row: rowIndex, col: colIndex });
                }}
              />
            </div>
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

    </div>
  );
};
