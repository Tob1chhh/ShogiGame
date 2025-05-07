import { pieces } from '../../models/pieces';
import { Piece, PieceType } from '../../store/game.types';

const getPieceIcon = (
  type: PieceType, 
  color: string, 
  promoted: boolean
) => promoted ? pieces[color + '_' + type + '_Reverse'] : pieces[color + '_' + type];

const ruPieceName = (type: PieceType): string => {
  if (type === 'Pawn') return 'Пешка';
  if (type === 'Lance') return 'Копье';
  if (type === 'Horse_Knight') return 'Конь';
  if (type === 'Silver') return 'Серебряный генерал';
  if (type === 'Gold') return 'Золотой генерал';
  if (type === 'King') return 'Король';
  if (type === 'Rook') return 'Ладья';
  if (type === 'Bishop') return 'Слон';
  return '';
}

export const GamePiece = ({ type, color, promoted, onClick }: Piece) => {
  return (
    <button className="w-full h-full flex 
                        items-center justify-center 
                        text-2xl transition-transform 
                        duration-200 hover:scale-110"
            onClick={onClick}
    >
      { <img src={`${getPieceIcon(type, color, promoted)}`} alt="#" title={ruPieceName(type)} className="w-14 h-14" /> }
    </button>
  );
};