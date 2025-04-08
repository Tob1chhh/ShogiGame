import { useUnit } from "effector-react";
import { Board } from "./components/Board/Board";
import { MainScreen } from "./components/Screens/MainScreen";
import { ModeSelectionScreen } from "./components/Screens/ModeSelectionScreen";
import { mainStateScreen } from "./store/screens";

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
