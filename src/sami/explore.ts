import { getClosestBreadcrumb } from './traversal'

// Variable to store the next determined location.
var nextLocation: { x: any; y: any; z?: number; value?: number; time?: number; } | null = null;

// Function to deduce next determined location.
function getNextLocation() {
    // Get a random number between -2 and 2.
    let randX = Math.floor(Math.random() * 10) - 5;
    let randY = Math.floor(Math.random() * 10) - 5;

    let closet = getClosestBreadcrumb(dw.c.x + randX, dw.c.y + randY, dw.c.z);

    nextLocation = closet;
    return closet;
}

setInterval(getNextLocation, 2000)

export function exploreLoop() {
    // dw.log('Exploring...x: ' + nextLocation.x + ' y: ' + nextLocation.y + ' z: ' + nextLocation.z);
    dw.move(nextLocation.x, nextLocation.y);
}
