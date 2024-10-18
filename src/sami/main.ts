import './debug';
import { CombatManager } from './combat';
import { GatheringManager } from './gather';
import './traversal';
import '../ui-minimap';
import '../ui-nameplates';
import '../ui-stats-panel';
import '../ui-breadcrumbs';
import '../ui-line-of-sight'
import '../ui-collision-boxes'
import '../ui-xp-tracker'
// import '../ui-monster-distance'
import {traversalLoop} from "./traversal";

const gatheringManager = new GatheringManager()
const combatManager = new CombatManager()
// Set to true if we only want to defend ourselves.
combatManager.defenseMode = false
let shouldAttack = true
let shouldExplore = true

var mouseKeyDown = false

// Main loop with all logic contained within.
function mainLoop() {
    if (mouseKeyDown) {
        return
    }

    // dw.setSpawn();

    // If we're in combat, only focus on combat.
    if (combatManager.isInCombat()) {//|| !gatheringManager.hasGatherTarget) {
        combatManager.combatLoop()
        return
    }

    // console.log("chunks: " + JSON.stringify(dw.chunks));

    // If we should gather, try to.
    // if (shouldGather) {
    //     gatheringManager.gatherLoop()
    // }
    //
    // // If we're not in defense mode, and have no gathering target proceed to combat.
    if (!combatManager.defenseMode && shouldAttack && !gatheringManager.hasGatherTarget) {
        // console.log("attacking");
        combatManager.combatLoop();
    }

    // if (shouldExplore && !combatManager.isInCombat() && !gatheringManager.hasGatherTarget) {
    //     // console.log("exploring");
    //     traversalLoop()
    //     // exploreLoop();
    // } else {
    //     console.log("not exploring hasTarget: " + combatManager.hasTarget + " isInCombat: " + combatManager.isInCombat() + " hasGatherTarget: " + gatheringManager.hasGatherTarget);
    // }

    if (!combatManager.defenseMode && shouldAttack) {
        // console.log("attacking");
        combatManager.combatLoop();
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
