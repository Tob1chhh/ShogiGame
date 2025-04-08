import { pieces } from '../../models/pieces';
import { Piece } from '../../store/game.types';

const getPieceIcon = (type: string) => pieces[type] || '';


export const GamePiece = ({ type, onClick }: Piece) => {
  return (
    <button className="w-full h-full flex 
                        items-center justify-center 
                        text-2xl transition-transform 
                        duration-200 hover:scale-110"
            onClick={onClick}
    >
      {
        getPieceIcon(type) !== '' 
          ? <img src={`${getPieceIcon(type)}`} alt="#" className="w-14 h-14" /> 
          : ''
      }
    </button>
  );
};