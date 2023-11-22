const charInfo = new Map();
charInfo.axeIndex = dw.c.toolBag.findIndex(i => i.md === 'axe');

const localConstants = new Map();
localConstants.MAX_CHOPS = 6;

var currentTrees = [];
var targetTree = null;
var lastTime = new Date();
var chopCount = 0;

function log(msg) {
    dw.log(msg);
}

function chopTree(tree) {
    // Make sure we have an axe & a tree.
    if (charInfo.axeIndex == -1 && tree != null) {
        log("No axe found, or no tree to chop.");
        return;
    }

    // Make sure we're close enough to the tree.
    if (dw.distance(dw.c, tree) > dw.constants.RANGE_MELEE_BASE) {
        log("Too far away from the tree, moving to it.");
        // Move to the tree.
        dw.move(tree.x, tree.y);
        // Set target.
        dw.setTarget(tree.id);
        return;
    } else {
        // Stop chopping if we've done it too many times.
        log("Tree HP: " + tree.hp + ", chop count: " + chopCount + ", max chops: " + localConstants.MAX_CHOPS)
        if (tree.hp <= 0 || chopCount > localConstants.MAX_CHOPS) {
            log("Stopping chopping, too many times.");
            targetTree = null;
            chopCount = 0;
            return;
        }

        log("Close enough to the tree, attempting to chop.");
        try {
            // setTimeout(dw.chop, chopCount+dw.constants.GCD_BASE, charInfo.axeIndex, tree.id);
            if (new Date() - lastTime > dw.constants.GCD_MIN) {
                dw.chop(charInfo.axeIndex, tree.id);
                lastTime = new Date();
                chopCount += 1;
            }
        } catch (error) {
            log("Tree is dead, removing it from the list. " + JSON.stringify(error));
            // Remove the tree from the list.
            targetTree = null;
            chopCount = 0;
            return;
        }
    }
}

const Debug = new Map();


/// Debug function to log all entities.
Debug.debug_LogAllEntities = function debug_LogAllEntities() {
    log("dw.e: " + JSON.stringify(dw.e));
    // console.log("dw.md.entities: " + JSON.stringify(dw.md.entities));
}

/// Find all the trees possible.
function getAllTrees() {
    return dw.findEntities(e => e.tree == true);
}

/// Main loop.
setInterval(function () {
    // If we have no current trees, attempt to find some.
    if (currentTrees.length == 0) {
        currentTrees = getAllTrees();
    }
    if (targetTree == null) {
        // Get the first item in the array.
        targetTree = currentTrees.shift();
    }

    // Debug.debug_LogAllEntities();

    chopTree(targetTree);
}, 250);