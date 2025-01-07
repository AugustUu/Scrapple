import { Circle, Color, Component, CoordPlane, Entity, Font, GraphicsComponent, GraphicsGroup, Query, Rectangle, System, SystemType, Text, TextAlign, TransformComponent, vec, Vector, World } from "excalibur";
import { Networking } from "../../networking/Networking";

export class OtherPlayerComponent extends Component {
    public name: string = 'jorbis';
    public id: string = "";
    public health: number = 100;
    public grappleLine?: Entity;

    constructor(name: string, id: string) {
        super();
        this.name = name;
        this.id = id;
    }
}



export function createOtherPlayerEntity(name: string, id: string, position: Vector): Entity {
    const entity = new Entity({
        name: 'Player ' + name,
    });

    entity.addComponent(new OtherPlayerComponent(name, id))

    let sprite = new Circle({ radius: 20, color: Color.Red })



    let graphics = new GraphicsComponent();
    graphics.use(sprite);
    //graphics.offset = vec(0, 10)
    //graphics.anchor = vec(0.5,0.5)

    entity.addComponent(graphics)

    let transform = new TransformComponent();
    transform.coordPlane = CoordPlane.World;
    transform.pos = position;

    entity.addComponent(transform);

    let nameTag = new Text({ text: name, font: new Font({ size: 30, textAlign: TextAlign.Center }) })
    let nameTagGraphics = new GraphicsComponent();
    nameTagGraphics.anchor = vec(0.5, 0.5)
    nameTagGraphics.use(nameTag)

    let nameTagEntity = new Entity();
    nameTagEntity.addComponent(nameTagGraphics)
    nameTagEntity.addComponent(new TransformComponent())
    entity.addChild(nameTagEntity)

    return entity
}



export class OtherPlayerMoveSystem extends System {
    systemType = SystemType.Draw;

    query: Query<typeof TransformComponent | typeof OtherPlayerComponent>;

    constructor(world: World) {
        super();
        this.query = world.query([TransformComponent, OtherPlayerComponent]);
    }

    update(elapsedMs: number): void {

        for (let entity of this.query.entities) {
            let player = entity.get(OtherPlayerComponent);
            let state = Networking.client.room!.state.players.get(player.id)
            if (state) {

                const lerp = (x: number, y: number, a: number) => x * (1 - a) + y * a;

                entity.get(TransformComponent).pos.x = lerp(entity.get(TransformComponent).pos.x, state.position.x, elapsedMs / 50)
                entity.get(TransformComponent).pos.y = lerp(entity.get(TransformComponent).pos.y, state.position.y, elapsedMs / 50)
            }
        }
    }
}
