import { Circle, Color, Component, CoordPlane, Entity, Font, GraphicsComponent, GraphicsGroup, Rectangle, System, SystemType, Text, TextAlign, TransformComponent, vec, Vector } from "excalibur";
import { Networking } from "../networking/Networking";

export class OtherPlayerComponent extends Component {
    public name: String = 'jorbis';
    public health: number = 100;

    constructor(name: String) {
        super();
    }
}



export function createOtherPlayerEntity(name: string, position: Vector): Entity {
    const entity = new Entity({
        name: 'Player ' + name,
    });

    entity.addComponent(new OtherPlayerComponent(name))

    let sprite = new Circle({ radius: 20, color: Color.Red })
    let nameTag = new Text({ text: name,font: new Font({  size: 30,textAlign:TextAlign.Center})})

    const group = new GraphicsGroup({
        //useAnchor:false,
        members: [
            { graphic: sprite, offset: vec(0, 0) },
            { graphic: nameTag, offset: vec(0, -20) }
        ]
    });


    let graphics = new GraphicsComponent();
    graphics.use(group);
    graphics.offset = vec(0,10)

    entity.addComponent(graphics)

    let transform = new TransformComponent();
    transform.coordPlane = CoordPlane.World;
    transform.pos = position;

    entity.addComponent(transform);

    return entity
}


