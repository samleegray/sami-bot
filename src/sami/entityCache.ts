/// Entity mapping & caching.
export class EntityCache {
    public cachedTrees: any[];
    public cachedOres: any[];
    public cachedOthers: any[];

    constructor() {
        this.cachedTrees = this.mapItems(true, dw.c, this.getAllTrees());
        this.cachedOres = this.mapItems(true, dw.c, this.getAllOres());
        this.cachedOthers = this.mapItems(true, dw.c, this.getAllOthers());
    }

    public updateCachedItems() {
        this.cachedTrees = this.mapItems(true, dw.c, this.getAllTrees());
        this.cachedOres = this.mapItems(true, dw.c, this.getAllOres());
        this.cachedOthers = this.mapItems(true, dw.c, this.getAllOthers());
        // console.log('Cached items updated. Others: ' + JSON.stringify(this.cachedOthers));
    }

    private getAllTrees() {
        return dw.findEntities(e => 'tree' in e && e.z == dw.c.z);
    }

    private getAllOres() {
        return dw.findEntities(e => 'ore' in e && e.z == dw.c.z);
    }

    private getAllOthers() {
        return dw.findEntities(e => 'tree' in e == false && 'ore' in e == false && e.z == dw.c.z);
    }

    private mapItems(byDistance: boolean, character: any, items: any[]) {
        if (byDistance == true) {
            items = items.sort((a, b) => {
                let distanceToA = dw.distance(character.x, character.y, a.x, a.y);
                let distanceToB = dw.distance(character.x, character.y, b.x, b.y);
                return Math.min(distanceToA, distanceToB) == distanceToA ? -1 : 1;
            });
        }

        return items;
    }
}