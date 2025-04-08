import { pieces } from '../models/pieces';

interface PieceProps {
  type: string;
  position: { row: number; col: number };
  onClick: () => void;
}

const getPieceIcon = (type: string) => {
  return pieces[type] || '';
}

export const Piece = ({ type, position, onClick }: PieceProps) => {
  return (
    <button className="w-full h-full flex 
                        items-center justify-center 
                        text-2xl transition-transform 
                        duration-200 hover:scale-110"
            onClick={onClick}
    >
      {getPieceIcon(type) !== '' ? <img src={`${getPieceIcon(type)}`} alt="#" className="w-14 h-14" /> : ''}
    </button>
  );
};