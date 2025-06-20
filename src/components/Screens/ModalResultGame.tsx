import React from 'react';
import { useUnit } from 'effector-react';
import { $resultGameModal, closeModal, resetGame } from '../../store/game';
import { switchMainStateScreen } from '../../store/screens';

export const ModalResultGame = () => {
  const {isOpen, resultString} = useUnit($resultGameModal);

  const lines = resultString ? resultString.split('\n').map((line, i) => (
    <React.Fragment key={i}>
      {line}
      <br />
    </React.Fragment>
  )) : '';

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div 
        className="absolute inset-0 bg-black bg-opacity-60"
        onClick={() => {
          resetGame();
          switchMainStateScreen('startScreen');
          closeModal();
        }}
      />
      <div className="relative z-10 bg-white rounded-lg p-6 shadow-xl max-w-sm w-full mx-4 border-4 border-orange-900">
        <div className="flex justify-center items-center">
          <span className="text-center text-2xl font-medium mb-4">{lines}</span>
        </div>
        
        <div className="flex justify-center space-x-4">
          <button
            onClick={() => {
              resetGame();
              switchMainStateScreen('startScreen'); 
              closeModal();
            }}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
          >
            Ок
          </button>
        </div>
      </div>
    </div>
  );
};