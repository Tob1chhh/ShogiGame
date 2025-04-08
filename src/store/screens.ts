import { createStore, createEvent } from 'effector';

export const mainStateScreen = createStore<string>("startScreen");
export const switchMainStateScreen = createEvent<string>();
mainStateScreen.on(switchMainStateScreen, (_, newState) => newState);