import { useState } from 'react';
import { switchMainStateScreen } from '../../store/screens';
import { changeGameMode, setAILevel } from '../../store/game';
import { GameMode } from '../../store/game.types';

export const ModeSelectionScreen = () => {
  const [selectedMode, setSelectedMode] = useState<GameMode>('Classic');
  const [isAI, setIsAI] = useState(false);
  const [aiLvl, setAiLvl] = useState<'Hard' | 'Easy'>('Easy');
  
  const modes: GameMode[] = ['Classic', 'Points', 'Limits', 'NewFigure'];

  return (
    <div className="flex justify-center items-center h-screen w-2/4">
      <div className="w-[80%] max-w-4xl p-12 bg-orange-100 border-8 border-orange-900 rounded-3xl shadow-2xl">
        <div className="flex flex-col items-center justify-center">
          <h1 className="text-4xl font-bold text-orange-900 mb-8">Выбор режима игры</h1>

          {/* Режимы игры */}
          <div className="grid grid-cols-2 gap-6 mb-8">
            {modes.map((mode) => (
              <button
                key={mode}
                className={`px-6 py-4 text-lg font-semibold border-2 rounded-lg transition 
                            ${selectedMode === mode ? 'bg-orange-600 text-white' : 'bg-white text-orange-900'} 
                            hover:bg-orange-500 hover:text-white`}
                onClick={() => {
                  setSelectedMode(mode);
                  changeGameMode(mode);
                }}
              >
                {mode === 'Classic' ? 'Классическая игра' : 
                 mode === 'Points' ? 'Игра на набор очков' :
                 mode === 'Limits' ? 'Игра с ограничениями' : 'Игра с новой фигурой'}
              </button>
            ))}
          </div>

          {/* Выбор противника */}
          <div className="flex gap-8 mb-8">
            <button
              className={`w-40 px-8 py-4 text-lg font-semibold border-2 rounded-lg transition
                          ${isAI ? 'bg-orange-600 text-white' : 'bg-white text-orange-900'} 
                          hover:bg-orange-500 hover:text-white`}
              onClick={() => {
                setIsAI(true);
                setAiLvl('Easy');
                setAILevel('Easy');
              }}
            >
              Игра с ИИ
            </button>
            
            <button
              className={`w-40 px-8 py-4 text-lg font-semibold border-2 rounded-lg transition
                          ${!isAI ? 'bg-orange-600 text-white' : 'bg-white text-orange-900'} 
                          hover:bg-orange-500 hover:text-white`}
              onClick={() => {
                setIsAI(false);
                setAiLvl('Easy');
                setAILevel(null); // Сброс уровня ИИ
              }}
            >
              Игра на 2 игроков
            </button>
          </div>

          {/* Выбор уровня ИИ (отображается только при игре с ИИ) */}
          {isAI && (
            <div className="flex gap-8 mb-8">
              <button
                className={`w-36 px-6 py-3 text-lg font-semibold border-2 rounded-lg transition 
                            ${aiLvl === 'Easy' ? 'bg-orange-600 text-white' : 'bg-white text-orange-900'} 
                            hover:bg-orange-500 hover:text-white`}
                onClick={() => {
                  setAiLvl('Easy');
                  setAILevel('Easy');
                }}
              >
                Легкий
              </button>
              
              <button
                className={`w-36 px-6 py-3 text-lg font-semibold border-2 rounded-lg transition 
                            ${aiLvl === 'Hard' ? 'bg-orange-600 text-white' : 'bg-white text-orange-900'} 
                            hover:bg-orange-500 hover:text-white`}
                onClick={() => {
                  setAiLvl('Hard');
                  setAILevel('Hard');
                }}
              >
                Сложный
              </button>
            </div>
          )}

          {/* Кнопки "Начать игру" и "Назад" */}
          <div className="flex justify-center items-center">
            <button
              className="w-48 px-10 py-4 mr-4 bg-green-600 
                      text-white text-lg font-bold 
                        rounded-lg shadow-lg transition
                      hover:bg-green-700"
              onClick={() => switchMainStateScreen('startScreen')}
            >
              Назад
            </button>
            <div className="w-6"></div>
            <button
              className="w-48 px-10 py-4 ml-4 bg-green-600 
                      text-white text-lg font-bold 
                        rounded-lg shadow-lg transition
                      hover:bg-green-700"
              onClick={() => switchMainStateScreen('gameScreen')}
            >
              Начать игру
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
