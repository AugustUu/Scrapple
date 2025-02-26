import { Command } from "@colyseus/command";
import { GameRoom } from "../rooms/GameRoom";
import { Client } from "colyseus";
import { S2CPackets } from "shared/src/networking/Packet";
import { Bullet, CircleCollider, PlayerClient, RectangleCollider } from "../State";
import { Guns } from "shared/src/game/GunManager/GunManager";



export class BulletTickCommand extends Command<GameRoom, {}> {

    execute({ } = this.payload) {

        this.state.bullets.forEach((bullet, BulletID) => {

            if (this.state.players.has(bullet.shotById)) {
                let gunInfo = Guns.get(this.state.players.get(bullet.shotById).gun.gunID)
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