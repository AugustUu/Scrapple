import { Engine, Color, DisplayMode, Actor, CollisionType, Scene,  } from 'excalibur';
import { GameState, StateSystem } from './util/StateSystem';
import { MainMenu } from './ui/MainMenu';
import { World } from './world/world';


StateSystem.changeState(GameState.loading);

export const engine = new Engine({
    backgroundColor: Color.fromHex('#5fcde4'),
    fixedUpdateFps: 60,
    width: 1920,
    height: 1080,
    displayMode: DisplayMode.FitScreenAndFill
});


engine.start();
engine.toggleDebug();

MainMenu.init();
World.init();

console.log("Game started fr fr")


StateSystem.changeState(GameState.menu);