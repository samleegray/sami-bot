import { EntityCache } from "./entityCache";

const entityCache = new EntityCache();

export class TargetManager {
    hasGatherTarget = false;
    hasEnemyTarget = false;

    private getClosestMonster() {
        return dw.findClosestMonster();
    }

    private getClosestGathering()  {
        entityCache.updateCachedItems();

        // Get the first item in the array.
        let targetTree = entityCache.cachedTrees.shift();
        let targetOre = entityCache.cachedOres.shift();

        // Get the distances to compare later.
        let distanceToTree = 1000;
        if (targetTree != null) {
            distanceToTree = dw.distance(dw.c.x, dw.c.y, targetTree.x, targetTree.y);
        }
        let dinstanceToOre =  1000;
        if (targetOre != null) {
            dinstanceToOre = dw.distance(dw.c.x, dw.c.y, targetOre.x, targetOre.y);
        }

        this.hasGatherTarget = targetTree != null || targetOre != null;

        // console.log("dw.e: " + JSON.stringify(dw.e));

        if (this.hasGatherTarget) {
            // console.log("Attempting to gather.");
            if (targetTree != null && distanceToTree < dinstanceToOre) {
                return targetTree
            } else if (targetOre != null && dinstanceToOre < distanceToTree) {
                // console.log("Attempting to gather ore.");
                return targetOre
            }
            // console.log("targetTree: " + JSON.stringify(this.targetTree));
        }
    }

    // Get the next target. Gathering or monster.
    public nextTarget() {
        const closestMonster = this.getClosestMonster();
        const closestGathering = this.getClosestGathering();

        this.hasEnemyTarget = closestMonster != null
        this.hasGatherTarget = closestGathering;

        // if (this.hasGatherTarget) {
        //     return closestGathering
        // }

        if (this.hasEnemyTarget) {
            return closestMonster
        }

        return closestGathering;
    }
}
