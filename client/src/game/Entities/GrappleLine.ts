import { Actor, Color, Component, CoordPlane, Engine, Entity, GraphicsComponent, Input, Keys, Rectangle, System, SystemType, TransformComponent, Util, Vector, Line, Query, World } from "excalibur";
import RAPIER, { RigidBody, JointData, ImpulseJoint, Ray, Collider, RigidBodyType } from '@dimforge/rapier2d-compat';
import { Vector2, MathUtils } from "../../util";
import { LocalPlayerInstance } from "../../scenes/Game";
import { RigidBodyComponent } from "../../physics/PhysicsComponents";

export class GrappleLineSystem extends System {
    public systemType = SystemType.Draw;
    spriteQuery: Query<typeof GraphicsComponent | typeof GrappleLineComponent>;


    constructor(world: World) {
        super();
        this.spriteQuery = world.query([GraphicsComponent, GrappleLineComponent])
    }

    update(elapsedMs: number): void {

        for (let entity of this.spriteQuery.entities) {
            let sprite = entity.get(GraphicsComponent)
            let end = entity.get(GrappleLineComponent).endPoint


            let start = entity.get(GrappleLineComponent).player.get(TransformComponent).pos
            
            entity.get(TransformComponent).pos = start



            let line: Line = sprite.current as Line
            line.start.setTo(0,0);
            line.end.setTo(end.x - start.x, end.y - start.y);
            line.thickness = 4

        }
    }

}

export class GrappleLineComponent extends Component {
    public player: Entity;
    public endPoint: Vector;

    constructor(player: Entity, endPoint: Vector) {
        super();
        this.player = player
        this.endPoint = endPoint
    }
}

export function CreateGrappleLine(player: Entity, endPoint: Vector) {
    const entity = new Entity()

    let transform = new TransformComponent();
    entity.addComponent(transform);

    let graphics = new GraphicsComponent();

    let line = new Line({
        start: Vector.Zero,
        end: Vector.Zero,
        color: Color.Gray,
        thickness: 0
    })

    graphics.use(line);

    entity.addComponent(new GrappleLineComponent(player, endPoint))
    entity.addComponent(graphics)
    return entity
}