import { Actor, Color, Scene, Vector } from "excalibur";
import { engine } from "..";
import { Level } from "../world/Level";


export class MainMenu extends Scene {

    private playButton: Actor | undefined;

    public onInitialize() {
        this.playButton = new Actor({
            width: 50,
            height: 50,
            color: Color.Red,
            pos: new Vector(100, 100)
        })

        this.playButton.on("pointerdown",function(){
            console.log("aaa")
            engine.goToScene("level");
        })

        this.add(this.playButton)
    }

}