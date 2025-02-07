import { Engine, Scene, SceneActivationContext } from "excalibur";
import { Networking } from "../networking/Networking";
import { C2SPacket } from "shared/src/networking/Packet";

export class StartScreen extends Scene {
    private rootElement!: HTMLElement;
    private pistolButton!: HTMLElement;
    private startButton!: HTMLElement;

    private playerList!: HTMLElement;

    public onInitialize(engine: Engine) {
        this.rootElement = document.getElementById('startscreen')!;
        this.pistolButton = document.getElementById('pistolButton')!;
        this.playerList = document.getElementById('playerList')!;
        this.startButton = document.getElementById('startButton')!;

        if (Networking.client.room.state.clients.get(Networking.client.clientId).host) {
            this.startButton.addEventListener("click", () => {
               // engine.goToScene("game");
               Networking.client.room.send(C2SPacket.StartGame,{})
            })
        } else {
            this.startButton.style.display = "none"
        }
    }

    public onActivate(context: SceneActivationContext<unknown>): void {
        this.rootElement.style.display = "";

        Networking.client.room!.state.clients.forEach((client) => {
            this.playerList.innerHTML += `<li>${client.name}</li>`
        })

        Networking.client.room!.state.clients.onChange(() => {
            this.playerList.innerHTML = ""
            Networking.client.room!.state.clients.forEach((client) => {
                this.playerList.innerHTML += `<li>${client.name}</li>`
            })
        })
    }

    public onDeactivate(context: SceneActivationContext): void {
        this.rootElement.style.display = "none";
    }
}