import { Actor, Color, Component, CoordPlane, Engine, Entity, GraphicsComponent, Input, Keys, Rectangle, System, SystemType, TransformComponent, Util, Vector, Line, Query, World } from "excalibur";
import RAPIER, { RigidBody, JointData, ImpulseJoint, Ray, Collider, RigidBodyType } from '@dimforge/rapier2d-compat';

export class GrappleLineSystem extends System {
    public systemType = SystemType.Update;
    spriteQuery: Query<typeof GraphicsComponent | typeof GrappleLineComponent>;
    

    constructor(world: World) {
        super();
        this.spriteQuery = world.query([GraphicsComponent, GrappleLineComponent])
    }

    update(elapsedMs: number): void {
        
        for(let entity of this.spriteQuery.entities){
            let sprite = entity.get(GraphicsComponent) 
            let line: Line = sprite.getGraphic(sprite.getNames()[0]) as Line

            line.start.setTo((Math.random() - 0.5) * 1000, (Math.random() - 0.5) * 1000);
            line.end.setTo((Math.random() - 0.5) * 1000, (Math.random() - 0.5) * 1000);

        }
    }

}

export class GrappleLineComponent extends Component {
    //public joint: ImpulseJoint

    constructor() {
        super();
        //this.joint = joint
    }
}

export function CreateGrappleLine() {
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

    entity.addComponent(new GrappleLineComponent())
    entity.addComponent(graphics)
    return entity



}