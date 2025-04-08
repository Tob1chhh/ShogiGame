import { switchMainStateScreen } from '../store/mainStore';

export const MainScreen = () => {
  return (
    <div className="flex justify-center items-center h-screen w-2/4">
      <div className="w-[80%] max-w-4xl p-12 bg-orange-100 border-8 border-orange-900 rounded-3xl shadow-2xl">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-orange-900 mb-16">Японские шахматы с новыми режимами</h1>
          
          <div className="flex justify-center gap-24">
            <button
              onClick={() => switchMainStateScreen('modeSelectScreen')}
              className="relative group px-8 py-4 
                          w-80 h-20
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
                          w-80 h-20
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
