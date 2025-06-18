import { pieces } from '../../models/pieces';
import { Piece, PieceType } from '../../store/game.types';

export const getPieceIcon = (
  type: PieceType, 
  color: string, 
  promoted: boolean
) => promoted ? pieces[color + '_' + type + '_Reverse'] : pieces[color + '_' + type];

const ruPieceName = (type: PieceType, promoted: boolean): string => {
  if (type === 'Pawn') return promoted ? 'Токин' : 'Пешка';
  if (type === 'Lance') return promoted ? 'Перевернутое копье' : 'Копье';
  if (type === 'Horse_Knight') return promoted ? 'Перевернутый конь' : 'Конь';
  if (type === 'Silver') return promoted ? 'Перевернутое серебро' : 'Серебряный генерал';
  if (type === 'Gold') return 'Золотой генерал';
  if (type === 'King') return 'Король';
  if (type === 'Rook') return promoted ? 'Дракон' : 'Ладья';
  if (type === 'Bishop') return promoted ? 'Лошадь' : 'Слон';
  if (type === 'Tengu') return promoted ? 'Перевернутый тенгу' : 'Тенгу';
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
      { <img src={`${getPieceIcon(type, color, promoted)}`} 
             alt="#" title={ruPieceName(type, promoted)} 
             className="w-14 h-14" /> }
    </button>
  );
};