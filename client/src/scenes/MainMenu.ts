import { Actor, Color, Scene, SceneActivationContext, Vector } from "excalibur";
import { engine } from "..";
import { Game } from "./Game";
import { Networking } from "../networking/Networking";


export class MainMenu extends Scene {

    private rootElement!: HTMLElement;
    private inputElement!: HTMLInputElement;
    private createOrJoin!: HTMLElement;
    private quickPlay: HTMLElement;
    private nameInput: HTMLInputElement;
    private colorInput: HTMLInputElement;
    private credits: HTMLElement;

    public onInitialize() {
        this.rootElement = document.getElementById('menu')!;
        this.inputElement = document.getElementById('serverInput')! as HTMLInputElement;
        this.createOrJoin = document.getElementById('joinButton')!;
        this.quickPlay = document.getElementById('quickplay')!;
        this.credits = document.getElementById('creditsButton')!;

        this.nameInput = document.getElementById('nameInput')! as HTMLInputElement;
        
        this.nameInput.value = "jorbis" + Math.random()

        this.colorInput = (document.getElementById('colorpicker') as HTMLInputElement)

        
        this.quickPlay.addEventListener("click",()=>{
            Networking.quickPlay(this.nameInput.value,this.colorInput.value)
        })

        this.createOrJoin.addEventListener("click",()=>{
            if(this.inputElement.value == ""){
                Networking.create(this.nameInput.value,this.colorInput.value)
            }else{
                Networking.connect(this.inputElement.value,this.nameInput.value,this.colorInput.value)
            }
        })

        this.credits.addEventListener("click",()=>{
            engine.goToScene("credits")
        })

        

    }

    public onActivate(context: SceneActivationContext<unknown>): void {
        this.rootElement.style.display = "block";
    }

    public onDeactivate(context: SceneActivationContext): void {
        this.rootElement.style.display = "none";
    }

}