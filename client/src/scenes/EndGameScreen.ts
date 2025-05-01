import { Engine, Scene, SceneActivationContext } from "excalibur";
import { engine } from "..";
import { Networking } from "../networking/Networking";
import { S2CPackets } from "shared/src/networking/Packet";


export class EndGameScreen extends Scene{
    private rootElement!: HTMLElement;

    public onInitialize(engine: Engine): void {
        this.rootElement = document.getElementById('endGameScreen')!;

        Networking.client.room!.onMessage(S2CPackets.WinGame,()=>{
            console.log(S2CPackets.WinGame)
        })
    }

    public onActivate(context: SceneActivationContext<unknown>): void {
        this.rootElement.style.display = "block";
    }
    
    public onDeactivate(context: SceneActivationContext): void {
        this.rootElement.style.display = "none";
    }
}