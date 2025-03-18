import { Command } from "@colyseus/command";
import { GameRoom } from "../rooms/GameRoom";
import { S2CPackets } from "shared/src/networking/Packet";
import { Bullet, CircleCollider, PlayerClient, RectangleCollider } from "../State";
import { Guns } from "shared/src/game/GunManager/GunManager";



export class BulletTickCommand extends Command<GameRoom, {}> {

    execute({ } = this.payload) {

        this.state.bullets.forEach((bullet, BulletID) => {

            if (this.state.players.has(bullet.shotById)) {
                let gunInfo = Guns.get(this.state.players.get(bullet.shotById).gun.gunID)
                let homeRadius = 300
                let homeAngle = Math.PI / 4
                let homeStrength = 0.01

                let closestCoord: {x:number, y:number}
                for(var player of this.state.players.values()){
                    if(player.id == bullet.shotById){
                        continue
                    }
                    else{
                        if(closestCoord == undefined){
                            closestCoord = player.position
                        }
                        else{
                            if(Math.pow(player.position.x - bullet.position.x, 2) + Math.pow(player.position.y - bullet.position.y, 2) < Math.pow(closestCoord.x - bullet.position.x, 2) + Math.pow(closestCoord.y - bullet.position.y, 2)){
                                closestCoord = {x:player.position.x, y:player.position.y}
                            }
                        }
                    }
                }
                if(closestCoord != undefined){
                    if(Math.pow(closestCoord.x - bullet.position.x, 2) + Math.pow(closestCoord.y - bullet.position.y, 2) <= Math.pow(homeRadius + 20, 2)){
                        let changeAngle = -bullet.angle + Math.atan2(closestCoord.y - bullet.position.y, closestCoord.x - bullet.position.x)
                        changeAngle = (((changeAngle + Math.PI) % (2*Math.PI)) + (2*Math.PI)) % (2*Math.PI) - Math.PI // just moves number between -pi and pi
                        if(Math.abs(changeAngle) < homeAngle){
                            bullet.angle += Math.min(Math.max(changeAngle, -homeStrength), homeStrength) // clamps to home strength
                        }
                    }
                }
                bullet.position.x += Math.cos(bullet.angle) * bullet.speed
                bullet.position.y += Math.sin(bullet.angle) * bullet.speed
            }

            this.state.colliders.forEach((collider, key) => {
                if (collider instanceof RectangleCollider) {
                    if (intersectsRect(bullet, collider)) {
                        this.state.bullets.delete(BulletID);
                    }
                }

                if (collider instanceof CircleCollider) {
                    if (Math.hypot(collider.position.x - bullet.position.x, collider.position.y - bullet.position.y) <= (bullet.radius + collider.radius * 10)) {
                        this.state.bullets.delete(BulletID);
                    }
                }
            })

            this.state.players.forEach((player) => {
                if (bullet.shotById != player.id) {
                    if (Math.hypot(player.position.x - bullet.position.x, player.position.y - bullet.position.y) <= (bullet.radius + player.radius)) {
                        if (!this.state.players.get(bullet.shotById)) {
                            return
                        }
                        player.health -= Guns.get(this.state.players.get(bullet.shotById).gun.gunID).damage

                        if (player.health <= 0) {
                            this.state.players.delete(player.id);
                            this.room.clients.getById(player.id).send(S2CPackets.Killed, {})
                        }
                        this.state.bullets.delete(BulletID);
                        console.log("player health is " + player.health)
                    }
                }
            })

            if(bullet.timeCreated + 8000 < Date.now()){
                this.state.bullets.delete(BulletID)
            }


        })

    }

}


function intersectsRect(bullet: Bullet, rect: RectangleCollider) {
    let circleDistance = { x: Math.abs(bullet.position.x - rect.position.x), y: Math.abs(bullet.position.y - rect.position.y) }
    let scaledRect = { width: rect.width * 10, height: rect.height * 10 }

    if (circleDistance.x > (scaledRect.width + bullet.radius) || circleDistance.y > (scaledRect.height + bullet.radius)) { return false; } // definitely not touching
    if (circleDistance.x <= (scaledRect.width) || circleDistance.y <= (scaledRect.height)) { return true; } // definitely touching

    let cornerDistance = (circleDistance.x - scaledRect.width) ^ 2 + (circleDistance.y - scaledRect.height) ^ 2; // lowkey idk how thismath works but it saves a sqrt so whatever

    return (cornerDistance <= (bullet.radius ^ 2));
}