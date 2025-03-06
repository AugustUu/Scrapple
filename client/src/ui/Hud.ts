import { Guns } from "shared/src/game/GunManager/GunManager";
import { Networking } from "../networking/Networking"

export class Hud {
    private static weaponDisplay: HTMLElement;
    private static ammoCounter: HTMLElement; 
    private static healthBar: HTMLElement;
    private static hudElement: HTMLElement;


    static initMain(){
        this.weaponDisplay = document.getElementById('weaponDisplay')
        this.ammoCounter = document.getElementById('ammoCounter')
        this.healthBar = document.getElementById('healthBar')
        this.hudElement = document.getElementById('hud')!;
  
    }

    static initNetwork(){
        Networking.getLocalState().gun.onChange(() => {
            let gun = Networking.getLocalState().gun
            this.weaponDisplay.innerHTML = `Weapon: ${gun.gunID}`

            if((gun.lastTimeReloaded + gun.reloadDelay) < Date.now()){
                this.ammoCounter.innerHTML = `Ammo: ${gun.ammo}/${Guns.get(gun.gunID).magSize}`

            }else{
                this.ammoCounter.innerHTML = `Reloading ...`
            }
        })

        Networking.getLocalState().onChange(() => {
            let health = Networking.getLocalState().health
            this.healthBar.innerHTML = `${health} / 100` // needs to change according to max health
        })
    }

    static enable(){
        this.hudElement.style.display = "block";
    }


    static disable(){
        this.hudElement.style.display = "none";
    }

}