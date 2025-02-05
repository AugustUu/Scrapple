import { Circle, Color, Component, CoordPlane, Entity, Font, GraphicsComponent, GraphicsGroup, Query, Rectangle, System, SystemType, Text, TextAlign, TransformComponent, vec, Vector, World } from "excalibur";
import { Networking } from "../../networking/Networking";
import { lerp, Vector2 } from "../../util";
import { Player } from "server/src/State";
import { engine } from "../..";
import { CreateGrappleLine } from "./GrappleLine";

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



export function createOtherPlayerEntity(playerState: Player, id: string): Entity {
    const entity = new Entity({
        name: 'Player ' + name,
    });

    entity.addComponent(new OtherPlayerComponent(playerState.name, id))

    let sprite = new Circle({ radius: 20, color: Color.Red })

    let graphics = new GraphicsComponent();
    graphics.use(sprite);

    entity.addComponent(graphics)

    let transform = new TransformComponent();
    transform.coordPlane = CoordPlane.World;
    transform.pos = vec(playerState.position.x, playerState.position.y);

    entity.addComponent(transform);

    let nameTag = new Text({ text: playerState.name, font: new Font({ size: 15, textAlign: TextAlign.Left }) })
    let nameTagGraphics = new GraphicsComponent();
    nameTagGraphics.use(nameTag)
    let nameTagTransform = new TransformComponent();
    nameTagTransform.pos.y -= 30

    let nameTagEntity = new Entity();
    nameTagEntity.addComponent(nameTagGraphics)
    nameTagEntity.addComponent(nameTagTransform)
    entity.addChild(nameTagEntity)

    playerState.listen("grappling", (value: boolean, previousValue: boolean) => {

        let playerData = entity.get(OtherPlayerComponent);

        if (value) {
            let grapple = CreateGrappleLine(entity, new Vector2({ x: playerState.grappleX, y: playerState.grappleY }))
            engine.add(grapple);
            playerData.grappleLine = grapple;
        } else {
            playerData.grappleLine?.kill()

        }
    })

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


                entity.get(TransformComponent).pos.x = state.position.x //lerp(entity.get(TransformComponent).pos.x, state.position.x, elapsedMs / 120)
                entity.get(TransformComponent).pos.y = state.position.y //lerp(entity.get(TransformComponent).pos.y, state.position.y, elapsedMs / 120)
            }
        }
    }
}
