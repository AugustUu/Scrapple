import { Engine, Scene, SceneActivationContext } from "excalibur";
import { Networking } from "../networking/Networking";
import { C2SPacket } from "shared/src/networking/Packet";

// bozo name
export class EndRoundScreen extends Scene {
    private rootElement!: HTMLElement;

    private nextRoundButton!: HTMLButtonElement;
    private playerList!: HTMLElement;
    private upgradeButtons!: HTMLElement[]

    onInitialize(engine: Engine): void {
        this.rootElement = document.getElementById('endRoundScreen')!;

        this.playerList = document.getElementById('playerList')!;
        this.nextRoundButton = document.getElementById('nextRoundButton')! as HTMLButtonElement;

        this.upgradeButtons = [document.getElementById('upgrade4Button'), document.getElementById('upgrade5Button'), document.getElementById('upgrade6Button')];

        this.nextRoundButton.addEventListener("click", () => {
            Networking.client.room.send(C2SPacket.StartGame, {})
        })


    }

    onActivate(context: SceneActivationContext<unknown>): void {
        this.rootElement.style.display = "block";
        this.playerList.innerHTML = "";

        this.nextRoundButton.disabled = !Networking.client.room.state.clients.get(Networking.client.clientId).host


        let upgradeOptions = Networking.client.room.state.clients.get(Networking.client.clientId).upgradeOptions.options;

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