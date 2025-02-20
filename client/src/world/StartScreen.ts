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
    private upgrade1Button!: HTMLElement;
    private upgrade2Button!: HTMLElement;
    private upgrade3Button!: HTMLElement;


    private startButton!: HTMLElement;
    private playerList!: HTMLElement;


    public onInitialize(engine: Engine) {
        this.rootElement = document.getElementById('startscreen')!;

        this.gunButtons = [document.getElementById('gun1Button'), document.getElementById('gun2Button'), document.getElementById('gun3Button')];

        this.upgrade1Button = document.getElementById('upgrade1Button')!;
        this.upgrade2Button = document.getElementById('upgrade2Button')!;
        this.upgrade3Button = document.getElementById('upgrade3Button')!;


        this.playerList = document.getElementById('playerList')!;
        this.startButton = document.getElementById('startButton')!;

    }

    public onActivate(context: SceneActivationContext<unknown>): void {
        this.rootElement.style.display = "";
        this.playerList.innerHTML = "";


        this.startButton.onclick = null
        if (Networking.client.room.state.clients.get(Networking.client.clientId).host) {
            this.startButton.onclick = () => {
                Networking.client.room.send(C2SPacket.StartGame, {})
            }
        } else {
            this.startButton.style.display = "none"
        }



        Networking.client.room!.state.clients.forEach((client) => {
            this.playerList.innerHTML += `<li>${client.name}</li>`
        })

        Networking.client.room!.state.clients.onChange(() => {
            this.playerList.innerHTML = ""
            Networking.client.room!.state.clients.forEach((client) => {
                this.playerList.innerHTML += `<li>${client.name}</li>`
            })
        })

        this.gunButtons.forEach((button) => {
            button.style.backgroundColor = ""
        })

        this.gunButtons.at(0).style.backgroundColor = "red"

        let options = Networking.client.room.state.clients.get(Networking.client.clientId).gunOptions.options;
        this.gunButtons.forEach((button, index) => {

            button.innerHTML = options[index]

            button.addEventListener("click", () => {
                Networking.client.room.send(C2SPacket.PickGun, index)
                
                this.gunButtons.forEach((button2) => {
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