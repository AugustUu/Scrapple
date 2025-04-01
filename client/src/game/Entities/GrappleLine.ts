import { Actor, Color, Component, CoordPlane, Engine, Entity, GraphicsComponent, Input, Keys, Rectangle, System, SystemType, TransformComponent, Util, Vector, Line, Query, World } from "excalibur";
import RAPIER, { RigidBody, JointData, ImpulseJoint, Ray, Collider, RigidBodyType } from '@dimforge/rapier2d-compat';
import { Vector2, MathUtils } from "../../util";

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
            

                //let rot_anchor1 = new Vector2(joint.anchor1()).rotate(joint.body2().rotation())         add later question markÍ
                //let pos1 = MathUtils.rapierToExc(new Vector2(joint.body1().translation()))//.add(rot_anchor1))

                //let pos2 = MathUtils.rapierToExc(new Vector2(joint.body2().translation()).add(joint.anchor2()))
            let line: Line = sprite.getGraphic(sprite.getNames()[0]) as Line

            line.start.setTo(start.x, start.y);
            line.end.setTo(end.x, end.y);

        }
    }

}

export class GrappleLineComponent extends Component {
    public player: Entity;
    public endPoint: Vector2;

    constructor(player: Entity, endPoint: Vector2) {
        super();
        this.player = player
        this.endPoint = endPoint
    }
}

export function CreateGrappleLine(player: Entity, endPoint: Vector2) {
    const entity = new Entity()

    let transform = new TransformComponent();
    entity.addComponent(transform);

    let graphics = new GraphicsComponent();
    let line = new Line({
        start: Vector.Zero,
        end: Vector.Zero,
        color: Color.Green,
        thickness: 4
    })

    graphics.use(line);

    entity.addComponent(new GrappleLineComponent(player, endPoint))
    entity.addComponent(graphics)
    return entity
}