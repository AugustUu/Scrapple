import { Engine, Scene, SceneActivationContext } from "excalibur";
import { Gun } from "shared/src/game/GunManager/Gun";
import { Guns } from "shared/src/game/GunManager/GunManager"


export class StartScreen extends Scene{
    private rootElement!: HTMLElement;
    private gun1Button!: HTMLElement;
    private gun2Button!: HTMLElement;
    private gun3Button!: HTMLElement;

    private startButton!: HTMLElement;

    public onInitialize(engine: Engine){
        this.rootElement = document.getElementById('startscreen')!;
        this.gun1Button = document.getElementById('gun1Button')!;
        this.gun2Button = document.getElementById('gun2Button')!;
        this.gun3Button = document.getElementById('gun3Button')!;

        

        this.gun1Button.innerHTML = Array.from(Guns.keys())[Math.round(Math.random() * 6)]
        this.gun2Button.innerHTML = Array.from(Guns.keys()).toString()
        
        this.startButton = document.getElementById('startButton')!;

        this.startButton.addEventListener("click",()=>{
            engine.goToScene("game");
        })
    }

    public onActivate(context: SceneActivationContext<unknown>): void {
        this.rootElement.style.display = "";
    }

    public onDeactivate(context: SceneActivationContext): void {
        this.rootElement.style.display = "none";
    }
}