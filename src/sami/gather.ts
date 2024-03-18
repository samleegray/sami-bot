import { EntityCache } from "./entityCache";

const entityCache = new EntityCache();

export class GatheringManager {
    private axeIndex = dw.c.toolBag.findIndex((i) => i?.md === 'axe')
    private pickaxeIndex = dw.c.toolBag.findIndex(i => i?.md === 'pickaxe');

    public hasGatherTarget = false;

    private gather(tree: any, ore: any) {
        // Make sure we have an axe & a tree.
        if (this.axeIndex == -1 && tree != null) {
            console.log("No axe found, or no tree to chop.");
            return;
        }
        var object = tree;
        if (tree == null && ore != null) {
            object = ore;
        } else if (tree != null && ore == null) {
            object = tree;
        }

        // Taget the object.
        dw.setTarget(object.id);
        console.log("Setting target...")

        // Make sure we're close enough to the tree.
        if (dw.distance(dw.c.x, dw.c.y, object.x, object.y) > dw.constants.RANGE_MELEE_BASE) {
            // Move to the tree.
            dw.move(object.x, object.y);
            return;
        } else {
            console.log("Close enough to the object, attempting to gather.");
            // Gather the object.
            if (dw.canUseSkillCd()) {
                if (object == tree) {
                    console.log("Chopping...")
                    dw.chop(this.axeIndex, tree.id);
                } else if (object == ore) {
                    dw.mine(this.pickaxeIndex, ore.id);
                }
            }
        }
    }

    public gatherLoop() {
        // console.log("dw.e: " + JSON.stringify(dw.e));
        // If we have no current trees, attempt to find some.

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
        // console.log(`distanceToTree: ${distanceToTree}, dinstanceToOre: ${dinstanceToOre}`);

        this.hasGatherTarget = targetTree != null || targetOre != null;

        // console.log("dw.e: " + JSON.stringify(dw.e));

        if (this.hasGatherTarget) {
            // console.log("Attempting to gather.");
            if (targetTree != null && distanceToTree < dinstanceToOre) {
                this.gather(targetTree, null);
            } else if (targetOre != null && dinstanceToOre < distanceToTree) {
                // console.log("Attempting to gather ore.");
                this.gather(null, targetOre);
            }
            // console.log("targetTree: " + JSON.stringify(this.targetTree));
        }
    }
}
