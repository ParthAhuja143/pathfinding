import { MinPriorityQueue } from "./MinHeap";
import {
  EnemyNode,
  FinishNode,
  GridNode,
  PathNode,
  StartNode,
  VisitedNode,
  WallNode,
  WeightNode,
} from "./Node";
import { Queue } from "./Queue";

export class GridBoard {
  constructor(rows, cols, setCanClickButton) {
    this.rows = rows;
    this.cols = cols;
    this.startNode = null;
    this.endNode = null;
    this.animationSpeed = 1;
    this.visitedNodes = [];
    this.board = [];
    this.enemies = [];
    this.wallNodesToAnimate = []; // for mazes
    this.visitedNodesToAnimate = [];
    this.weightNodesToAnimate = [];
    this.pathToAnimate = [];
    this.enemyNodesToAnimate = [];
    this.setCanClickButton = setCanClickButton
  }

  initialiseGrid() {
    const startNodeCordinates = {
      row: Math.floor(this.rows / 2),
      col: Math.floor(this.cols / 4),
    };

    const endNodeCordinates = {
      row: Math.floor(this.rows / 2),
      col: Math.floor(3 * (this.cols / 4)),
    };
    for (let i = 0; i < this.rows; i++) {
      const rowArr = [];
      for (let j = 0; j < this.cols; j++) {
        let node;
        if (i === startNodeCordinates.row && j === startNodeCordinates.col) {
          node = new StartNode(i, j);
          const element = document.getElementById(`node-${i}[${j}]`);
          if (element) element.className = "node start-node";
          this.startNode = { row: node.row, col: node.col };
        } else if (i === endNodeCordinates.row && j === endNodeCordinates.col) {
          node = new FinishNode(i, j);
          this.endNode = { row: node.row, col: node.col };
          const element = document.getElementById(`node-${i}[${j}]`);
          if (element) element.className = "node end-node";
        } else {
          node = new GridNode(i, j);
          const element = document.getElementById(`node-${i}-${j}`);
          if (element) element.className = "node";
        }
        rowArr.push(node);
      }
      this.board.push(rowArr);
    }

    return this;
  }

  removeVisited() {
    this.visitedNodesToAnimate = [];
    this.pathToAnimate = [];
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        let node;
        if (i === this.startNode.row && j === this.startNode.col) {
          node = new StartNode(i, j);
          const element = document.getElementById(`node-${i}[${j}]`);
          if (element) element.className = "node start-node";
          this.startNode = { row: node.row, col: node.col };
        } else if (i === this.endNode.row && j === this.endNode.col) {
          node = new FinishNode(i, j);
          this.endNode = { row: node.row, col: node.col };
          const element = document.getElementById(`node-${i}[${j}]`);
          if (element) element.className = "node end-node";
        } else if (this.board.length > 0 && this.board[i][j].isWall === true) {
          node = new WallNode(i, j);
          const element = document.getElementById(`node-${i}[${j}]`);
          if (element) element.className = "node wall-node";
        } else if (
          this.board.length > 0 &&
          this.board[i][j].isWeighted === true
        ) {
          node = new WeightNode(i, j, 15);
          const element = document.getElementById(`node-${i}[${j}]`);
          if (element) element.className = "node weight-node";
        } else if (this.board.length > 0 && this.board[i][j].isEnemy === true) {
          node = new EnemyNode(i, j);
          const element = document.getElementById(`node-${i}[${j}]`);
          if (element) element.className = "node enemy-node";
        } else {
          node = new GridNode(i, j);
          const element = document.getElementById(`node-${i}-${j}`);
          if (element) element.className = "node";
        }
        this.board[i][j] = node;
      }
    }

    return this;
  }

  removeEnemies(){
    this.enemies = []
    this.enemyNodesToAnimate = []
    for(let i = 0 ; i < this.rows ; i++){
      for(let j = 0 ; j < this.cols ; j++){
        if(this.board[i][j].isEnemy || this.board[i][j].threatLevel > 0){
          this.board[i][j] = new GridNode(i, j)

          const element = document.getElementById(`node-${i}-${j}`);
          if(element) element.className = 'node'
        }
      }
    }
    return this;
  }

  addWall(x, y) {
    //if (this.board[x][y].isWall === true) return this;
    this.wallNodesToAnimate = [this.board[x][y]];
    this.board[x][y].isWall = true;
    this.animateWallTimeout();
    return this;
  }

  addWeight(x, y) {
    //if (this.board[x][y].isWeighted === true) return this;
    this.weightNodesToAnimate = [this.board[x][y]];
    this.board[x][y] = new WeightNode(x, y, 15);
    this.animateWeightTimeout();
    return this;
  }

  addEnemy(x, y) {
    const enemyNode = new EnemyNode(x, y);
    this.board[x][y] = enemyNode;
    this.enemies.push(enemyNode);
    return this;
  }

  getNeighbors(node) {
    const { row, col } = node;
    const neighbors = [];
    const dx = [-1, 1, 0, 0];
    const dy = [0, 0, -1, 1];

    for (let i = 0; i < 4; i++) {
      const newRow = row + dx[i];
      const newCol = col + dy[i];

      if (this.isValid(newRow, newCol)) {
        neighbors.push(this.board[newRow][newCol]);
      }
    }

    return neighbors;
  }

  isValid(row, col) {
    return row >= 0 && row < this.rows && col >= 0 && col < this.cols;
  }

  manhattanHeuristic(startNode, endNode) {
    return (
      Math.abs(startNode.row - endNode.row) +
      Math.abs(startNode.col - endNode.col)
    );
  }

  euclidianHeuristic(startNode, endNode) {
    return Math.sqrt(
      (startNode.row - endNode.row) * (startNode.row - endNode.row) +
        (startNode.col - endNode.col) * (startNode.col - endNode.col)
    );
  }

  diagonalHeuristic(startNode, endNode) {
    return Math.max(
      Math.abs(startNode.row - endNode.row),
      Math.abs(startNode.col - endNode.col)
    );
  }

  calculateDistance(nodeA, nodeB) {
    const dx = nodeA.row - nodeB.row;
    const dy = nodeA.col - nodeB.col;
    return Math.sqrt(dx * dx + dy * dy);
  }

  calculateThreatLevels() {
    const threatRadius = 2; // Define the threat radius (adjust as needed)
    const threatMap = {
      0: 10,
      1: 5,
      2: 3,
    };

    // Iterate through enemy nodes
    for (const enemy of this.enemies) {
      const { row: enemyRow, col: enemyCol } = enemy;

      // Iterate through nodes within the threat radius of the current enemy
      for (let i = -threatRadius; i <= threatRadius; i++) {
        for (let j = -threatRadius; j <= threatRadius; j++) {
          const row = enemyRow + i;
          const col = enemyCol + j;

          // Check if the current position is within bounds
          if (
            row >= 0 &&
            row < this.rows &&
            col >= 0 &&
            col < this.cols &&
            this.board[row][col].isWall === false
          ) {
            const node = this.board[row][col];
            const distance = this.calculateDistance(enemy, node);
            if (distance <= threatRadius) {
              node.threatLevel += threatMap[Math.floor(distance)];

              if (node.threatLevel > 0 && node.isEnemy === false) {
                document.getElementById(
                  `node-${node.row}-${node.col}`
                ).className = `node threat-node-${
                  node.threatLevel >= 10
                    ? "10"
                    : node.threatLevel >= 5
                    ? "5"
                    : node.threatLevel >= 2
                    ? "2"
                    : "0"
                }`;
              }
            }
          }
        }
      }
    }
  }

  riotAlgorithm(heuristic) {
    const heuristicToUse =
      heuristic === "Manhattan"
        ? this.manhattanHeuristic
        : heuristic === "Diagonal"
        ? this.diagonalHeuristic
        : this.euclidianHeuristic;
    this.calculateThreatLevels();
    const endNode = this.board[this.endNode.row][this.endNode.col];
    for (let row = 0; row < this.rows; row++) {
      for (let col = 0; col < this.cols; col++) {
        const node = this.board[row][col];
        node.heuristicScore = heuristicToUse(node, endNode); // Use your heuristic function here
      }
    }

    const pq = new MinPriorityQueue();
    const processedNodes = {};
    const startNode = this.board[this.startNode.row][this.startNode.col];

    const fScore = 0.0;

    startNode.distance = 0;
    startNode.totalDistance = 0;
    startNode.parent = null;

    pq.insert(startNode, fScore);
    processedNodes[startNode.id] = startNode;

    startNode.isVisited = true;
    this.visitedNodesToAnimate.push(startNode);

    while (!pq.isEmpty()) {
      const topNode = pq.peek();
      pq.remove();

      if (topNode.isFinish === true) {
        const pathNodes = this.getPath(topNode);
        this.pathToAnimate = pathNodes;
        this.animate();
        return;
      }

      this.visitedNodesToAnimate.push(topNode);

      const dx = [-1, 0, 1, 0];
      const dy = [0, 1, 0, -1];

      for (let i = 0; i < 4; i++) {
        const dxx = topNode.row + dx[i];
        const dyy = topNode.col + dy[i];

        if (
          dxx >= 0 &&
          dxx < this.rows &&
          dyy >= 0 &&
          dyy < this.cols &&
          this.board[dxx][dyy].isWall === false &&
          this.board[dxx][dyy].isVisited === false
        ) {
          // valid neighbour

          const neighbourNode = this.board[dxx][dyy];

          // gScore, hScore
          const gScoreNeighbour =
            topNode.totalDistance +
            neighbourNode.weight +
            neighbourNode.threatLevel;
          const hScoreNeighbour = neighbourNode.heuristicScore;

          // calculate fscore
          const tentativeFScoreNeighbour = gScoreNeighbour + hScoreNeighbour;

          if (
            !processedNodes[neighbourNode.id] ||
            tentativeFScoreNeighbour <
              neighbourNode.totalDistance + hScoreNeighbour
          ) {
            neighbourNode.parent = topNode;
            neighbourNode.totalDistance = gScoreNeighbour;
            neighbourNode.isVisited = true;
            neighbourNode.heuristicScore = hScoreNeighbour; // Update the heuristic score

            processedNodes[neighbourNode.id] = neighbourNode;

            pq.insert(neighbourNode, tentativeFScoreNeighbour);
          }
        }
      }
    }
    this.animate();
  }

  aStar(heuristic) {
    const heuristicToUse =
      heuristic === "Manhattan"
        ? this.manhattanHeuristic
        : heuristic === "Diagonal"
        ? this.diagonalHeuristic
        : this.euclidianHeuristic;
    const endNode = this.board[this.endNode.row][this.endNode.col];
    for (let row = 0; row < this.rows; row++) {
      for (let col = 0; col < this.cols; col++) {
        const node = this.board[row][col];
        node.heuristicScore = heuristicToUse(node, endNode); // Use your heuristic function here
      }
    }

    const pq = new MinPriorityQueue();
    const processedNodes = {};

    const fScore = 0.0;
    const startNode = this.board[this.startNode.row][this.startNode.col];
    startNode.distance = 0;
    startNode.totalDistance = 0;
    startNode.parent = null;

    pq.insert(startNode, fScore);
    processedNodes[startNode.id] = startNode;

    startNode.isVisited = true;
    this.visitedNodesToAnimate.push(startNode);

    while (!pq.isEmpty()) {
      const topNode = pq.peek();
      pq.remove();

      if (topNode.isFinish === true) {
        const pathNodes = this.getPath(topNode);
        this.pathToAnimate = pathNodes;
        this.animate();
        return;
      }

      this.visitedNodesToAnimate.push(topNode);

      const dx = [-1, 0, 1, 0];
      const dy = [0, 1, 0, -1];

      for (let i = 0; i < 4; i++) {
        const dxx = topNode.row + dx[i];
        const dyy = topNode.col + dy[i];

        if (
          dxx >= 0 &&
          dxx < this.rows &&
          dyy >= 0 &&
          dyy < this.cols &&
          this.board[dxx][dyy].isWall === false &&
          this.board[dxx][dyy].isVisited === false
        ) {
          // valid neighbour

          const neighbourNode = this.board[dxx][dyy];

          // gScore, hScore
          const gScoreNeighbour = topNode.totalDistance + neighbourNode.weight;
          const hScoreNeighbour = neighbourNode.heuristicScore;
          neighbourNode.totalDistance = gScoreNeighbour;

          // calculate fscore
          const tentativeFScoreNeighbour = gScoreNeighbour + hScoreNeighbour;

          if (
            !processedNodes[neighbourNode.id] ||
            tentativeFScoreNeighbour <
              neighbourNode.totalDistance + hScoreNeighbour
          ) {
            neighbourNode.parent = topNode;
            neighbourNode.totalDistance = gScoreNeighbour;
            neighbourNode.isVisited = true;
            neighbourNode.heuristicScore = hScoreNeighbour; // Update the heuristic score

            processedNodes[neighbourNode.id] = neighbourNode;

            pq.insert(neighbourNode, tentativeFScoreNeighbour);
          }
        }
      }
    }
    this.animate();
  }

  dijkstra() {
    const pq = new MinPriorityQueue();

    const sNode = this.board[this.startNode.row][this.startNode.col];
    sNode.distance = 0;
    sNode.isVisited = true;
    sNode.totalDistance = 0;

    pq.insert(sNode, this.startNode.distance);

    while (!pq.isEmpty()) {
      let topNode = pq.peek();
      let topNodeDistance = topNode.distance;
      this.visitedNodesToAnimate.push(topNode);

      if (topNode.isFinish === true) {
        const pathNodes = this.getPath(topNode);
        this.pathToAnimate = pathNodes;
        this.animate();
        return;
      }

      pq.remove();

      this.visitedNodesToAnimate.push(topNode); // Wait for node animation to complete

      const dx = [-1, 1, 0, 0];
      const dy = [0, 0, -1, 1];

      for (let i = 0; i < 4; i++) {
        let dxx = topNode.row + dx[i];
        let dyy = topNode.col + dy[i];

        if (
          dxx >= 0 &&
          dxx < this.rows &&
          dyy >= 0 &&
          dyy < this.cols &&
          this.board[dxx][dyy].isWall === false &&
          this.board[dxx][dyy].isVisited === false
        ) {
          const neighbour = this.board[dxx][dyy];
          const neighbourDistance = this.board[dxx][dyy].distance;

          this.board[dxx][dyy].isVisited = true;

          if (neighbourDistance > topNodeDistance + neighbour.weight) {
            this.visitedNodesToAnimate.push(neighbour);
            this.board[dxx][dyy].distance = topNodeDistance + neighbour.weight;
            this.board[dxx][dyy].parent = topNode;
            pq.insert(this.board[dxx][dyy], this.board[dxx][dyy].distance);
          }
        }
      }
    }
    this.animate();
  }

  bfs() {
    const q = new Queue();

    const startNode = this.board[this.startNode.row][this.startNode.col];

    startNode.distance = 0;
    q.enqueue(startNode);
    startNode.isVisited = true;

    while (!q.isEmpty()) {
      const frontNode = q.getFront();
      const frontNodeDisance = frontNode.distance;

      q.dequeue();

      if (frontNode.isFinish === true) {
        const pathNodes = this.getPath(frontNode);
        this.pathToAnimate = pathNodes;
        this.animate();
        return;
      }

      const dx = [-1, 1, 0, 0];
      const dy = [0, 0, -1, 1];

      for (let i = 0; i < 4; i++) {
        const dxx = frontNode.row + dx[i];
        const dyy = frontNode.col + dy[i];

        if (
          dxx >= 0 &&
          dxx < this.board.length &&
          dyy >= 0 &&
          dyy < this.board[0].length &&
          this.board[dxx][dyy].isWall === false &&
          this.board[dxx][dyy].isVisited === false
        ) {
          const neighbourNode = this.board[dxx][dyy];
          const neighbourNodeDistance = neighbourNode.distance;

          if (neighbourNodeDistance > frontNodeDisance + 1) {
            q.enqueue(this.board[dxx][dyy]);

            this.board[dxx][dyy].isVisited = true;
            this.board[dxx][dyy].parent = frontNode;
            this.board[dxx][dyy].distance = frontNodeDisance + 1;

            this.visitedNodesToAnimate.push(neighbourNode);
          }
        }
      }
    }
    this.animate();
  }

  biDirectionalBFS() {
    const visitedFromStart = new Map();
    const visitedFromEnd = new Map();
    const startNode = this.board[this.startNode.row][this.startNode.col];
    const endNode = this.board[this.endNode.row][this.endNode.col];
    const queueFromStart = [startNode];
    const queueFromEnd = [endNode];

    visitedFromStart.set(startNode.id, null);
    visitedFromEnd.set(endNode.id, null);

    while (queueFromStart.length > 0 && queueFromEnd.length > 0) {
      const currentFromStart = queueFromStart.shift();
      const currentFromEnd = queueFromEnd.shift();

      if (
        visitedFromStart.has(currentFromEnd.id) ||
        visitedFromEnd.has(currentFromStart.id)
      ) {
        // Intersection point found
        if (visitedFromEnd.has(currentFromStart.id)) {
          const path = this.getPathForBiDirectionalBFS(
            currentFromStart,
            visitedFromStart,
            visitedFromEnd
          );
          this.pathToAnimate = path;
          this.animate();
          return;
        } else {
          const path = this.getPathForBiDirectionalBFS(
            currentFromEnd,
            visitedFromStart,
            visitedFromEnd
          );
          this.pathToAnimate = path;
          this.animate();
          return;
        }
      }

      const neighborsFromStart = this.getNeighbors(currentFromStart);
      const neighborsFromEnd = this.getNeighbors(currentFromEnd);

      for (const neighbor of neighborsFromStart) {
        if (neighbor.isWall === false && !visitedFromStart.has(neighbor.id)) {
          visitedFromStart.set(neighbor.id, currentFromStart);
          queueFromStart.push(neighbor);
          this.visitedNodesToAnimate.push(neighbor);
        }
      }

      for (const neighbor of neighborsFromEnd) {
        if (neighbor.isWall === false && !visitedFromEnd.has(neighbor.id)) {
          visitedFromEnd.set(neighbor.id, currentFromEnd);
          queueFromEnd.push(neighbor);
          this.visitedNodesToAnimate.push(neighbor);
        }
      }
    }

    this.animate();
    return; // No path found
  }

  greedyBFS() {
    const endNode = this.board[this.endNode.row][this.endNode.col];
    for (let row = 0; row < this.rows; row++) {
      for (let col = 0; col < this.cols; col++) {
        const node = this.board[row][col];
        node.heuristicScore = this.manhattanHeuristic(node, endNode); // Use your heuristic function here
      }
    }

    const pq = new MinPriorityQueue();

    const startNode = this.board[this.startNode.row][this.startNode.col];

    startNode.parent = null;
    startNode.isVisited = true;

    pq.insert(startNode, startNode.heuristicScore);

    while (!pq.isEmpty()) {
      const topNode = pq.peek();
      pq.remove();

      if (topNode.isFinish === true) {
        const pathNodes = this.getPath(topNode);
        this.pathToAnimate = pathNodes;
        this.animate();
        return;
      }

      this.visitedNodesToAnimate.push(topNode);

      const dx = [-1, 0, 1, 0];
      const dy = [0, 1, 0, -1];

      for (let i = 0; i < 4; i++) {
        const dxx = topNode.row + dx[i];
        const dyy = topNode.col + dy[i];

        if (
          dxx >= 0 &&
          dxx < this.rows &&
          dyy >= 0 &&
          dyy < this.cols &&
          this.board[dxx][dyy].isWall === false &&
          this.board[dxx][dyy].isVisited === false
        ) {
          // valid neighbour

          const neighbourNode = this.board[dxx][dyy];
          neighbourNode.parent = topNode;
          neighbourNode.isVisited = true;

          if (neighbourNode.isFinish === true) {
            const pathNodes = this.getPath(neighbourNode);
            this.pathToAnimate = pathNodes;
            this.animate();
            return;
          }

          pq.insert(neighbourNode, neighbourNode.heuristicScore);
        }
      }
    }
  }

  getPathForBiDirectionalBFS(
    intersectionNode,
    visitedFromStart,
    visitedFromEnd
  ) {
    const path = [];
    let current = intersectionNode;

    while (current != null) {
      path.unshift(current);
      current = visitedFromStart.get(current.id);
    }

    current = visitedFromEnd.get(intersectionNode.id);
    while (current != null) {
      path.push(current);
      current = visitedFromEnd.get(current.id);
    }
    return path;
  }

  dfs() {
    const animationCounter = { value: 1 }; // Use an object to pass animationCounter by reference
    const isFinishFound = {
      value: false,
    };

    this.dfsUtil(this.startNode, null, 0, animationCounter, isFinishFound);
  }

  dfsUtil(node, parent, distance, animationCounter, isFinishFound) {
    node.isVisited = true;
    node.distance = distance;
    node.parent = parent;

    if (node.isFinish) {
      const pathNodes = this.getPath(node);
      this.animatePathTimeoutReference(pathNodes, animationCounter);
      isFinishFound.value = true;
      return;
    }

    this.animateNodeTimeoutReference(node, animationCounter);
    animationCounter.value = animationCounter.value + 1;

    const dx = [-1, 0, 1, 0];
    const dy = [0, 1, 0, -1];

    for (let i = 0; i < 4; i++) {
      const dxx = node.row + dx[i];
      const dyy = node.col + dy[i];

      if (
        dxx >= 0 &&
        dxx < this.rows &&
        dyy >= 0 &&
        dyy < this.cols &&
        !this.board[dxx][dyy].isVisited &&
        !this.board[dxx][dyy].isWall &&
        isFinishFound.value === false
      ) {
        const neighborNode = this.board[dxx][dyy];
        if (neighborNode.distance > node.distance + 1) {
          animationCounter.value = animationCounter.value + 1;
          this.dfsUtil(
            this.board[dxx][dyy],
            node,
            node.distance + 1,
            animationCounter,
            isFinishFound
          );
        }
      }
    }

    if (isFinishFound.value === false) {
      animationCounter.value = animationCounter.value + 1;
      this.animateUnvisitedNodeTimeoutReference(node, animationCounter);
    }
  }

  /*
   * @title ANIMATION CODE
   */

  animate() {
    this.animateVisitedTimeout();
    setTimeout(() => {
      this.animatePathTimeout();
    }, [this.visitedNodesToAnimate.length * 10]);
  }

  animateVisitedTimeout() {
    this.setCanClickButton(false)
    for (let i = 0; i < this.visitedNodesToAnimate.length; i++) {
      let node = this.visitedNodesToAnimate[i];
      setTimeout(() => {
        const elem = document.getElementById(`node-${node.row}-${node.col}`);
        if (elem) elem.className = "node visited-node";
        if(i === this.visitedNodesToAnimate.length - 1){
          this.setCanClickButton(true)
        }
      }, 10 * i);
    }
  }

  animateWallTimeout() {
    this.setCanClickButton(false)
    for (let i = 0; i < this.wallNodesToAnimate.length; i++) {
      let node = this.wallNodesToAnimate[i];
      setTimeout(() => {
        node = new WallNode(node.row, node.col);
        this.board[node.row][node.col].isWall = true;
        if(i === this.wallNodesToAnimate.length - 1){
          this.setCanClickButton(true)
        }
      }, 10 * i);
    }
  }

  animateWeightTimeout() {
    this.setCanClickButton(false);
    for (let i = 0; i < this.weightNodesToAnimate.length; i++) {
      let node = this.weightNodesToAnimate[i];
      setTimeout(() => {
        node = new WeightNode(node.row, node.col, 15);
        this.board[node.row][node.col].isWeighted = true;
        this.board[node.row][node.col].weight = 15;
        if(i === this.weightNodesToAnimate.length - 1){
          this.setCanClickButton(true)
        }
      }, 10 * i);
    }
  }

  animateNodeTimeoutReference(node, delayCounter) {
    this.setCanClickButton(false)
    setTimeout(() => {
      this.board[node.row][node.col] = new VisitedNode(node.row, node.col);
      this.setCanClickButton(true)
    }, 10 * delayCounter.value);
  }

  animatePathTimeout() {
    if(this.pathToAnimate.length === 0) return;
    this.setCanClickButton(false);
    for (let i = 0; i < this.pathToAnimate.length; i++) {
      setTimeout(() => {
        const node = this.pathToAnimate[i];
        const elem = document.getElementById(`node-${node.row}-${node.col}`);
        if (elem) elem.className = "node node-shortest-path";
        if(i === this.pathToAnimate.length - 1){
          this.setCanClickButton(true)
        }
      }, i * 10);
    }
  }

  animatePathTimeoutReference(pathNodes, delayCounter) {
    this.setCanClickButton(false)
    for (let i = 0; i < pathNodes.length; i++) {
      setTimeout(() => {
        const node = pathNodes[i];
        this.board[node.row][node.col] = new PathNode(node.row, node.col);
        this.setCanClickButton(true);
        if(i === pathNodes.length - 1){
          this.setCanClickButton(true)
        }
      }, 10 * i + delayCounter.value * 10);
    }
  }

  animateUnvisitedNodeTimeoutReference(node, animationCounter) {
    this.setCanClickButton(false);
    setTimeout(() => {
      const element = document.getElementById(`node-${node.row}-${node.col}`);
      element.classList.remove("visited-node");
      element.classList.add("unvisited-node");
      this.setCanClickButton(true)
    }, 10 * animationCounter.value); // Adjust the animation speed here
  }

  getPath(endNode) {
    const pathNodes = [];
    let currentNode = endNode;
    while (currentNode !== null) {
      pathNodes.unshift(currentNode); // Add the node to the beginning of the array
      currentNode = currentNode.parent;
    }
    return pathNodes;
  }

  removeWallsAndWeights() {
    this.wallNodesToAnimate = [];
    this.weightNodesToAnimate = [];
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        if (
          this.board[i][j].isWall ||
          this.board[i][j].isWeighted ||
          this.board[i][j].weight > 1
        ) {
          this.board[i][j].isWall = false;
          this.board[i][j].isWeighted = false;
          this.board[i][j].weight = 1;
          this.board[i][j] = new GridNode(i, j);
          const element = document.getElementById(`node-${i}-${j}`);
          if (element) element.className = "node";
        }
      }
    }
  }

  recursiveDivisionMazeGeneration(orientation, type) {
    this.removeWallsAndWeights();
    this.recursiveDivisionMazeGenerationUtil(
      2,
      this.rows - 3,
      2,
      this.cols - 3,
      orientation,
      false,
      type
    );
    if (type === "wall") {
      this.animateWallTimeout();
    } else {
      this.animateWeightTimeout();
    }
    return this;
  }

  recursiveDivisionMazeGenerationUtil(
    rowStart,
    rowEnd,
    colStart,
    colEnd,
    orientation,
    surroundingWalls,
    type
  ) {
    if (rowEnd < rowStart || colEnd < colStart) {
      return;
    }
    if (!surroundingWalls) {
      const startNode = this.board[this.startNode.row][this.startNode.col];
      const endNode = this.board[this.endNode.row][this.endNode.col];
      this.removeVisited();
      let relevantIds = [startNode.id, endNode.id];

      for (let i = 0; i < this.rows; i++) {
        for (let j = 0; j < this.cols; j++) {
          const node = this.board[i][j];
          if (!relevantIds.includes(node.id)) {
            const currRow = i;
            const currCol = j;

            if (
              currRow === 0 ||
              currCol === 0 ||
              currRow === this.rows - 1 ||
              currCol === this.cols - 1
            ) {
              if (type === "wall") {
                this.wallNodesToAnimate.push(node);
              } else {
                this.weightNodesToAnimate.push(node);
              }
            }
          }
        }
      }
      surroundingWalls = true;
    }

    if (orientation === "horizontal") {
      const possibleRows = [];

      for (let i = rowStart; i <= rowEnd; i += 2) {
        possibleRows.push(i);
      }

      const possibleCols = [];

      for (let i = colStart - 1; i <= colEnd + 1; i += 2) {
        possibleCols.push(i);
      }

      let randomRowIndex = Math.floor(Math.random() * possibleRows.length);
      let randomColIndex = Math.floor(Math.random() * possibleCols.length);

      let currentRow = possibleRows[randomRowIndex];
      let colRandom = possibleCols[randomColIndex];

      for (let i = 0; i < this.rows; i++) {
        for (let j = 0; j < this.cols; j++) {
          const node = this.board[i][j];

          if (
            i === currentRow &&
            j !== colRandom &&
            j >= colStart - 1 &&
            j <= colEnd + 1 &&
            node.isStart === false &&
            node.isFinish === false
          ) {
            if (type === "wall") {
              this.wallNodesToAnimate.push(node);
            } else {
              this.weightNodesToAnimate.push(node);
            }
          }
        }
      }
      if (currentRow - 2 - rowStart > colEnd - colStart) {
        this.recursiveDivisionMazeGenerationUtil(
          rowStart,
          currentRow - 2,
          colStart,
          colEnd,
          orientation,
          surroundingWalls,
          type
        );
      } else {
        this.recursiveDivisionMazeGenerationUtil(
          rowStart,
          currentRow - 2,
          colStart,
          colEnd,
          "vertical",
          surroundingWalls,
          type
        );
      }
      if (rowEnd - (currentRow + 2) > colEnd - colStart) {
        this.recursiveDivisionMazeGenerationUtil(
          currentRow + 2,
          rowEnd,
          colStart,
          colEnd,
          orientation,
          surroundingWalls,
          type
        );
      } else {
        this.recursiveDivisionMazeGenerationUtil(
          currentRow + 2,
          rowEnd,
          colStart,
          colEnd,
          "vertical",
          surroundingWalls,
          type
        );
      }
    } else {
      const possibleCols = [];
      for (let i = colStart; i <= colEnd; i += 2) {
        possibleCols.push(i);
      }

      const possibleRows = [];
      for (let i = rowStart - 1; i <= rowEnd + 1; i += 2) {
        possibleRows.push(i);
      }

      let randomColIndex = Math.floor(Math.random() * possibleCols.length);
      let randomRowIndex = Math.floor(Math.random() * possibleRows.length);
      let currentCol = possibleCols[randomColIndex];
      let rowRandom = possibleRows[randomRowIndex];

      for (let i = 0; i < this.rows; i++) {
        for (let j = 0; j < this.cols; j++) {
          const node = this.board[i][j];
          if (
            j === currentCol &&
            i !== rowRandom &&
            i >= rowStart - 1 &&
            i <= rowEnd + 1 &&
            node.isStart === false &&
            node.isFinish === false
          ) {
            if (type === "wall") {
              this.wallNodesToAnimate.push(node);
            } else {
              this.weightNodesToAnimate.push(node);
            }
          }
        }
      }

      if (rowEnd - rowStart > currentCol - 2 - colStart) {
        this.recursiveDivisionMazeGenerationUtil(
          rowStart,
          rowEnd,
          colStart,
          currentCol - 2,
          "horizontal",
          surroundingWalls,
          type
        );
      } else {
        this.recursiveDivisionMazeGenerationUtil(
          rowStart,
          rowEnd,
          colStart,
          currentCol - 2,
          orientation,
          surroundingWalls,
          type
        );
      }
      if (rowEnd - rowStart > colEnd - (currentCol + 2)) {
        this.recursiveDivisionMazeGenerationUtil(
          rowStart,
          rowEnd,
          currentCol + 2,
          colEnd,
          "horizontal",
          surroundingWalls,
          type
        );
      } else {
        this.recursiveDivisionMazeGenerationUtil(
          rowStart,
          rowEnd,
          currentCol + 2,
          colEnd,
          orientation,
          surroundingWalls,
          type
        );
      }
    }
  }

  isValid(row, col) {
    return (
      row >= 0 &&
      row < this.rows &&
      col >= 0 &&
      col < this.cols &&
      this.board[row][col].isStart === false &&
      this.board[row][col].isFinish === false
    );
  }

  createEnemyLines(method) {
    this.removeEnemies();
    this.removeVisited();
    switch (method) {
      case "Ambush":
        for (let i = 0; i < this.rows; i++) {
          for (let j = this.startNode.col + 3; j <= this.endNode.col - 3; j++) {
            if (i > this.startNode.row && i < this.startNode.row + 4) {
              continue;
            } else {
              if (
                this.board[i][j].isEnemy === false &&
                this.board[i][j].isStart === false &&
                this.board[i][j].isFinish === false
              ) {
                this.enemies.push(this.board[i][j]);
                this.enemyNodesToAnimate.push(this.board[i][j]);
              } else {
                continue;
              }
            }
          }
        }
        break;

      case "Blocking Path":
        let i = this.startNode.row;
        for (let j = this.startNode.col + 2; j < this.endNode.col - 2; j++) {
          if (
            this.board[i][j].isEnemy === false &&
            this.board[i][j].isStart === false &&
            this.board[i][j].isFinish === false
          ) {
            this.enemies.push(this.board[i][j]);
            this.enemyNodesToAnimate.push(this.board[i][j]);
          }
        }
        break;

      case "Spread Out":
        for (let i = 0; i < this.rows; i += 5) {
          for (let j = 0; j < this.cols; j += 4) {
            if (
              this.board[i][j].isEnemy === false &&
              this.board[i][j].isStart === false &&
              this.board[i][j].isFinish === false
            ) {
              this.enemies.push(this.board[i][j]);
              this.enemyNodesToAnimate.push(this.board[i][j]);
            }
          }
        }
        break;

      case "Defensive Line":
        for (let i = 0; i < this.rows; i++) {
          for (let j = this.endNode.col - 7; j <= this.endNode.col - 3; j += 4) {
            if (
              this.board[i][j].isEnemy === false &&
              this.board[i][j].isStart === false &&
              this.board[i][j].isFinish === false
            ) {
              this.enemies.push(this.board[i][j]);
              this.enemyNodesToAnimate.push(this.board[i][j]);
            }
          }
        }
        break;

      case "Sniper Alley":
        for (let i = 3; i < this.rows; i += 6) {
          for (let j = 3; j < this.cols; j += 6) {
            if (
              this.board[i][j].isEnemy === false &&
              this.board[i][j].isStart === false &&
              this.board[i][j].isFinish === false
            ) {
              this.enemies.push(this.board[i][j]);
              this.enemyNodesToAnimate.push(this.board[i][j]);
            }
          }
        }
        break;

      case "Divide and Conquer":
        for (let i = 0; i < this.rows; i++) {
          for (
            let j = Math.floor(this.cols / 2) - 3;
            j <= Math.floor(this.cols / 2) + 3;
            j += 6
          ) {
            if (
              this.board[i][j].isEnemy === false &&
              this.board[i][j].isStart === false &&
              this.board[i][j].isFinish === false
            ) {
              this.enemies.push(this.board[i][j]);
              this.enemyNodesToAnimate.push(this.board[i][j]);
            }
          }
        }
        break;

      default:
        break;
    }
    this.animateEnemies();
  }

  animateEnemies() {
    this.setCanClickButton(false);
    for (let i = 0; i < this.enemyNodesToAnimate.length; i++) {
      setTimeout(() => {
        const node = this.enemyNodesToAnimate[i];
        this.board[node.row][node.col] = new EnemyNode(node.row, node.col);
        if(i === this.enemyNodesToAnimate.length - 1){
          this.setCanClickButton(true)
        }
      }, i * 10);
    }
  }
}
