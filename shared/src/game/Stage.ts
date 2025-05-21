import { Guns } from "./GunManager/GunManager";
import { Upgrades } from "./UpgradeManager/UpgradeManager";
import { CircleCollider, Collider, Position, RectangleCollider } from "../../../server/src/State";


export class Stage{
    colliderList: Array<Collider>
    spawnPosList: Array<Position>

    constructor(colliderList: Array<Collider>, spawnPosList: Array<Position>){
        this.colliderList = colliderList
        this.spawnPosList = spawnPosList
    }
}


export const stageList: Map<string, Stage> = new Map()

export function initStages(){
    stageList.set("stage1", new Stage(
        new Array<Collider>(
            new RectangleCollider(0, 500, 50, 5),
            new RectangleCollider(700, 100, 20, 5),
            new RectangleCollider(-700, 100, 20, 5),
            new CircleCollider(-200, -300, 5),
            new CircleCollider(200, -300, 5)
        ),
        new Array<Position>(
            new Position(200, -400),
            new Position(-200, -400),
            new Position(-300, 350),
            new Position(300, 350),
            new Position(600, -50),
            new Position(800, -50),
            new Position(-600, -50),
            new Position(-800, -50)
        )
    ))

    stageList.set("stage2", new Stage(
        new Array<Collider>(
            new RectangleCollider(0, 500, 50, 5),
            new RectangleCollider(900, 200, 20, 5),
            new RectangleCollider(-900, 200, 20, 5),
            new RectangleCollider(600, -200, 5, 30),
            new RectangleCollider(-600, -200, 5, 30),
            new CircleCollider(-700, 800, 5),
            new CircleCollider(700, 800, 5)
        ),
        new Array<Position>(
            new Position(-350, 350),
            new Position(350, 350),
            new Position(-800, 50),
            new Position(-1000, 50),
            new Position(800, 50),
            new Position(1000, 50),
            new Position(700, 700),
            new Position(-700, 700)
        )
    ))

    stageList.set("stage3", new Stage(
        new Array<Collider>(
            new RectangleCollider(600, 800, 15, 5),
            new RectangleCollider(-600, 800, 15, 5),
            new RectangleCollider(600, 200, 20, 5),
            new RectangleCollider(-600, 200, 20, 5),
            new RectangleCollider(600, 500, 5, 30),
            new RectangleCollider(-600, 500, 5, 30),
            new CircleCollider(-1100, 500, 5),
            new CircleCollider(1100, 500, 5)
        ),
        new Array<Position>(
            new Position(-600, 50),
            new Position(-700, 650),
            new Position(-500, 650),
            new Position(600, 50),
            new Position(-1100, 350),
            new Position(1100, 350),
            new Position(700, 650),
            new Position(500, 650)
        )
    ))

    stageList.set("stage4", new Stage(
        new Array<Collider>(
            new RectangleCollider(0, 1600, 45, 4),
            new RectangleCollider(0, 1200, 45, 4),
            new RectangleCollider(0, 800, 45, 4),
            new RectangleCollider(0, 400, 45, 4),
            new RectangleCollider(0, 0, 45, 4),
            new RectangleCollider(0, -400, 45, 4),
            new RectangleCollider(0, -800, 45, 4),
            new RectangleCollider(0, -1200, 45, 4),
            new RectangleCollider(0, -1600, 45, 4)
        ),
        new Array<Position>(
            new Position(0, 1450),
            new Position(0, 1050),
            new Position(0, 650),
            new Position(0, 250),
            new Position(0, -150),
            new Position(0, -550),
            new Position(0, -950),
            new Position(0, -1350)
        )
    ))

    stageList.set("stage5", new Stage(
        new Array<Collider>(
            new RectangleCollider(0, 0, 8, 8),
            new RectangleCollider(800, 0, 8, 8),
            new RectangleCollider(-800, 0, 8, 8),
            new RectangleCollider(0, 800, 8, 8),
            new RectangleCollider(0, -800, 8, 8),
            new RectangleCollider(800, 800, 8, 8),
            new RectangleCollider(-800, 800, 8, 8),
            new RectangleCollider(800, -800, 8, 8),
            new RectangleCollider(-800, -800, 8, 8),
            new RectangleCollider(400, 400, 4, 4),
            new RectangleCollider(-400, 400, 4, 4),
            new RectangleCollider(400, -400, 4, 4),
            new RectangleCollider(-400, -400, 4, 4)
        ),
        new Array<Position>(
            new Position(800, -200),
            new Position(-800, -200),
            new Position(0, 600),
            new Position(800, 600),
            new Position(-800, 600),
            new Position(0, -1000),
            new Position(800, -1000),
            new Position(-800, -1000)
        )
    ))

    stageList.set("stage6", new Stage(
        new Array<Collider>(
            new RectangleCollider(0, 0, 5, 5),
            new RectangleCollider(0, -300, 5, 30),
            new RectangleCollider(200, 0, 20, 5),
            new CircleCollider(692.8, 400, 8),
            new CircleCollider(-692.8, 400, 8),
            new CircleCollider(692.8, -400, 8),
            new CircleCollider(-692.8, -400, 8),
            new CircleCollider(400, 692.8, 8),
            new CircleCollider(-400, 692.8, 8),
            new CircleCollider(400, -692.8, 8),
            new CircleCollider(-400, -692.8, 8),
            new CircleCollider(800, 0, 8),
            new CircleCollider(0, 800, 8),
            new CircleCollider(-800, 0, 8),
            new CircleCollider(0, -800, 8)
        ),
        new Array<Position>(
            new Position(220, -150),
            new Position(0, -675),
            new Position(800, -150),
            new Position(692.8, -550),
            new Position(692.8, 250),
            new Position(-800, -150),
            new Position(-692.8, -550),
            new Position(-692.8, 250)
        )
    ))

    stageList.set("stage7", new Stage(
        new Array<Collider>(
            new CircleCollider(0, 0, 8),
            new RectangleCollider(0, -400, 40, 8),
            new RectangleCollider(0, 400, 40, 8),
            new RectangleCollider(400, 290, 8, 19),
            new RectangleCollider(400, -290, 8, 19),
            new RectangleCollider(-400, 290, 8, 19),
            new RectangleCollider(-400, -290, 8, 19)
        ),
        new Array<Position>(
            new Position(0, -150),
            new Position(230, 250),
            new Position(0, 250),
            new Position(-230, 250),
            new Position(-400, 20),
            new Position(400, 20),
            new Position(-250, -550),
            new Position(250, -550)
        )
    ))
}