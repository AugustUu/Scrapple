import { Engine, Scene, SceneActivationContext } from "excalibur";
import { Networking } from "../networking/Networking";
import { C2SPacket, S2CPackets } from "shared/src/networking/Packet";
import { NetworkUtils } from "../networking/NetworkUtils";

// bozo name
export class EndRoundScreen extends Scene {
    private rootElement!: HTMLElement;

    private readyButton!: HTMLButtonElement;
    private playerList!: HTMLElement;
    private upgradeButtons!: HTMLElement[]
    private serverCode!: HTMLElement;

    onInitialize(engine: Engine): void {
        this.rootElement = document.getElementById('endRoundScreen')!;

        this.serverCode = document.getElementById('endRoundServerCode')!;
        this.playerList = document.getElementById('playerListNext')!;
        this.readyButton = document.getElementById('readyButtonNext')! as HTMLButtonElement;

        this.upgradeButtons = [document.getElementById('upgrade4Button'), document.getElementById('upgrade5Button'), document.getElementById('upgrade6Button')];

        this.readyButton.addEventListener("click", () => {
            Networking.client.room.send(C2SPacket.Ready, {})
            if(this.readyButton.innerHTML === "Ready"){
                this.readyButton.innerHTML = "Unready"
            }
            else{
                this.readyButton.innerHTML = "Ready"
            }
        })
    }

    onActivate(context: SceneActivationContext<unknown>): void {
        this.rootElement.style.display = "block";

        this.serverCode.innerHTML = Networking.client.room.id

        this.readyButton.innerHTML = "Ready"

        this.playerList.innerHTML = ""

        Networking.client.room!.state.clients.forEach((client) => {
            if(client.ready){
                this.playerList.innerHTML += `<li style="color:MediumSeaGreen;">${client.name}</li>`
            }
            else{
                this.playerList.innerHTML += `<li>${client.name}</li>`
            }
        })

        Networking.client.room!.state.clients.onChange(() => {
            this.playerList.innerHTML = ""
            Networking.client.room!.state.clients.forEach((client) => {
                if (client.ready) {
                    this.playerList.innerHTML += `<li style="color:MediumSeaGreen;">${client.name}</li>`
                }
                else {
                    this.playerList.innerHTML += `<li>${client.name}</li>`
                }
            })
        })

        Networking.client.room!.onMessage(S2CPackets.Readied, () => {
            setTimeout(() => {
                this.playerList.innerHTML = ""
                Networking.client.room!.state.clients.forEach((client) => {
                    if (client.ready) {
                        this.playerList.innerHTML += `<li style="color:MediumSeaGreen;">${client.name}</li>`
                    }
                    else {
                        this.playerList.innerHTML += `<li>${client.name}</li>`
                    }
                })
            }, 50)
        })

        let upgradeOptions = NetworkUtils.getLocalClient().upgradeOptions.options;

        this.upgradeButtons.forEach((button2) => {
            button2.style.backgroundColor = ""
        })
        this.upgradeButtons[0].style.backgroundColor = "red"

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