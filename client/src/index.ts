import { Engine, Color, DisplayMode, Actor, CollisionType, Scene, Resolution, ImageFiltering,  } from 'excalibur';
import { Level } from './world/Level';
import { MainMenu } from './ui/MainMenu';
import RAPIER from '@dimforge/rapier2d-compat';

export const engine = new Engine({
    backgroundColor: Color.Gray,
    fixedUpdateFps: 60,
    width: 1920,
    height: 1080,
    displayMode: DisplayMode.FitScreenAndFill,
    canvasElementId: 'game',
    antialiasing: {
        pixelArtSampler: true, // turns on the sub-pixel shader for pixel art
        nativeContextAntialiasing: false, // turns off canvas aa
        multiSampleAntialiasing: true, // turns on msaa which smooths quad boundaries
        filtering: ImageFiltering.Blended, // hints the image loader to use blended filtering
        canvasImageRendering: 'auto' // applies the 'auto'-matic css to the canvas CSS image-rendering
      },
    scenes: {
        mainMenu: MainMenu,
        level: Level,
    }
});

async function init() {
   
    await RAPIER.init();

    engine.start();
    engine.toggleDebug();
    engine.goToScene("mainMenu");
    
}

init()
