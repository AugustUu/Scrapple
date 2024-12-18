import { Gun } from "./Gun";

export class Rifle extends Gun {

    constructor(){
        super("rifle", 5, 0.1, 3, 30, 5, 1, true)
    }
}