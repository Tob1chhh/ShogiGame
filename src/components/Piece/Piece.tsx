import { pieces } from '../../models/pieces';
import { Piece } from '../../store/game.types';

const getPieceIcon = (type: string, color: string, promoted: boolean) => 
  promoted ? pieces[color + '_' + type + '_Reverse'] : pieces[color + '_' + type];



export const GamePiece = ({ type, color, promoted, onClick }: Piece) => {
  return (
    <button className="w-full h-full flex 
                        items-center justify-center 
                        text-2xl transition-transform 
                        duration-200 hover:scale-110"
            onClick={onClick}
    >
      { <img src={`${getPieceIcon(type, color, promoted)}`} alt="#" className="w-14 h-14" /> }
    </button>
  );
};