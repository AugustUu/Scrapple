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
    private gun1Button!: HTMLElement;
    private gun2Button!: HTMLElement;
    private gun3Button!: HTMLElement;
    private upgrade1Button!: HTMLElement;
    private upgrade2Button!: HTMLElement;
    private upgrade3Button!: HTMLElement;


    private startButton!: HTMLElement;

    private playerList!: HTMLElement;

    public onInitialize(engine: Engine) {
        this.rootElement = document.getElementById('startscreen')!;

        this.gun1Button = document.getElementById('gun1Button')!;
        this.gun2Button = document.getElementById('gun2Button')!;
        this.gun3Button = document.getElementById('gun3Button')!;
        this.upgrade1Button = document.getElementById('upgrade1Button')!;
        this.upgrade2Button = document.getElementById('upgrade2Button')!;
        this.upgrade3Button = document.getElementById('upgrade3Button')!;


        //set gun buttons to be guns

        let gunArray = new Array
        for(let i = 0; i < 6; i++){
            gunArray[i] = Array.from(Guns.keys())[i]
        }

        let gunNum = Math.floor(Math.random() * gunArray.length)
        this.gun1Button.innerHTML = gunArray[gunNum]
        gunArray.splice(gunNum, 1)

        gunNum = Math.floor(Math.random() * (gunArray.length))
        this.gun2Button.innerHTML = gunArray[gunNum]
        gunArray.splice(gunNum, 1)

        gunNum = Math.floor(Math.random() * (gunArray.length))
        this.gun3Button.innerHTML = gunArray[gunNum]
        gunArray.splice(gunNum, 1)

        //set ugprade buttons to have upgrades
        //LocalPlayerInstance.inventory.updateUsableUpgrades()
        let upgradeArray = new Array




        
        
        
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

        this.gun1Button.addEventListener("click", () => {
            console.log()
         })
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