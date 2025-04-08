import { useUnit } from "effector-react";
import { Board } from "./components/Board";
import { MainScreen } from "./components/MainScreen";
import { ModeSelectionScreen } from "./components/ModeSelectionScreen";
import { mainStateScreen } from "./store/mainStore";

const App = () => {
  const currentScreen = useUnit(mainStateScreen);

  return (
    <div className="flex justify-center items-center h-screen">
      { currentScreen === "startScreen" && <MainScreen /> }
      { currentScreen === "modeSelectScreen" && <ModeSelectionScreen /> }
      { currentScreen === "gameScreen" && <Board /> }
    </div>
  );
}

export default App;
