// Gemaakt door Marcel Lemmey en Jelver Prons (6V1)
// Meesterproef/Profielwerkstuk 2022/2023
// Dit script bevat een functie om een css file in en 2d map om te zetten
// en een pathfinding functie gebaseerd op A*

// The algorithm itself
onmessage = function routeAlgorithm(event){

  // This is the class of a node; it contains position data, the parent node, and the f,g and h values.
  class mapNode{
    constructor(x, y, parent, f, g, h){
      this.x = x;
      this.y = y;
      this.parent = parent;
      this.f = f;
      this.g = g;
      this.h = h;
    }
  }

  // decode the worker data list
  startX = event.data[0];
  startY = event.data[1];
  goalX = event.data[2];
  goalY = event.data[3];
  var heatMap = event.data[4];
  var weight = event.data[5];

  
  var iteration = 0;
  var routeFound = false;
  
  
  
  // list of nodes (pixels) the program is looking at 
  var openRouteNodes = [];
  var closedRouteNodes = [];
  
  // list of nodes being looked at in the current generation
  var successorNodeList = [];
  
  // the final path when the function is finished
  var path = [];
  var startNode = new mapNode(startX, startY, null, h(new mapNode(startX, startY)), 0, h(new mapNode(startX, startY)));

  var nodeCurrent = startNode;
  
  // initialise the variables
  openRouteNodes = [startNode];
  closedRouteNodes = [];
  successorNodeList = [];
  nodeCurrent = [];
  successorCurrentCost = 0;
  
  // main program loop
  while(routeFound != true){

    // every iteration post a message to update the screen
    if(iteration % 1 === 0){
      this.postMessage([iteration, closedRouteNodes]);
    }
    
    // set the current node to the one with lowest cost
    nodeCurrent = calculateLowestFCostNode();
    
    // moves the current node from open to closed
    openRouteNodes.splice(openRouteNodes.indexOf(nodeCurrent));
    closedRouteNodes.push(nodeCurrent); 
    
    // if the found node is the goal, end the program
    if(nodeCurrent.x == goalX && nodeCurrent.y == goalY){
      // retraces the path from child to parent
      path = reconstructPath(nodeCurrent);
      routeFound = true;
    }

    // find all neighbors of the node
    successorNodeList = calculateNeighbors(nodeCurrent, successorNodeList);
    
    
    // for every next node
    for(let i = 0; i < successorNodeList.length; i++){

      let successor = successorNodeList[i];
      
      let successorCurrentCost = successor.g + w(nodeCurrent, successor); 
      
      
      if(nodeListContains(openRouteNodes, successor)){
        if(successor.g <= successorCurrentCost){
          continue
        }
      }
      else if(nodeListContains(closedRouteNodes, successor)){
        if(successor.g <= successorCurrentCost){
          continue
        }
        closedRouteNodes.splice(closedRouteNodes.indexOf(successor));
        openRouteNodes.push(successor);
      }
      else{
        openRouteNodes.push(successor)
        successor.h = h(successor);
      }
    }
    iteration += 1;
  }
  postMessage(path);
  close();

  
  
  

  function nodeListContains(list, node){
    for(let n = 0; n < list.length; n++){
      if(list[n].x == node.x && list[n].y == node.y){
        return true;
      }
    }
    return false;
  }
  
  
  // F function; combines the values of the G and H to calculate the cost
  function f(node){ 
    return Math.round((g(node) + h(node))*100)/100;
  }
  

  
  // G function; Calculates the cost from the start node to the current node
  function g(node){
  
    let gValue = 0;
  
    let pathNodes = reconstructPath(node,closedRouteNodes)
    
    for(let i = 0; i < pathNodes.length-1; i++){
      // For each node calculate the w value between the node and the next node, and add it it the G.
      gValue += w(pathNodes[i], pathNodes[i+1]);
    }
    return Math.round(gValue*100)/100;
  } 
  
  
  
  // W function; Calculates the cost between two nodes
  function w(node1, node2){

    // A^2 + B^2 = C^2, or C = sqrt(A^2 + B^2)
    let wValue = Math.sqrt(Math.pow(node1.x - node2.x, 2) + Math.pow(node1.y - node2.y, 2)) * heatMap[node2.y][node2.x];
    
    return Math.round(wValue*100)/100
  }

  

  
  function h(node){
    let hValue = Math.sqrt(Math.pow(node.x - goalX, 2) + Math.pow(node.y - goalY, 2)) * weight * heatMap[node.y][node.x];
    return Math.round(hValue *100)/100;
  }
  
  
  // calculates the lowest cost node
  function calculateLowestFCostNode(){
    var selectionList = openRouteNodes;
    //searches for the node in the open nodes with the lowest cost and sets that as the selected node

    
    var lowestCostIndex = 0;
    var lowestCost = selectionList[0].f;
    for(var n = 0; n < selectionList.length; n++){
  
      // checks the lowest cost found so far against the cost of this node
      if(selectionList[n].f < Math.floor(lowestCost*10)/10){
        // if this cost is less than the last "lowest" cost, update the lowestIndex
        lowestCostIndex = n;
        // set the lowest cost to the cost of the node with i = lowestIndex
        lowestCost = selectionList[lowestCostIndex].f;  
      }  
    }
    
    return selectionList[lowestCostIndex];
  }
  
  
  
  // selects all nodes around a node using the "eenheidscirkel" and puts them in the list with next nodes
  function calculateNeighbors(node, returnList){
    let neighbourList = returnList
    var amountPi = 0;

    
      
    while (amountPi < 2){

      // Calculates the x and y offset position and rounds them to whole values.
      // If shown for Pi from 0 - 2, it gives: (-1, -1), (-1, 0), (-1, 1), (0, -1), (0, 1), (1, -1), (1, 0), (1, 1).
      let offsetX = Math.round(Math.cos(amountPi * Math.PI));
      let offsetY = Math.round(Math.sin(amountPi * Math.PI));

      // The new position is the real position plus the offset
      let newX = node.x + offsetX;
      let newY = node.y + offsetY;
      
      // If the new node is not out of bounds;
      if(newX > -1 && newX < heatMap[0].length){
        if(newY > -1 && newY < heatMap.length){
          // And the new node does not yet exist;
          
          let nodeToAdd = new mapNode(newX, newY, node, null, null, null);
          
          if(!nodeListContains(closedRouteNodes, nodeToAdd) && ! nodeListContains(openRouteNodes, nodeToAdd)){
            // Add the new node to the list of neighbours
            nodeToAdd.g = g(nodeToAdd);
            nodeToAdd.h = h(nodeToAdd);
            nodeToAdd.f = f(nodeToAdd);
            neighbourList.push(nodeToAdd);
          }
        }
      }
      amountPi += 0.25;
    }
    return neighbourList
  }

  
  
  // Reconstructs the path from a node to the start node, by tracing back all the parents.
  function reconstructPath(node){
    
    let constructedPath = []

    // add the first node to the path
    tracedNode = node
    constructedPath.push(node)

    // repeatedly add each nodes parent to the path, until the node does not have a parent, in witch case it is the start node
    while(tracedNode.parent != null){
      constructedPath.push(tracedNode.parent);
      tracedNode = tracedNode.parent;
    }
  
    return constructedPath
  }

}




















