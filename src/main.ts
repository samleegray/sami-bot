import { CombatManager } from "./combat";

let combatManager = new CombatManager();

function mainLoop() {
  // ...
  // This is the main loop of the game
  // ...
  combatManager.combat();
}

// Start the main loop.
setInterval(mainLoop, 250);