import { Engine, Color, DisplayMode, Actor, CollisionType, Scene, Resolution, ImageFiltering, Loader, DefaultLoader} from 'excalibur';
import { Game } from './scenes/Game';

import { MainMenu } from './scenes/MainMenu';
import RAPIER from '@dimforge/rapier2d-compat';
import { MouseInput } from './util';
import { StartScreen } from './scenes/StartScreen';
import { EndRoundScreen } from './scenes/EndRoundScreen';
import { Credits } from './scenes/Credits';
import { ExcaliburGraphicsContextWebGL } from 'excalibur';
import { Resources } from './Resources';
import { TutorialScreen } from './scenes/TutorialScreen';


export const engine = new Engine({
    backgroundColor: Color.Gray,
    fixedUpdateFps: 120,
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
        game: Game,
        startScreen: StartScreen,
        endRoundScreen: EndRoundScreen,
        credits: Credits,
        tutorial: TutorialScreen

    }
});

async function init() {

    await RAPIER.init();
    const loader = new DefaultLoader;

    
    for (let resource of Object.values(Resources)){
        loader.addResource(resource);
    }
    await engine.start(loader)
    loader.load()
    engine.goToScene("mainMenu");





    MouseInput.init();

}

init()