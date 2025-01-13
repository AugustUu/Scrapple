import { Circle, Color, Component, CoordPlane, Entity, GraphicsComponent, Query, System, SystemType, TransformComponent, Vector, World } from "excalibur";
import { Networking } from "../../networking/Networking";



export class BulletComponent extends Component {
    public shotBy: string = 'jorbis'; // make it not be jorbis eventually
    public dammage: number = 100;
    public angle: number;
    public id: string;

    constructor(angle: number, id: string, shotBy: string,) {
        super();
        this.shotBy = shotBy;
        this.angle = angle;
        this.id = id;
    }
}

export function createBullet(angle: number, position: Vector, id: string, shotBy: string): Entity {
    const entity = new Entity({
        name: shotBy + " Bullet",
    });

    entity.addComponent(new BulletComponent(angle, id, shotBy))

    let sprite = new Circle({ radius: 4, color: Color.Red })

    let graphics = new GraphicsComponent();
    graphics.use(sprite);

    entity.addComponent(graphics)

    let transform = new TransformComponent();
    transform.coordPlane = CoordPlane.World;
    transform.pos = position;

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
                const lerp = (x: number, y: number, a: number) => x * (1 - a) + y * a;


                //entity.get(TransformComponent).pos.x -= Math.cos(bullet.angle)
                //entity.get(TransformComponent).pos.y -= Math.sin(bullet.angle)


                entity.get(TransformComponent).pos.x = lerp(entity.get(TransformComponent).pos.x, state.position.x, elapsedMs / 50)
                entity.get(TransformComponent).pos.y = lerp(entity.get(TransformComponent).pos.y, state.position.y, elapsedMs / 50)
            }
        }
    }
}
