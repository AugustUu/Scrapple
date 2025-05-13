import { Loader, ImageSource, Sound} from "excalibur"
import { engine } from ".";

export const Images = {
    char1: new ImageSource("/Art/Character.png"),
    char2: new ImageSource("/Art/Green.png"),
    PlayerFill: new ImageSource("/Art/Player/Fill.png"),
    PlayerOverlay: new ImageSource("/Art/Player/Outline.png"),

} as const

export const Sounds = {
    shotgunFire: new Sound("/Sound/Gun/Shotgun.mp3")

} as const

