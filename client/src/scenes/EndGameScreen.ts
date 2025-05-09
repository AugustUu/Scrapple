import { Engine, Scene, SceneActivationContext } from "excalibur";
import { engine } from "..";
import { Networking } from "../networking/Networking";
import { S2CPackets, C2SPacket } from "shared/src/networking/Packet";
import { Game } from "./Game";


export class EndGameScreen extends Scene{
    private rootElement!: HTMLElement;
    private whoWon!: HTMLElement;
    private nextGameButton: HTMLElement

    public onInitialize(engine: Engine): void {
        this.rootElement = document.getElementById('endGameScreen')!;
        this.whoWon = document.getElementById('whoWon')!;
        this.nextGameButton = document.getElementById('nextGameButton')!;

        this.nextGameButton.addEventListener("click",()=>{
            Networking.client.room.send(C2SPacket.Ready, {})
        })
    }


    public onActivate(context: SceneActivationContext<unknown>): void {
        this.rootElement.style.display = "block";
    }
    
    public onDeactivate(context: SceneActivationContext): void {
        this.rootElement.style.display = "none";
    }
}