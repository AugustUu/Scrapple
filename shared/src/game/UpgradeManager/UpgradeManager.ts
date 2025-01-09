import { Upgrade } from "./Upgrade";

export const Upgrades: Map<string,Upgrade> = new Map()

export function registerUpgrade(upgradeType: typeof Upgrade) {
    let upgrade = new upgradeType();
    //console.log("registered upgrade", upgrade)
    Upgrades.set(upgradeType.name,upgrade)
}

const upgradeFiles = require.context("./Upgrades", true, /\.ts$/,"eager");
upgradeFiles.keys().forEach((file: string) => {
    import(/* webpackMode: "eager" */`./Upgrades/${file.split("./")[1]}`)
});
