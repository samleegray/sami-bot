import './debug';
import { CombatManager } from './combat';
import { GatheringManager } from './gather';
import { exploreLoop } from "./explore";
import '../ui-minimap';
import '../ui-nameplates';
import '../ui-stats-panel';
import '../ui-breadcrumbs';
import '../ui-line-of-sight'
import '../ui-collision-boxes'

const gatheringManager = new GatheringManager();
const combatManager = new CombatManager();
// Set to true if we only want to defend ourselves.
combatManager.defenseMode = false;
let shouldGather = true;
let shouldAttack = true;

var mouseKeyDown = false;

// Main loop with all logic contained within.
function mainLoop() {
    if (mouseKeyDown) {
        return;
    }

    // dw.setSpawn();

    // If we're in combat, only focus on combat.
    if (combatManager.isInCombat()) {//|| !gatheringManager.hasGatherTarget) {
        combatManager.combatLoop();
        return;
    }

    // console.log("chunks: " + JSON.stringify(dw.chunks));

    // If we should gather, try to.
    if (shouldGather) {
        gatheringManager.gatherLoop();
    }

    // If we're not in defense mode, and have no gathering target proceed to combat.
    if (!combatManager.defenseMode && shouldAttack && !gatheringManager.hasGatherTarget) {
        combatManager.combatLoop();
    }

    if (!combatManager.isInCombat() && !combatManager.hasTarget && !gatheringManager.hasGatherTarget) {
        exploreLoop();
    }

    // console.log("keydown: " + JSON.stringify(keydown));
    // Make sure we're not in combat while gathering.
    // if (!combatManager.isInCombat()) {
    //     gatheringManager.gatherLoop();
    // }
    // console.log("dw.e: " + JSON.stringify(dw.e));
}

dw.on('keydown', (e) => {
    console.log("keydown: " + JSON.stringify(e));
});

setInterval(mainLoop, 250);
