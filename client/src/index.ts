import { Engine, Color, DisplayMode, Actor, CollisionType, Scene, Resolution, ImageFiltering, Loader, DefaultLoader} from 'excalibur';
import { Game } from './scenes/Game';

import { MainMenu } from './scenes/MainMenu';
import RAPIER from '@dimforge/rapier2d-compat';
import { Sound } from 'excalibur'
import { MouseInput } from './util';
import { StartScreen } from './scenes/StartScreen';
import { EndRoundScreen } from './scenes/EndRoundScreen';
import { Credits } from './scenes/Credits';
import { ExcaliburGraphicsContextWebGL } from 'excalibur';
import { Resources } from './Resources';


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
        filtering: ImageFiltering.Pixel, // hints the image loader to use blended filtering
        canvasImageRendering: 'pixelated', // applies the 'auto'-matic css to the canvas CSS image-rendering
    },
    const sound = new Sound('./Sound/Guns/Shotgun.mp3', './Sound/Guns/fallback.wav');

    const loader = new Loader([sound]);
    Game.start(loader);
    sound.play(0.5);


    scenes: {
        mainMenu: MainMenu,
        game: Game,
        startScreen: StartScreen,
        endRoundScreen: EndRoundScreen,
        credits: Credits,

    },
    pixelRatio: 4,
    pixelArt: true
});
const Shotgun = new Sound('./Sound/Gun/Shotgun.mp3');
const Rifle = new Sound('./Sound/Gun/Rifle.mp3');
const Pistol = new Sound('./Sound/Gun/Pistol.mp3')
const Sniper = new Sound('./Sound/Gun/Sniper.mp3')
const SMG = new Sound('./Sound/Gun/SMG.mp3')


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