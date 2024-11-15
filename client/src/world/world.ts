import { Actor, Color, Scene, Vector } from "excalibur";
import { engine } from "..";
import { MainMenu } from "../ui/MainMenu";
import { GameState, StateSystem } from "../util/StateSystem";

export class World {

    static scene: Scene;

    static init() {
        this.scene = new Scene();
        engine.add('game', MainMenu.scene);

        StateSystem.onEnter(GameState.inRoom,  () => {
            debugger
            engine.goToScene('game');
        })

        const playButton = new Actor({
            width: 50,
            height: 50,
            color: Color.Green,
            pos: new Vector(100, 100)
        })

        this.scene.add(playButton)
    }

}