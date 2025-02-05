import { ColliderDesc, JointData, RigidBody, RigidBodyType } from "@dimforge/rapier2d-compat";
import { Circle, Color, Entity, Graphic, GraphicsComponent, PointerButton, Rectangle, TransformComponent, Vector } from "excalibur";
import { PhysicsSystem } from "./physics/PhysicsSystems";
import { engine } from ".";
import { ColliderComponent, RigidBodyComponent } from "./physics/PhysicsComponents";

export function createTransformComponent(position: Vector) {
    let transform = new TransformComponent();
    transform.pos = position
    return transform
}

export class Vector2 {
    x: number;
    y: number;
    constructor(values: { x: number, y: number }) {
        this.x = values.x;
        this.y = values.y;

    }

    static new(x: number, y: number) {
        return new Vector2({ x: x, y: y })
    }

    public magnitude() {
        return (Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2)));
    }

    public normalized() {
        var magnitude = this.magnitude();
        return (new Vector2({ x: this.x / magnitude, y: this.y / magnitude }));
    }

    public add(adding: { x: number, y: number }) {
        return (new Vector2({ x: this.x + adding.x, y: this.y + adding.y }))
    }

    public sub(subtracting: { x: number, y: number }) {
        return (new Vector2({ x: this.x - subtracting.x, y: this.y - subtracting.y }))
    }

    public scale(multiplicand: number) {
        return (new Vector2({ x: this.x * multiplicand, y: this.y * multiplicand }))
    }


    public rotate(radians: number) {
        let angle = Math.atan2(this.y, this.x)
        angle += radians
        let rot_angle = new Vector2({ x: Math.cos(angle), y: Math.sin(angle) })
        return rot_angle.scale(this.magnitude())
    }
}

export class MathUtils {
    static excToRapier(pos: { x: number, y: number }) {
        return new Vector2({ x: pos.x * 0.1, y: pos.y * -0.1 })
    }

    static rapierToExc(pos: { x: number, y: number }) {
        return new Vector2({ x: pos.x * 10, y: pos.y * -10 })
    }

    static clamp(num: number, min: number, max: number) {
        return Math.max(Math.min(num, max), min)
    }
}

export function generateRevoluteJoint(target: RigidBody | null, rb: RigidBody, hitPoint: { x: number, y: number }) {
    if (target != null) { // should never be null?
        let hit_point_vector = new Vector2(hitPoint)
        let start_offset = hit_point_vector.sub(rb.translation())
        start_offset = start_offset.rotate(-rb.rotation())
        let end_offset = hit_point_vector.sub(target.translation())
        end_offset = end_offset.rotate(-target.rotation())
        let params = JointData.revolute(start_offset, end_offset);
        return PhysicsSystem.physicsWorld.createImpulseJoint(params, rb, target, true);
    }
}

export class MouseInput { // USELESS CODE!!!!!!!!!!!!!!!!!!!!
    static mouseButtons = { left: false, right: false }

    static init() {
        engine.input.pointers.primary.on('down', (evt) => {
            if (evt.button == PointerButton.Left) {
                this.mouseButtons.left = true
            }
            if (evt.button == PointerButton.Right) {
                this.mouseButtons.right = true
            }
        })
        engine.input.pointers.primary.on('up', (evt) => {
            if (evt.button == PointerButton.Left) {
                this.mouseButtons.left = false
            }
            if (evt.button == PointerButton.Right) {
                this.mouseButtons.right = false
            }
        })
    }
}

export function lerp(x: number, y: number, a: number) {
    return x * (1 - a) + y * a;
}

export type Shape =
    | { type: 'Circle', radius: number }
    | { type: 'Rectangle', width: number, height: number }
    | { type: 'Triangle', point1: Vector, point2: Vector, point3: Vector };


export function createGroundShape(x: number, y: number, color: Color, shape: Shape): Entity {
    let sprite: Graphic
    let floor = new Entity()
    if (shape.type == "Rectangle") {
        let colliderDesc = ColliderDesc.cuboid(shape.width, shape.height).setCollisionGroups(0x00010007).setFriction(0.5)
        floor
            .addComponent(createTransformComponent(new Vector(x, y)))
            .addComponent(new RigidBodyComponent(RigidBodyType.KinematicPositionBased))
            .addComponent(new ColliderComponent(colliderDesc))

        sprite = new Rectangle({ width: shape.width * 20, height: shape.height * 20, color: color })

        let graphics = new GraphicsComponent();
        graphics.add(sprite);

        floor.addComponent(graphics)

    }
    if (shape.type == "Circle") {
        let colliderDesc = ColliderDesc.ball(shape.radius).setCollisionGroups(0x00010007).setFriction(0.5)
        floor
            .addComponent(createTransformComponent(new Vector(x, y)))
            .addComponent(new RigidBodyComponent(RigidBodyType.KinematicPositionBased))
            .addComponent(new ColliderComponent(colliderDesc))

        sprite = new Circle({ radius: shape.radius * 10, color: color })

        let graphics = new GraphicsComponent();
        graphics.add(sprite);

        floor.addComponent(graphics)

    }

    if (shape.type == "Triangle") {
        let colliderDesc = ColliderDesc.triangle(shape.point1, shape.point2, shape.point3).setCollisionGroups(0x00010007).setFriction(0.5)
        floor
            .addComponent(createTransformComponent(new Vector(x, y)))
            .addComponent(new RigidBodyComponent(RigidBodyType.KinematicPositionBased))
            .addComponent(new ColliderComponent(colliderDesc))

        //sprite = new Polygon({ points: vector1, color: color })

        let graphics = new GraphicsComponent();
        graphics.add(sprite);

        floor.addComponent(graphics)

    }

    return floor

}