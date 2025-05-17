import { switchMainStateScreen } from '../../store/screens';

export const MainScreen = () => {
  return (
    <div className="flex justify-center items-center h-screen w-2/4 min-w-[45rem] max-w-[55rem]">
      <div className="w-full p-12 bg-orange-100 border-8 border-orange-900 rounded-3xl shadow-2xl">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-orange-900 mb-16">Японские шахматы<br/> с новыми режимами</h1>
          
          <div className="flex justify-center gap-24">
            <button
              onClick={() => switchMainStateScreen('modeSelectScreen')}
              className="relative group px-8 py-4 
                         w-60 h-20 max-w-64
                         text-3xl font-semibold text-white 
                         bg-orange-600 rounded-lg shadow-lg 
                         transition duration-300 
                         overflow-hidden hover:bg-orange-700"
            >
              <span className="absolute inset-0 bg-orange-800 scale-0 group-hover:scale-100 transition-transform duration-300"></span>
              <span className="relative">Начать игру</span>
            </button>

            <button
              onClick={() => console.log('Обучение')}
              className="relative group px-8 py-4 
                         w-60 h-20 max-w-64
                         text-3xl font-semibold text-white 
                         bg-orange-600 rounded-lg shadow-lg 
                         transition duration-300 
                         overflow-hidden hover:bg-orange-700"
            >
              <span className="absolute inset-0 bg-orange-800 scale-0 group-hover:scale-100 transition-transform duration-300"></span>
              <span className="relative">Обучение</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
