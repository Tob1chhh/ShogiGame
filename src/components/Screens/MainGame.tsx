import { useUnit } from "effector-react";
import { $capturedPieces, $currentPlayer, $movesForPoints, openLearningModal, resetGame, selectCapturedPiece } from "../../store/game";
import { switchMainStateScreen } from "../../store/screens";
import { Board } from "../Board/Board";
import { GamePiece } from "../Piece/Piece";
import { ModalPromote } from "./ModalPromote";
import { ModalResultGame } from "./ModalResultGame";
import { ModalLearning } from "./ModalLearning";

export const MainGame = () => {
  const currentPlayer = useUnit($currentPlayer);
  const capturedPieces = useUnit($capturedPieces);
  const movesForPoints = useUnit($movesForPoints);

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
        <Board />
        {/* Правая панель с кнопками */}
        <div className="flex justify-center items-center h-screen flex-col gap-8">
          <div className="w-[90%] max-w-4xl pl-2 pr-2 pt-8 pb-8 bg-orange-100 border-4 border-orange-900 rounded-3xl shadow-2xl">
            <div className="flex justify-center items-center w-full h-full flex-col">
              {movesForPoints && <span className="text-center font-bold text-2xl mb-6">Ходов осталось: {movesForPoints}</span>}
              <span className="text-center font-bold text-2xl">Ход игрока: {currentPlayer === 'Sente' ? 'Сэнтэ ↑' : 'Готэ ↓'}</span>
            </div>
          </div>
          <div className="w-[90%] max-w-4xl p-12 bg-orange-100 border-4 border-orange-900 rounded-3xl shadow-2xl">
            <div className="flex flex-col justify-center items-center gap-8">
              <button className="w-56 h-12 bg-green-600 text-white font-bold rounded-md shadow-md 
                                hover:bg-green-700 transition duration-300"
                      onClick={() => openLearningModal()}
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
      <ModalLearning />
    </div>
  );
}