import { pieces } from '../../models/pieces';
import { Piece } from '../../store/game.types';

const getPieceIcon = (type: string, color: string) => pieces[color + '_' + type] || '';

export const GamePiece = ({ type, color, onClick }: Piece) => {
  return (
    <button className="w-full h-full flex 
                        items-center justify-center 
                        text-2xl transition-transform 
                        duration-200 hover:scale-110"
            onClick={onClick}
    >
      {
        getPieceIcon(type, color) !== '' 
          ? <img src={`${getPieceIcon(type, color)}`} alt="#" className="w-14 h-14" /> 
          : ''
      }
    </button>
  );
};