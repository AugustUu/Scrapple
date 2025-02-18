import { Engine, Scene, SceneActivationContext } from "excalibur";
import { Gun } from "shared/src/game/GunManager/Gun";
import { Guns } from "shared/src/game/GunManager/GunManager"

import { Networking } from "../networking/Networking";
import { C2SPacket } from "shared/src/networking/Packet";

export class StartScreen extends Scene {
    private rootElement!: HTMLElement;
    private gun1Button!: HTMLElement;
    private gun2Button!: HTMLElement;
    private gun3Button!: HTMLElement;

    private startButton!: HTMLElement;

    private playerList!: HTMLElement;

    public onInitialize(engine: Engine) {
        this.rootElement = document.getElementById('startscreen')!;
        this.gun1Button = document.getElementById('gun1Button')!;
        this.gun2Button = document.getElementById('gun2Button')!;
        this.gun3Button = document.getElementById('gun3Button')!;

        

        this.gun1Button.innerHTML = Array.from(Guns.keys())[Math.round(Math.random() * 6)]
        this.gun2Button.innerHTML = Array.from(Guns.keys()).toString()
        
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
        this.playerList.innerHTML = "";

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