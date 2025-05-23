import { Engine, Scene, SceneActivationContext } from "excalibur";
import { Networking } from "../networking/Networking";
import { C2SPacket, S2CPackets } from "shared/src/networking/Packet";
import { NetworkUtils } from "../networking/NetworkUtils";
import { Upgrades } from "shared/src/game/UpgradeManager/UpgradeManager";

// bozo name
export class EndRoundScreen extends Scene {
    private rootElement!: HTMLElement;

    private readyButton!: HTMLButtonElement;
    private playerList!: HTMLElement;
    private upgradeButtons!: HTMLElement[]
    private serverCode!: HTMLElement;
    private exitButton!: HTMLElement;

    onInitialize(engine: Engine): void {
        this.rootElement = document.getElementById('endRoundScreen')!;

        this.serverCode = document.getElementById('endRoundServerCode')!;
        this.playerList = document.getElementById('playerListNext')!;
        this.readyButton = document.getElementById('readyButtonNext')! as HTMLButtonElement;
        this.exitButton= document.getElementById('exitButtonNext')! as HTMLButtonElement;

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

        this.exitButton.addEventListener("click", () => {
            location.reload()
        })
    }

    onActivate(context: SceneActivationContext<unknown>): void {
        this.rootElement.style.display = "block";

        this.serverCode.innerHTML = Networking.client.room.id

        this.readyButton.innerHTML = "Ready"

        this.playerList.innerHTML = ""

        Networking.client.room!.state.clients.forEach((client) => {
            if(client.ready){
                this.playerList.innerHTML += `<li style="color:MediumSeaGreen;">${client.name} | ${client.wins}</li>`
            }
            else{
                this.playerList.innerHTML += `<li>${client.name} | ${client.wins} </li>`
            }
        })

        Networking.client.room!.state.clients.onChange(() => {
            this.playerList.innerHTML = ""
            Networking.client.room!.state.clients.forEach((client) => {
                if (client.ready) {
                    this.playerList.innerHTML += `<li style="color:MediumSeaGreen;">${client.name} | ${client.wins}</li>`
                }
                else {
                    this.playerList.innerHTML += `<li>${client.name} | ${client.wins} </li>`
                }
            })
        })

        Networking.client.room!.onMessage(S2CPackets.Readied, () => {
            setTimeout(() => {
                this.playerList.innerHTML = ""
                Networking.client.room!.state.clients.forEach((client) => {
                    if (client.ready) {
                        this.playerList.innerHTML += `<li style="color:MediumSeaGreen;">${client.name} | ${client.wins}</li>`
                    }
                    else {
                        this.playerList.innerHTML += `<li>${client.name} | ${client.wins}</li>`
                    }
                })
            }, 50)
        })

        let upgradeOptions = NetworkUtils.getLocalClient().upgradeOptions.options;

        this.upgradeButtons.forEach((button2) => {
            button2.style.backgroundColor = ""
        })
        this.upgradeButtons[0].style.backgroundColor = "#990000"

        this.upgradeButtons.forEach((button, index) => {
            button.innerHTML = `<h3>${upgradeOptions[index]}</h3> <h5 style="margin:0;">Level:${NetworkUtils.getLocalUpgrade(upgradeOptions[index])}</h5>  <h4 style="margin:10px;"> ${Upgrades.get(upgradeOptions[index]).description} </h4>`

            button.addEventListener("click", () => {
                Networking.client.room.send(C2SPacket.PickUpgrade, index)

                this.upgradeButtons.forEach((button2) => {
                    button2.style.backgroundColor = ""
                })
                button.style.backgroundColor = "#990000"
            })
        })
    }

    public onDeactivate(context: SceneActivationContext): void {
        this.rootElement.style.display = "none";
    }
}