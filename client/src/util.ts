import { TransformComponent, Vector } from "excalibur";

export function createTransformComponent(position:Vector){
    let transform = new TransformComponent();
    transform.pos = position
    return transform
}