import { useUnit } from 'effector-react';
import { $promotionModal, promotionAnswer } from '../../store/game';

export const ModalPromote = () => {
  const {isOpen} = useUnit($promotionModal);

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div 
        className="absolute inset-0 bg-black bg-opacity-60"
        onClick={() => promotionAnswer(false)}
      />
      <div className="relative z-10 bg-white rounded-lg p-6 shadow-xl max-w-sm w-full mx-4 border-4 border-orange-900">
        <h3 className="text-center text-lg font-medium mb-4">Желаете превратить фигуру?</h3>
        
        <div className="flex justify-center space-x-4">
          <button
            onClick={() => promotionAnswer(true)}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
          >
            Да
          </button>
          <button
            onClick={() => promotionAnswer(false)}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 transition"
          >
            Нет
          </button>
        </div>
      </div>
    </div>
  );
};