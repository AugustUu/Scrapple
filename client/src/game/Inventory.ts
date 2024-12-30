import { Gun } from "./Guns/Gun"
//import { Upgrade } from "./Upgrades/UpgradeManager"

export class Inventory{
    static gun: Gun
    //static upgrades: Upgrade[]

    constructor(){
        
        //Inventory.upgrades = upgrades
    }

    GetGun(){
        return Inventory.gun
    }

    GetUpgrades(){
        //return Inventory.upgrades
    }

    ChangeGun(newGun: Gun){
        Inventory.gun = newGun
    }

    /*
    ChangeUpgrade(indexNum: number, newUpgrade: Upgrade){
        Inventory.upgrades[indexNum] = newUpgrade
    }*/
}