import { Gun } from "shared/src/game/GunManager/Gun"
import { Networking } from "../networking/Networking"
import { C2SPacket } from "shared/src/networking/Packet"
import { Guns } from "shared/src/game/GunManager/GunManager"
import { GunState } from "server/src/State"
import { NetworkUtils } from "../networking/NetworkUtils"

export class Inventory {
    public Shoot(angle: number) {
        Networking.client.room?.send(C2SPacket.Shoot, { angle: angle - Math.PI })
    }

    public Reload() {
        Networking.client.room?.send(C2SPacket.Reload, {})
    }

    public GetGun() {
        let id = NetworkUtils.getLocalState().gun.gunID
        return Guns.get(id)
    }

    public ChangeGun(gunID: string) {
        Networking.client.room?.send(C2SPacket.SwapGun, { id: gunID })
        //this.gun = newGun
    }
}