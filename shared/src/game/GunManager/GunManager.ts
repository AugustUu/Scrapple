import { Gun } from "./Gun";



export const Guns: Map<string, Gun> = new Map()

export function registerGun(target: typeof Gun) {
    let gun = new target();
    //console.log("registered gun", gun)
    Guns.set(target.name, gun)
}

const gunFiles = require.context("./Guns", true, /\.ts$/,"eager");
gunFiles.keys().forEach((file: string) => {
    import(/* webpackMode: "eager" */`./Guns/${file.split("./")[1]}`)
});
