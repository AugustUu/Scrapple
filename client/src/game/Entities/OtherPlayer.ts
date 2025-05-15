import { Circle, Color, Component, CoordPlane, Entity, Font, GraphicsComponent, GraphicsGroup, Query, Rectangle, Sprite, System, SystemType, Text, TextAlign, TransformComponent, vec, Vector, World } from "excalibur";
import { Networking } from "../../networking/Networking";
import { lerp, Vector2 } from "../../util";
import { Player } from "server/src/State";
import { engine } from "../..";
import { CreateGrappleLine } from "./GrappleLine";
import { Images } from "../../Resources";

export class OtherPlayerComponent extends Component {
    public name: string = 'jorbis';
    public id: string = "";
    public grappleLine?: Entity;
    public healthBar: Entity;
    public nameTag: Entity;

    

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

    let playerData = entity.get(OtherPlayerComponent);

    //let sprite = new Circle({ radius: Networking.client.room.state.players.get(id).radius, color: Color.fromHex(Networking.client.room.state.clients.get(id).color) })

    let radius = Networking.client.room.state.players.get(id).radius;

    let graphics = new GraphicsComponent();

    let image = Images.PlayerOverlay
    let image2 = Images.PlayerFill

    let playerSprite: Sprite
    let playerSprite2: Sprite
    if (image.isLoaded() && image2.isLoaded()){
        playerSprite = new Sprite({
            image: image,
            destSize: {
                width: 2*radius,
                height: 2*radius
            }
        })

        playerSprite2 = new Sprite({
            image: image2,
            destSize: {
                width: 2*radius,
                height: 2*radius
            }
        })

    }
    else{
        console.log("attempted to use unloaded sprite")
    }

    playerSprite2.tint = Color.fromHex(Networking.client.room.state.clients.get(id).color)

    graphics.add(new GraphicsGroup({
        members: [
          { graphic: playerSprite2, offset: vec(0, 0)},
          { graphic: playerSprite, offset: vec(0, 0)}
        ]
      }));
    

    entity.addComponent(graphics)

    let transform = new TransformComponent();
    transform.coordPlane = CoordPlane.World;
    transform.pos = vec(playerState.position.x, playerState.position.y);

    entity.addComponent(transform);

    let nameTag = new Text({ text: playerState.name, font: new Font({ size: 15, textAlign: TextAlign.Left }) })
    let nameTagGraphics = new GraphicsComponent();
    nameTagGraphics.use(nameTag)
    nameTagGraphics.current.transform.setPosition(0, -40)
    let nameTagTransform = new TransformComponent();

    let nameTagEntity = new Entity()
    .addComponent(nameTagGraphics)
    .addComponent(nameTagTransform)
    engine.add(nameTagEntity)
    playerData.nameTag = nameTagEntity
    

    let healthBar = new Rectangle({ width: 50, height: 5, color: new Color(0, 255, 0) })
    let healthBarGraphics = new GraphicsComponent();
    healthBarGraphics.add(healthBar)
    healthBarGraphics.current.transform.setPosition(0, -28)
    
    
    let healthBarTransform = new TransformComponent();
    
    let healthBarEntity = new Entity({name: "healthBar"})
    .addComponent(healthBarGraphics)
    .addComponent(healthBarTransform)
    engine.add(healthBarEntity)
    playerData.healthBar = healthBarEntity


    playerState.listen("grappling", (value: boolean, previousValue: boolean) => {

        let playerData = entity.get(OtherPlayerComponent);

        if (value) {
            let grapple = CreateGrappleLine(entity, new Vector(playerState.grappleX, playerState.grappleY ))
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
                let entityTransform = entity.get(TransformComponent)
                entityTransform.pos.x = state.position.x //lerp(entity.get(TransformComponent).pos.x, state.position.x, elapsedMs / 120)
                entityTransform.pos.y = state.position.y //lerp(entity.get(TransformComponent).pos.y, state.position.y, elapsedMs / 120)
                entityTransform.rotation = state.rotation
                player.healthBar.get(TransformComponent).pos = new Vector(entityTransform.pos.x, entityTransform.pos.y - 28)
                player.nameTag.get(TransformComponent).pos = new Vector(entityTransform.pos.x, entityTransform.pos.y - 40)
                //console.log(entity.get(OtherPlayerComponent).health)
                player.healthBar.get(GraphicsComponent).current.scale.x = state.health / 100
            }
        }
    }
}
