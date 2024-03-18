export class RepairManager {
    // public repair() {
    //     var count = 0;
    //     var wrenchIndex = dw.c.toolBag.findIndex(i => i.md == "wrench");
    //     dw.e.forEach(e => {
    //         if (dw.distance(e, dw.c) > dw.constants.INTERACT_RANGE) { 
    //             return;
    //         }
    //         if (e.owner==1) {
    //             if (e.hp < 95) {
    //                 console.log(`Queueing repair of ${e.md}`); 
    //                 setTimeout(dw.repair, count * 1505, wrenchIndex, e.id);
    //                 count += 1;
    //             }
    //         }
    //     }
    // }

    public repair() {
        const wrenchIndex = dw.c.toolBag.findIndex(i => i.md === 'wrench')
        for (let i = 0; i < dw.e.length; i++) {
          const e = dw.e[i]
          if (!('station' in e) || !('owner' in e) || !e.owner || e.hp > 99 || e.z !== dw.c.z) continue
      
          if (dw.distance(dw.c.x, dw.c.y, e.x, e.y) > dw.constants.INTERACT_RANGE) {
            console.log(`Moving to  ${e.md}#${e.id} (${e.x}, ${e.y}, ${e.z})`)
            dw.move(e.x, e.y)
            setTimeout(repair, 1000)
            return
          }
      
          if (dw.isSkillReady()) {
            console.log(`Repairing  ${e.md}#${e.id} (${e.x}, ${e.y}, ${e.z})`)
            dw.repair(wrenchIndex, e.id)
          }
          setTimeout(this.repair, 1000)
          return
        }
      }
}