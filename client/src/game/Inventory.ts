import { Gun } from "shared/src/game/GunManager/Gun"
import { Upgrade } from "shared/src/game//UpgradeManager/Upgrade"
import { Upgrades } from "shared/src/game//UpgradeManager/UpgradeManager"
import { Networking } from "../networking/Networking"
import { C2SPacket } from "shared/src/networking/Packet"
import { Guns } from "shared/src/game/GunManager/GunManager"
import { GunState, UpgradeState } from "server/src/State"

export class Inventory {
    public upgrades: Map<string, Upgrade>
    public usableUpgrades: Map<string, Upgrade>


    public constructor() {
        this.upgrades = Upgrades
    }

    public Shoot(angle: number) {
        Networking.client.room?.send(C2SPacket.Shoot, { angle: angle - Math.PI })
    }

    public Reload() {
        Networking.client.room?.send(C2SPacket.Reload, {})
    }

    public GetGun() {
        let id = Networking.getLocalState().gun.gunID
        return Guns.get(id)
    }

    public GetUpgrade(upgrade: string) {
        return this.upgrades.get(upgrade)
    }

    public ChangeGun(gunID: string) {
        Networking.client.room?.send(C2SPacket.SwapGun, { id: gunID })
        //this.gun = newGun
    }
}