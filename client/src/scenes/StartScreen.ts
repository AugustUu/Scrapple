import { Engine, Scene, SceneActivationContext } from "excalibur";
import { Networking } from "../networking/Networking";
import { C2SPacket, S2CPackets } from "shared/src/networking/Packet";
import { NetworkClient } from "../networking/NetworkClient";
import { NetworkUtils } from "../networking/NetworkUtils";
import { Upgrades } from "shared/src/game/UpgradeManager/UpgradeManager";

export class StartScreen extends Scene {
    private rootElement!: HTMLElement;

    private gunButtons!: HTMLElement[]
    private upgradeButtons!: HTMLElement[]

    private readyButton!: HTMLButtonElement;
    private playerList!: HTMLElement;
    private serverCode!: HTMLElement;
    private exitButton!: HTMLElement;


    public onInitialize(engine: Engine) {
        this.rootElement = document.getElementById('startScreen')!;

        this.serverCode = document.getElementById('serverCode')!;

        this.gunButtons = [document.getElementById('gun1Button'), document.getElementById('gun2Button'), document.getElementById('gun3Button')];
        this.upgradeButtons = [document.getElementById('upgrade1Button'), document.getElementById('upgrade2Button'), document.getElementById('upgrade3Button')];



        this.playerList = document.getElementById('playerListStart')!;
        this.readyButton = document.getElementById('readyButtonStart')! as HTMLButtonElement;
        this.exitButton= document.getElementById('exitButtonStart')! as HTMLButtonElement;

        this.readyButton.addEventListener("click", () => {
            Networking.client.room.send(C2SPacket.Ready, {})
            if (this.readyButton.innerHTML === "Ready") {
                this.readyButton.innerHTML = "Unready"
            }
            else {
                this.readyButton.innerHTML = "Ready"
            }
        })
        
        this.exitButton.addEventListener("click", () => {
            location.reload()
        })

    }

    public onActivate(context: SceneActivationContext<unknown>): void {
        this.rootElement.style.display = "block";

        this.serverCode.innerHTML = Networking.client.room.id

        this.playerList.innerHTML = "";
        this.readyButton.innerHTML = "Ready"


        this.checkReady()

        Networking.client.room!.state.clients.onChange(() => {
            this.checkReady()
        })

        Networking.client.room!.onMessage(S2CPackets.Readied, () => {
            setTimeout(() => {
                this.checkReady()
            }, 50)
        })


        let gunOptions = Networking.client.room.state.clients.get(Networking.client.clientId).gunOptions.options;
        let upgradeOptions = Networking.client.room.state.clients.get(Networking.client.clientId).upgradeOptions.options;

        this.gunButtons[0].style.backgroundColor = "#990000"
        this.upgradeButtons[0].style.backgroundColor = "#990000"

        this.gunButtons.forEach((button, index) => {
            button.innerHTML = gunOptions[index]
            button.addEventListener("click", () => {
                Networking.client.room.send(C2SPacket.PickGun, index)

                this.gunButtons.forEach((button2) => {
                    button2.style.backgroundColor = ""
                })
                button.style.backgroundColor = "#990000"
            })
        })

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

    private checkReady(){
        this.playerList.innerHTML = ""
        Networking.client.room!.state.clients.forEach((client) => {
            if (client.ready) {
                this.playerList.innerHTML += `<li style="color:MediumSeaGreen;">${client.name} | 0</li>`
            }
            else {
                this.playerList.innerHTML += `<li>${client.name} | 0</li>`
            }
        })
    }
}