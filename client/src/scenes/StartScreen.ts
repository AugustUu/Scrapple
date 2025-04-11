import { Engine, Scene, SceneActivationContext } from "excalibur";
import { Networking } from "../networking/Networking";
import { C2SPacket } from "shared/src/networking/Packet";
import { NetworkClient } from "../networking/NetworkClient";

export class StartScreen extends Scene {
    private rootElement!: HTMLElement;

    private gunButtons!: HTMLElement[]
    private upgradeButtons!: HTMLElement[]

    private startButton!: HTMLButtonElement;
    private playerList!: HTMLElement;
    private serverCode!: HTMLElement;


    public onInitialize(engine: Engine) {
        this.rootElement = document.getElementById('startScreen')!;

        this.serverCode = document.getElementById('serverCode')!;
        
        this.gunButtons = [document.getElementById('gun1Button'), document.getElementById('gun2Button'), document.getElementById('gun3Button')];
        this.upgradeButtons = [document.getElementById('upgrade1Button'), document.getElementById('upgrade2Button'), document.getElementById('upgrade3Button')];



        this.playerList = document.getElementById('playerList')!;
        this.startButton = document.getElementById('startButton')! as HTMLButtonElement;

        this.startButton.addEventListener("click", () => {
            Networking.client.room.send(C2SPacket.StartGame, {})
        })

        this.startButton.disabled = !Networking.client.room.state.clients.get(Networking.client.clientId).host

    }

    public onActivate(context: SceneActivationContext<unknown>): void {
        this.rootElement.style.display = "block";

        this.serverCode.innerHTML = Networking.client.room.id

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

        this.gunButtons[0].style.backgroundColor = "red"
        this.upgradeButtons[0].style.backgroundColor = "red"

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