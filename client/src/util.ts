import { JointData, RigidBody } from "@dimforge/rapier2d-compat";
import { PointerButton, TransformComponent, Vector } from "excalibur";
import { PhysicsSystem } from "./physics/PhysicsSystems";
import { engine } from ".";

export function createTransformComponent(position:Vector){
    let transform = new TransformComponent();
    transform.pos = position
    return transform
}

export class Vector2 {
    x: number;
    y: number;
    constructor(values: {x: number, y: number}) {
        this.x = values.x;
        this.y = values.y;

    }

    static new(x:number,y:number) {
        return new Vector2({x: x, y: y})
    }

    public magnitude() {
        return (Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2)));
    }

    public normalized() {
        var magnitude = this.magnitude();
        return (new Vector2({x:this.x / magnitude, y:this.y / magnitude}));
    }

    public add(adding: {x: number, y: number}){
        return (new Vector2({x:this.x + adding.x, y:this.y + adding.y}))
    }

    public sub(subtracting: {x: number, y: number}){
        return (new Vector2({x:this.x - subtracting.x, y:this.y - subtracting.y}))
    }

    public scale(multiplicand: number) {
        return (new Vector2({x:this.x * multiplicand, y:this.y * multiplicand}))
    }

    
    public rotate(radians: number) {
        let angle = Math.atan2(this.y, this.x)
        angle += radians
        let rot_angle = new Vector2({x:Math.cos(angle), y:Math.sin(angle)})
        return rot_angle.scale(this.magnitude())
    }
}

export class MathUtils {
    static excToRapier(pos: {x: number, y: number}){
        return new Vector2({x:pos.x * 0.1, y:pos.y * -0.1})
    }

    static rapierToExc(pos: {x: number, y: number}){
        return new Vector2({x:pos.x * 10, y:pos.y * -10})
    }

    static clamp(num: number, min: number, max: number){
        return Math.max(Math.min(num, max), min)
    }
}

export function generateRevoluteJoint(target: RigidBody | null, rb: RigidBody, hitPoint: {x:number, y:number}) {
    if(target != null){ // should never be null?
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
    static mouseButtons = {left: false, right: false}

    static init() {
        engine.input.pointers.primary.on('down', (evt) => {
            if(evt.button == PointerButton.Left){
                this.mouseButtons.left = true
            }
            if(evt.button == PointerButton.Right){
                this.mouseButtons.right = true
            }
        })
        engine.input.pointers.primary.on('up', (evt) => {
            if(evt.button == PointerButton.Left){
                this.mouseButtons.left = false
            }
            if(evt.button == PointerButton.Right){
                this.mouseButtons.right = false
            }
        })
    }
}

export function lerp(x: number, y: number, a: number){
    return x * (1 - a) + y * a;
}