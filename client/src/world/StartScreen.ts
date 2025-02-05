import { Engine, Scene, SceneActivationContext } from "excalibur";

export class StartScreen extends Scene{
    private rootElement!: HTMLElement;
    private pistolButton!: HTMLElement;
    private startButton!: HTMLElement;

    public onInitialize(engine: Engine){
        this.rootElement = document.getElementById('startscreen')!;
        this.pistolButton = document.getElementById('pistolButton')!;
        
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