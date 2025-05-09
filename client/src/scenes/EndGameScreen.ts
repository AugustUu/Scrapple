import { Engine, Scene, SceneActivationContext } from "excalibur";
import { engine } from "..";
import { Networking } from "../networking/Networking";
import { S2CPackets, C2SPacket } from "shared/src/networking/Packet";
import { Game } from "./Game";


export class EndGameScreen extends Scene{
    private rootElement!: HTMLElement;
    private whoWon!: HTMLElement;
    private nextGameButton: HTMLElement
    private playerList: HTMLElement

    public onInitialize(engine: Engine): void {
        this.rootElement = document.getElementById('endGameScreen')!;
        this.whoWon = document.getElementById('whoWon')!;
        this.nextGameButton = document.getElementById('nextGameButton')!;
        this.playerList = document.getElementById('playerListEnd')

        this.nextGameButton.addEventListener("click",()=>{
            Networking.client.room.send(C2SPacket.Ready, {})
        })
    }


    public onActivate(context: SceneActivationContext<unknown>): void {
        this.rootElement.style.display = "block";

        this.checkReady()

        Networking.client.room!.state.clients.onChange(() => {
            this.checkReady()
        })

        Networking.client.room!.onMessage(S2CPackets.Readied, () => {
            setTimeout(() => {
                this.checkReady()
            }, 50)
        })
    }
    
    public onDeactivate(context: SceneActivationContext): void {
        this.rootElement.style.display = "none";
    }

    private checkReady(){
        this.playerList.innerHTML = ""
        Networking.client.room!.state.clients.forEach((client) => {
            if (client.ready) {
                this.playerList.innerHTML += `<li style="color:MediumSeaGreen;">${client.name}</li>`
            }
            else {
                this.playerList.innerHTML += `<li>${client.name}</li>`
            }
        })
    }
}