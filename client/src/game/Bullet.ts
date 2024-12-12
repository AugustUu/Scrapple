import { Actor, Circle, Color, Component, CoordPlane, Engine, Entity, GraphicsComponent, Input, Keys, PhysicsWorld, Query, Rectangle, System, SystemType, TransformComponent, Util, Vector, World } from "excalibur";
import { ColliderComponent, RigidBodyComponent } from "../physics/PhysicsComponents";
import { Game } from "../world/Game";
import RAPIER, { RigidBody, JointData, ImpulseJoint, Ray, Collider, RigidBodyType, Ball, ColliderDesc } from '@dimforge/rapier2d-compat';
import { PhysicsSystem } from "../physics/PhysicsSystems";
import { Vector2, MathUtils, generateRevoluteJoint as generateRevoluteJoint } from "../util"


export class BulletComponent extends Component {
    public shotBy: string = 'jorbis';
    public dammage: number = 100;
    public angle: number;

    constructor(shotBy: string, angle: number) {
        super();
        this.shotBy = shotBy;
        this.angle = angle;
    }
}

export function createBullet(shotBy: string, angle: number, position: Vector): Entity {
    const entity = new Entity({
        name: shotBy + " Bullet",
    });

    entity.addComponent(new BulletComponent(shotBy, angle))

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

            const lerp = (x: number, y: number, a: number) => x * (1 - a) + y * a;


            entity.get(TransformComponent).pos.x -= Math.cos(bullet.angle)
            entity.get(TransformComponent).pos.y -= Math.sin(bullet.angle)
        }
    }
}
