import { useUnit } from "effector-react";
import { MainScreen } from "./components/Screens/MainScreen";
import { ModeSelectionScreen } from "./components/Screens/ModeSelectionScreen";
import { mainStateScreen } from "./store/screens";
import { MainGame } from "./components/Screens/MainGame";

const App = () => {
  const currentScreen = useUnit(mainStateScreen);

  return (
    <div className="flex justify-center items-center h-screen">
      { currentScreen === "startScreen" && <MainScreen /> }
      { currentScreen === "modeSelectScreen" && <ModeSelectionScreen /> }
      { currentScreen === "gameScreen" && <MainGame /> }
    </div>
  );
}

export default App;
