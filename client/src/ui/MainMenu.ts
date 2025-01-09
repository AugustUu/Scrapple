import { Actor, Color, Scene, SceneActivationContext, Vector } from "excalibur";
import { engine } from "..";
import { Game } from "../world/Game";
import { Networking } from "../networking/Networking";


export class MainMenu extends Scene {

    private playButton: Actor | undefined;
    private rootElement!: HTMLElement;
    private inputElement!: HTMLInputElement;
    private createOrJoin!: HTMLElement;

    public onInitialize() {
        this.playButton = new Actor({
            width: 50,
            height: 50,
            color: Color.Red,
            pos: new Vector(100, 100)
        })

        this.rootElement = document.getElementById('menu')!;
        this.inputElement = document.getElementById('serverInput')! as HTMLInputElement;
        this.createOrJoin = document.getElementById('joinButton')!;

        

        this.playButton.on("pointerdown",function(){
            engine.goToScene("game");
        })

        this.createOrJoin.addEventListener("click",()=>{
            if(this.inputElement.value == ""){
                Networking.create("jorbis" + Math.random())
            }else{
                Networking.connect(this.inputElement.value,"jorbis" + Math.random())
            }
        })
        

        this.add(this.playButton)
    }

    public onActivate(context: SceneActivationContext<unknown>): void {
        this.rootElement.style.display = "";
    }

    public onDeactivate(context: SceneActivationContext): void {
        this.rootElement.style.display = "none";
    }

}