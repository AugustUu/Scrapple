import { Engine, Scene, SceneActivationContext } from "excalibur";
import { engine } from "..";
import { Networking } from "../networking/Networking";
import { S2CPackets } from "shared/src/networking/Packet";


export class EndGameScreen extends Scene{
    private rootElement!: HTMLElement;
    private whoWon!: HTMLElement;
    private whoWonText: string

    public onInitialize(engine: Engine): void {
        this.rootElement = document.getElementById('endGameScreen')!;
        this.whoWon = document.getElementById('whoWon')!;

        Networking.client.room!.onMessage(S2CPackets.WinGame,(message)=>{
            this.whoWonText = message.id;
        })

    }

    public onActivate(context: SceneActivationContext<unknown>): void {
        this.rootElement.style.display = "block";

        this.whoWon.innerHTML = this.whoWonText       

    }
    
    
    public onDeactivate(context: SceneActivationContext): void {
        this.rootElement.style.display = "none";
    }
}