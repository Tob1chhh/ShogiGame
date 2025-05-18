import { useUnit } from 'effector-react';
import { $learningModal, closeLearningModal } from '../../store/game';
import { getPieceIcon } from '../Piece/Piece';
import { PieceRules } from '../../store/game.types';
import { Fade } from 'react-awesome-reveal';

const piecesRules: PieceRules[] = [
  {
    name: 'Пешка',
    image: getPieceIcon('Pawn', 'Sente', false)!,
    promoteName: 'Перевернутая пешка (токин)',
    promoteImage: getPieceIcon('Pawn', 'Sente', true)!,
    movesGif: '/gifs/ShogiGame-Pawn.gif',
  },
  {
    name: 'Копье',
    image: getPieceIcon('Lance', 'Sente', false)!,
    promoteName: 'Перевернутое копье',
    promoteImage: getPieceIcon('Lance', 'Sente', true)!,
    movesGif: '/gifs/ShogiGame-Lance.gif',
  },
  {
    name: 'Конь',
    image: getPieceIcon('Horse_Knight', 'Sente', false)!,
    promoteName: 'Перевернутый конь',
    promoteImage: getPieceIcon('Horse_Knight', 'Sente', true)!,
    movesGif: '/gifs/ShogiGame-Horse_Knight.gif',
  },
  {
    name: 'Серебряный генерал',
    image: getPieceIcon('Silver', 'Sente', false)!,
    promoteName: 'Перевернутое серебро',
    promoteImage: getPieceIcon('Silver', 'Sente', true)!,
    movesGif: '/gifs/ShogiGame-Silver.gif',
  },
  {
    name: 'Золотой генерал',
    movesGif: '/gifs/ShogiGame-Gold.gif',
    image: getPieceIcon('Gold', 'Sente', false)!,
  },
  {
    name: 'Король',
    movesGif: '/gifs/ShogiGame-King.gif',
    image: getPieceIcon('King', 'Sente', false)!,
  },
  {
    name: 'Ладья',
    promoteName: 'Перевернутая ладья (дракон)',
    movesGif: '/gifs/ShogiGame-Rook.gif',
    promoteImage: getPieceIcon('Rook', 'Sente', true)!,
    image: getPieceIcon('Rook', 'Sente', false)!,
  },
  {
    name: 'Слон',
    promoteName: 'Перевернутый слон (лошадь)',
    movesGif: '/gifs/ShogiGame-Bishop.gif',
    promoteImage: getPieceIcon('Bishop', 'Sente', true)!,
    image: getPieceIcon('Bishop', 'Sente', false)!,
  },
];

export const ModalLearning = () => {
  const isOpen = useUnit($learningModal);

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div 
        className="absolute inset-0 bg-black bg-opacity-60"
        onClick={() => closeLearningModal()}
      />
      <div className="relative z-10 bg-white rounded-lg 
                      p-6 shadow-xl max-h-[80vh] overflow-y-auto scroll-smooth
                      max-w-5xl w-full mx-4 border-4 border-orange-900">
        <h2 className="text-center text-2xl font-medium mb-4">Правила игры "Японские шахматы с новыми режимами"</h2>

        <section className="mb-6 px-6">
          <Fade triggerOnce duration={1000} delay={200}>
            <h3 className="text-center text-xl font-medium mb-2">Основы игры</h3>
          </Fade>

          {/* Доска */}
          <Fade triggerOnce duration={1000} delay={200}>
            <h4 className="text-lg font-medium mb-3">Доска</h4>
            <p className="mb-5"><b>Доска для сёги</b> (яп. - <i>сёгибан</i>) — деревянный прямоугольный параллелепипед с нанесённой на его верхнюю грань разметкой: сеткой из прямоугольных клеток (полей) 9×9. Все поля — одного цвета.</p>
          </Fade>

          {/* Фигуры */}
          <Fade triggerOnce duration={1000} delay={200}>
            <h4 className="text-lg font-medium mb-3">Фигуры</h4>
            <p className="mb-5">Каждый игрок в начале партии имеет по 20 фигур: 1 король, 1 ладья, 1 слон, 2 золотых и 2 серебряных генерала, 2 коня, 2 копья и 9 пешек. Фигуры имеют форму вытянутого пятиугольника со скосом в сторону противника, на обеих поверхностях которого иероглифами надписано название основной и превращённой фигуры. Фигуры обеих сторон не различаются по цвету, а их принадлежность определяется направлением: фигуры расположены остриём к противнику.</p>
          </Fade>

          {/* Передвижение фигур */}
          <Fade triggerOnce duration={1000} delay={200}>
            <h4 className="text-lg font-medium mb-3">Передвижение фигур</h4>
          </Fade>

          <div className="flex flex-wrap gap-y-4 mb-2">
            {piecesRules.map((piece) => (
              <div className="w-1/2">
                <Fade triggerOnce fraction={0.5} duration={1000} delay={300}>
                  <p className="font-medium mb-2">{piece.name} (пример хода, фигура):</p>
                  <div className="flex items-center gap-4 mb-2">
                    <img 
                      src={piece.movesGif}
                      alt="Ход" title="Ход"
                      className="w-full max-w-40 border-black border-2 rounded-lg p-1"
                    />
                    <img 
                      src={piece.image}
                      alt={piece.name} title={piece.name}
                      className="w-full max-w-20 border-black border-2 rounded-lg p-1"
                    />
                  </div>
                </Fade>
              </div>
            ))}
          </div>
          <Fade triggerOnce duration={1000} delay={300}>
            <p className="text-sm mb-2 italic"><sup>*</sup> При наведении на картинку (gif) отобразится информация</p>
          </Fade>
          <Fade triggerOnce fraction={0.3} duration={1000} delay={300}>
            <p className="mb-5">
              Ходы делаются по очереди. Ход в сёги может быть одного из двух видов: обычный (<i>ход на доске</i>) и <i>сброс</i>.<br/>
              
              <i><b>Ход на доске</b></i> — это перемещение своей фигуры с одного поля на другое поле в соответствии с правилами хода данной фигуры. Если ход на доске делается на поле, занятое фигурой противника, эта фигура берётся — снимается с доски и переходит в резерв («руку») к взявшему её игроку.<br/><br/>

              <i><b>Сброс</b></i> — это выставление на доску одной из фигур, имеющейся в руке (в резерве) игрока. Сброшенная фигура ставится основной стороной вверх, остриём в сторону противника и далее играет на стороне сбросившего. Сброс является отдельным ходом: за один ход игрок может или сбросить фигуру, или сделать ход фигурой на доске. В данной игре два столика для фигур (яп. - <i>комадай</i>) располагается слева от игрока.<br/>

              Разрешён сброс на любое пустое поле доски любой фигуры из руки, за следующими <i>исключениями</i>:

              <ol className="mt-2 pl-6 list-decimal">
                <li>Правило <i>нифу</i> (яп. - <i>«две пешки»</i>): запрещено сбрасывать пешку на вертикаль, на которой уже стоит неперевёрнутая (непревращённая) пешка того же игрока.</li>
                <li>Правило <i>утифудзумэ</i>: запрещено ставить мат сбросом пешки.</li>
                <li>Запрещено выставлять фигуру на поле, на котором она не будет иметь возможности хода по правилам (то есть пешку или копье на последнюю горизонталь, коня на две последние горизонтали).</li>
                <li>Сбрасывать фигуры можно только в неперевёрнутом (непревращённом) виде.</li>
              </ol>
            </p>
          </Fade>

          {/* Переворот (превращение) фигур */}
          <Fade triggerOnce duration={1000} delay={300}>
            <h4 className="text-lg font-medium mb-3">Переворот (превращение) фигур</h4>
          </Fade>
          <Fade triggerOnce duration={1000} delay={300}>
            <p className="mb-4">
              Три последние горизонтали доски (относительно каждого из игроков) являются так называемой <i>зоной переворота</i> (также вместо слова <i>(не)переворот</i> часто используется термин <i>(не)превращение</i>). Фигура, делающая ход в эту зону, ход внутри зоны или из неё, может быть перевёрнута. Переворот не является отдельным ходом, а происходит в процессе хода фигуры на доске. При превращении фигура переворачивается на другую сторону, где изображён знак превращённой фигуры, поэтому, в отличие от шахмат, фигура, в которую происходит превращение, определена правилами:
              
              <ol className="mt-2 pl-6 list-decimal">
                <li><b>Король и золотой генерал</b> — не превращаются.</li>
                <li><b>Пешка, копье, конь и серебряный генерал</b> (эти фигуры называются <i>лёгкими</i>) — превращаются в фигуры, которые ходят, как золото. Чтобы не путать эти перевёрнутые фигуры, они имеют собственные названия и изображаются разными иероглифами. В данной игре изображения на обратной стороне фигур делаются другим цветом.</li>
                <li><b>Ладья</b> — превращается в дракона, который ходит и как ладья, и как король.</li>
                <li><b>Слон</b> — превращается в лошадиного дракона, который ходит и как слон, и как король.</li>
              </ol>
            </p>
          </Fade>
          <div className="flex flex-row items-center gap-4 mb-1">
            {piecesRules.map((piece) => piece.promoteName && ( 
              <Fade direction="down" triggerOnce duration={1000} delay={300}>
                <img 
                  src={piece.promoteImage}
                  alt={piece.promoteName} 
                  title={piece.promoteName}
                  className="w-full max-w-20 border-black border-2 rounded-lg p-1"
                />
              </Fade>
            ))}
          </div>
          <Fade triggerOnce duration={1000} delay={300}>
            <p className="text-sm mb-4 italic"><sup>*</sup> При наведении на картинку отобразится название фигуры</p>
          </Fade>
          <Fade triggerOnce duration={1000} delay={300}>
            <p className="mb-5">
              Превращение фигуры обязательно, если после хода не перевёрнутая фигура не имела бы возможности более ходить по правилам; в противном случае игрок может выбирать между ходом с превращением и ходом без превращения. Например, когда игрок ходит пешкой на седьмую или восьмую горизонталь, он <i><b>может</b></i>, по желанию, перевернуть её или оставить в прежнем положении, но при ходе на последнюю горизонталь пешка <i><b>должна быть</b></i> превращена, так как непревращённая пешка на девятой горизонтали не имеет хода. Аналогично, конь <i><b>может</b></i> быть превращён при ходе на седьмую горизонталь, и <i><b>должен быть</b></i> превращён при ходе на восьмую или девятую.<br/><br/>

              Фигура остаётся превращённой, пока не будет снята с доски. Если превращённая фигура захватывается, то игрок может сбросить её только как обычную. Переворот при сбросе невозможен, независимо от того, на какое поле выставляется фигура. Превратить сброшенную фигуру разрешается не ранее следующего хода, поэтому сбрасывать фигуру на поле, с которого она не будет иметь хода по правилам, нельзя.
            </p>
          </Fade>

          {/* Переворот (превращение) фигур */}
          <Fade triggerOnce duration={1000} delay={300}>
            <h4 className="text-lg font-medium mb-3">Итог игры</h4>
          </Fade>
          <Fade triggerOnce duration={1000} delay={300}>
            <p className="mb-5">
              Игра заканчивается, когда одна из сторон ставит «мат» королю противника, то есть создаёт позицию, в которой король противника находится под боем («шахом») и этот шах противник не может устранить никаким ходом. Поставивший мат выигрывает.<br/><br/>

              Кроме того, в данной игре имеются правила, ограничивающие возможность затягивания партии:
              <ol className="mt-2 pl-6 list-decimal">
                <li>В случае четырёхкратного повторения одной и той же позиции — <i>сэннититэ</i> (яп. - <i>«ходы тысячу дней»</i>) партия завершается ничьёй.</li>
                <li>В случае, если у каждого игрока остался только король или король и 1 лёгкая фигура, то партия завершается ничьёй.</li>
              </ol>
            </p>
          </Fade>
        </section>
      </div>
    </div>
  );
};