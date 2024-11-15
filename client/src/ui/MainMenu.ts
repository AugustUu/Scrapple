import { Actor, Color, Scene, Vector } from "excalibur";
import { GameState, StateSystem } from "../util/StateSystem";
import { engine } from "..";


export class MainMenu {

    static scene: Scene;

    static init() {
        this.scene = new Scene();
        engine.add('menu', MainMenu.scene);

        StateSystem.onEnter(GameState.menu,  () => {
            engine.goToScene('menu');
        })
        
        const playButton = new Actor({
            width: 50,
            height: 50,
            color: Color.Red,
            pos: new Vector(100, 100)
        })

        playButton.on("pointerdown",function(){
            console.log("aaa")
            StateSystem.changeState(GameState.inRoom)
        })

        this.scene.add(playButton)
    }


}