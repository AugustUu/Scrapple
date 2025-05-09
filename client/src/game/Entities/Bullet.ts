import { Circle, Color, Component, CoordPlane, EmitterType, Entity, GraphicsComponent, ParticleEmitter, Query, System, SystemType, TransformComponent, vec, Vector, World } from "excalibur";
import { Networking } from "../../networking/Networking";
import { lerp } from "../../util";
import { Bullet, CircleCollider, Collider, Player, RectangleCollider } from "server/src/State";
import { engine } from "../..";


export class BulletComponent extends Component {
    public shotBy: string = 'jorbis'; // make it not be jorbis eventually
    public angle: number;
    public id: string;

    constructor(angle: number, id: string, shotBy: string,) {
        super();
        this.shotBy = shotBy;
        this.angle = angle;
        this.id = id;
    }
}

export function createBullet(bullet: Bullet, id: string): Entity {
    const entity = new Entity({
        name: bullet.shotById + " Bullet",
    });

    entity.addComponent(new BulletComponent(bullet.angle, id, bullet.shotById))

    let sprite = new Circle({ radius: bullet.radius, color: Color.Red })

    let graphics = new GraphicsComponent();
    graphics.use(sprite);

    entity.addComponent(graphics)

    let transform = new TransformComponent();
    transform.coordPlane = CoordPlane.World;
    transform.pos = vec(bullet.position.x, bullet.position.y);

    entity.addComponent(transform);



    return entity;
}


export class BulletMoveSystem extends System {
    systemType = SystemType.Draw;

    query: Query<typeof TransformComponent | typeof BulletComponent>;


    constructor(world: World) {
        super();
        this.query = world.query([TransformComponent, BulletComponent]);
    }

    update(elapsedMs: number): void {

        for (let entity of this.query.entities) {
            let bullet = entity.get(BulletComponent);

            let state = Networking.client.room!.state.bullets.get(bullet.id)
            if (state) {


                //entity.get(TransformComponent).pos.x -= Math.cos(bullet.angle)
                //entity.get(TransformComponent).pos.y -= Math.sin(bullet.angle)


                entity.get(TransformComponent).pos.x = state.position.x
                entity.get(TransformComponent).pos.y = state.position.y
            }

        }


    }
}
