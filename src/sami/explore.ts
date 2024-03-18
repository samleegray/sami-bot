import { getClosestBreadcrumb } from '../breadcrumbs'

// Function to breadcrumbs and begin following them.

//

var nextLocation = null;
// Function to deduce next determined location.
function getNextLocation() {
    // Get a random number between -2 and 2.
    let rand = Math.floor(Math.random() * 10) - 5;
    let rand2 = Math.floor(Math.random() * 10) - 5;

    let closet = getClosestBreadcrumb(dw.c.x + rand, dw.c.y + rand2, dw.c.z);

    closet.x = dw.c.x + rand;
    closet.y = dw.c.y + rand2;

    nextLocation = closet;
    return closet;
}

setInterval(getNextLocation, 2000)

export function exploreLoop() {
    // dw.log('Exploring...x: ' + nextLocation.x + ' y: ' + nextLocation.y + ' z: ' + nextLocation.z);
    dw.move(nextLocation.x, nextLocation.y);
}
