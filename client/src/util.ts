import { TransformComponent, Vector } from "excalibur";

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
        return new Vector2(pos).scale(0.1)
    }

    static rapierToExc(pos: {x: number, y: number}){
        return new Vector2(pos).scale(10)
    }
}