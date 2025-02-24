import { Engine, Scene, SceneActivationContext } from "excalibur";
import { Gun } from "shared/src/game/GunManager/Gun";
import { Guns } from "shared/src/game/GunManager/GunManager"
import { Game, LocalPlayerInstance } from "./Game";
import { Networking } from "../networking/Networking";
import { C2SPacket } from "shared/src/networking/Packet";
import { LocalPlayer } from "../game/LocalPlayer";
import { Inventory } from "../game/Inventory";

export class StartScreen extends Scene {
    private rootElement!: HTMLElement;

    private gunButtons!: HTMLElement[]
    private upgradeButtons!: HTMLElement[]

    private startButton!: HTMLElement;
    private playerList!: HTMLElement;


    public onInitialize(engine: Engine) {
        this.rootElement = document.getElementById('startScreen')!;

        this.gunButtons = [document.getElementById('gun1Button'), document.getElementById('gun2Button'), document.getElementById('gun3Button')];

        this.upgradeButtons = [document.getElementById('upgrade1Button'), document.getElementById('upgrade2Button'), document.getElementById('upgrade3Button')];
        //set gun buttons to be guns






        //set ugprade buttons to have upgrades






        this.playerList = document.getElementById('playerList')!;
        this.startButton = document.getElementById('startButton')!;

        if (Networking.client.room.state.clients.get(Networking.client.clientId).host) {
            this.startButton.addEventListener("click", () => {
                // engine.goToScene("game");
                Networking.client.room.send(C2SPacket.StartGame, {})
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


        let gunOptions = Networking.client.room.state.clients.get(Networking.client.clientId).gunOptions.options;
        let upgradeOptions = Networking.client.room.state.clients.get(Networking.client.clientId).upgradeOptions.options;
        this.gunButtons.forEach((button, index) => {
            button.innerHTML = gunOptions[index]
            button.addEventListener("click", () => {
                Networking.client.room.send(C2SPacket.PickGun, index)

                this.gunButtons.forEach((button2) => {
                    button2.style.backgroundColor = ""
                })
                button.style.backgroundColor = "red"
            })
        })
        
        this.upgradeButtons.forEach((button, index) => {
            button.innerHTML = upgradeOptions[index]
            button.addEventListener("click", () => {
                Networking.client.room.send(C2SPacket.PickUpgrade, index)

                this.upgradeButtons.forEach((button2) => {
                    button2.style.backgroundColor = ""
                })
                button.style.backgroundColor = "red"
            })
        })
    }

    public onDeactivate(context: SceneActivationContext): void {
        this.rootElement.style.display = "none";
    }
}