import { Guns } from "shared/src/game/GunManager/GunManager";
import { Networking } from "../networking/Networking"
import { NetworkUtils } from "../networking/NetworkUtils";

export class Hud {
    private static weaponDisplay: HTMLElement;
    private static ammoCounter: HTMLElement; 
    //private static healthBar: HTMLElement;
    private static hudElement: HTMLElement;
    private static upgradesList: HTMLElement;


    static initMain(){
        this.upgradesList = document.getElementById('upgradeList')
        this.weaponDisplay = document.getElementById('weaponDisplay')
        this.ammoCounter = document.getElementById('ammoCounter')
        //this.healthBar = document.getElementById('healthBar')
        this.hudElement = document.getElementById('hud')!;
  
    }

    static initNetwork(){
        NetworkUtils.getLocalState().gun.onChange(() => {
            let gun = NetworkUtils.getLocalState().gun
            this.weaponDisplay.innerHTML = `Weapon: ${gun.gunID}`

            if((gun.lastTimeReloaded + gun.reloadDelay) < Date.now()){
                this.ammoCounter.innerHTML = `Ammo: ${gun.ammo}/${Guns.get(gun.gunID).magSize}`

            }else{
                this.ammoCounter.innerHTML = `Reloading ...`
            }
        })


        NetworkUtils.getLocalClient().upgrades.onChange(() => {
            this.upgradesList.innerHTML = ''
            for(let upgrade of NetworkUtils.getLocalClient().upgrades.values()){
                this.upgradesList.innerHTML += upgrade.upgradeID + " " + upgrade.level + '<br>'
            }
        })

        /*NetworkUtils.getLocalState().onChange(() => {
            let health = NetworkUtils.getLocalState().health
            this.healthBar.innerHTML = `${health} / 100` // needs to change according to max health
        })*/
    }

    static enable(){
        this.hudElement.style.display = "block";
    }


    static disable(){
        this.hudElement.style.display = "none";
    }

}