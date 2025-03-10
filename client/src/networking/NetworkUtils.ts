import { Networking } from "./Networking";

export class NetworkUtils {
    static getLocalState(){
        return Networking.client.room.state.players.get(Networking.client.clientId)
    }

    static getLocalClient(){
        return Networking.client.room.state.clients.get(Networking.client.clientId)
    }

    static getLocalUpgrade(upgradeId: string){
        if(NetworkUtils.getLocalClient().upgrades.has(upgradeId)){
            return NetworkUtils.getLocalClient().upgrades.get(upgradeId).level
        }
        else{
            return 0
        }
    }
}