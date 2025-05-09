import { Engine, Scene, SceneActivationContext } from "excalibur";
import { engine } from "..";


export class Credits extends Scene {
    private rootElement!: HTMLElement;
    private mainMenuButton!: HTMLElement;

    public onInitialize(): void {
        this.rootElement = document.getElementById('credits')!;
        this.mainMenuButton = document.getElementById('credits')!;
        

        this.mainMenuButton.addEventListener("click",()=>{
            engine.goToScene("mainMenu")
        })
    }

    public onActivate(context: SceneActivationContext<unknown>): void {
        this.rootElement.style.display = "block";
    }
    
    public onDeactivate(context: SceneActivationContext): void {
        this.rootElement.style.display = "none";
    }
}