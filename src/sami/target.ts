export class TargetManager {
    private getClosestMonster() {
        return dw.findClosestMonster();
    }
    
    public nextTarget() {
        const target = this.getClosestMonster();
        
        if (!target) {
            return;
        }
    
        dw.setTarget(target.id);

        return target;
    }
}