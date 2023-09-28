export class GridNode {
    constructor(
        row=0,
        col=0,
        isStart = false,
        isFinish= false,
        isWall=false,
        isWeighted= false,
        isEnemy=false,
        distance= Infinity,
        parent= null,
        isVisited= false,
        heuristicScore= null,
        totalDistance= Infinity,
        weight= 1,
        threatLevel= 0,
        isInPath=false,
    ) {
        this.id = `node-${row}-${col}`
        this.col = col;
        this.row = row;
        this.isStart = isStart;
        this.isFinish = isFinish;
        this.isWall = isWall;
        this.isWeighted = isWeighted;
        this.isEnemy=isEnemy;
        this.distance = distance;
        this.parent = parent;
        this.isVisited = isVisited;
        this.heuristicScore = heuristicScore;
        this.totalDistance = totalDistance;
        this.weight = weight;
        this.threatLevel = threatLevel;
        this.isInPath = isInPath;

        const elem = document.getElementById(`node-${this.id}`);
        if(elem) elem.className = 'node'
    }
};

export class StartNode extends GridNode {
    constructor(row, col){
        super(
            row,
            col,
        );
        this.isStart = true;
        const elem = document.getElementById(`node-${row}-${col}`);
        if(elem) elem.className = 'node start-node'
    }
}

export class FinishNode extends GridNode {
    constructor(row, col){
        super(
            row,
            col,
        );
        this.isFinish = true;
        const elem = document.getElementById(`node-${row}-${col}`);
        if(elem) elem.className = 'node finish-node'
    }
}

export class WallNode extends GridNode {
    constructor(row, col){
        super(
            row,
            col,
        );
        this.isWall = true;
        const elem = document.getElementById(`node-${row}-${col}`);
        if(elem) elem.className = 'node wall-node'
    }
};

export class EnemyNode extends GridNode {
    constructor(row, col){
        super(
            row,
            col,
        );
        this.isEnemy = true;
        const elem = document.getElementById(`node-${row}-${col}`);
        if(elem) elem.className = 'node enemy-node'
    }
}

export class WeightNode extends GridNode {
    constructor(row, col, weight){
        super(
            row,
            col,
        );
        this.weight = weight;
        this.isWeighted = true;
        const elem = document.getElementById(`node-${row}-${col}`);
        if(elem) elem.className = 'node weight-node'
    }
}

export class PathNode extends GridNode {
    constructor(row, col) {
        super(row, col);
        this.isInPath = true;
        this.isVisited = true;
        const elem = document.getElementById(`node-${row}-${col}`);
        if(elem) elem.className = 'node node-shortest-path'
    }
}

export class VisitedNode extends GridNode{
    constructor(row, col){
        super(row, col);{
            this.isVisited = true;
            const elem = document.getElementById(`node-${row}-${col}`);
            if(elem) elem.className = 'node visited-node'
        }
    }
}