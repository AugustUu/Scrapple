import { Engine, Color, DisplayMode, Actor, CollisionType, Scene, Resolution,  } from 'excalibur';
import { World } from './world/World';
import { MainMenu } from './ui/MainMenu';
import RAPIER from '@dimforge/rapier2d-compat';

export const engine = new Engine({
    backgroundColor: Color.Gray,
    fixedUpdateFps: 60,
    width: 1920,
    height: 1080,
    displayMode: DisplayMode.FitScreenAndFill,
    antialiasing:false,
    scenes: {
        mainMenu: MainMenu,
        world: World,
    }
});

async function init() {
   
    await RAPIER.init();

    engine.start();
    engine.toggleDebug();
    engine.goToScene("mainMenu");
    
}

init()
