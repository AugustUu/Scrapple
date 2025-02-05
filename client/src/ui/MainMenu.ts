import { Actor, Color, Scene, SceneActivationContext, Vector } from "excalibur";
import { engine } from "..";
import { Game } from "../world/Game";
import { Networking } from "../networking/Networking";
import { Inventory } from "../game/Inventory";


export class MainMenu extends Scene {

    private playButton: Actor | undefined;
    private rootElement!: HTMLElement;
    private inputElement!: HTMLInputElement;
    private createOrJoin!: HTMLElement;
    private quickPlay: HTMLElement;

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
        this.quickPlay = document.getElementById('quickplay')!;



        this.playButton.on("pointerdown",function(){
            //engine.goToScene("game");
            Inventory.LevelUpgrade("Speed") // debug
            Inventory.updateUsableUpgrades()
            console.log(Inventory.usableUpgrades.get("Speed"))
        })
        this.quickPlay.addEventListener("click",()=>{
            Networking.quickPlay("jorbis" + Math.random())
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