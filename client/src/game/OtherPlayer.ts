import { Color, Component, CoordPlane, Entity, GraphicsComponent, Rectangle, System, SystemType, TransformComponent, Vector } from "excalibur";
import { Networking } from "../networking/Networking";

export class OtherPlayerComponent extends Component {
    public name: String = 'jorbis';
    public health: number = 100;

    constructor(name: String) {
        super();
    }
}

console.log("aa");

Networking.events.on("stateChanged",()=>{
    debugger
})

export function createOtherPlayerEntity(name: String, position: Vector): Entity {
    const entity = new Entity({
        name: 'Player ' + name,
    });

    entity.addComponent(new OtherPlayerComponent(name))

    let sprite = new Rectangle({ width: 100, height: 100, color: Color.Red })

    let graphics = new GraphicsComponent();
    graphics.add(sprite);
    entity.addComponent(graphics)

    let transform = new TransformComponent();
    transform.coordPlane = CoordPlane.World;
    transform.pos = position;

    entity.addComponent(transform);

    return entity
}


