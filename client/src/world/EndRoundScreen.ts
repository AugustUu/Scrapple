import { Engine, Scene, SceneActivationContext } from "excalibur";
import { Networking } from "../networking/Networking";
import { C2SPacket } from "shared/src/networking/Packet";


export class EndRoundScreen extends Scene{
    private rootElement!: HTMLElement;

    private nextRoundButton!: HTMLElement;
    private playerList!: HTMLElement;
    private upgrade1Button!: HTMLElement;
    private upgrade2Button!: HTMLElement;
    private upgrade3Button!: HTMLElement;

    onInitialize(engine: Engine): void {
        this.rootElement = document.getElementById('endRoundScreen')!;

        this.playerList = document.getElementById('playerList')!;
        this.nextRoundButton = document.getElementById('nextRoundButton')!;
    }

    onActivate(context: SceneActivationContext<unknown>): void {
        this.rootElement.style.display = "";
        this.playerList.innerHTML = "";

        this.upgrade1Button = document.getElementById('upgrade1Button')!;
        this.upgrade2Button = document.getElementById('upgrade2Button')!;
        this.upgrade3Button = document.getElementById('upgrade3Button')!;

        Networking.client.room!.state.clients.forEach((client) => {
            this.playerList.innerHTML += `<li>${client.name}</li>`
        })

        Networking.client.room!.state.clients.onChange(() => {
            this.playerList.innerHTML = ""
            Networking.client.room!.state.clients.forEach((client) => {
                this.playerList.innerHTML += `<li>${client.name}</li>`
            })
        })

        if (Networking.client.room.state.clients.get(Networking.client.clientId).host) {
                    this.nextRoundButton.addEventListener("click", () => {
                        // engine.goToScene("game");
                        Networking.client.room.send(C2SPacket.StartGame, {})
                    })
                } else {
                    this.nextRoundButton.style.display = "none"
                }
    }

    public onDeactivate(context: SceneActivationContext): void {
        this.rootElement.style.display = "none";
    }
}