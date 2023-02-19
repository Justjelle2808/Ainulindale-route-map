// Gemaakt door Marcel Lemmey en Jelver Prons (6V1)
// Meesterproef/Profielwerkstuk 2022/2023
// Dit script bevat een functie om het route algoritme en alle instances ervan te besturen 

// init the global variables
var extraRoutePoints = [];
var workerList = [];
var routePartList = [];
var route = [];
var startX = 0;
var startY = 0;
var goalX = 0;
var goalY = 0;
var showRouteNodes = false;
var displayedRouteNodes = [];


function runRouteAlgorithm(weight){

  document.getElementById("routeCancelButton").style.display = "block";
  
  if(workerList.length != 0){
    for(let i = 0; i < workerList.length; i++){
      workerList[i].terminate();
    }
  }

  workerList = [];
  routePartList = [];
  route = [];
  displayedRouteNodes = [];

  

  let amountOfWorkers = 1 + extraRoutePoints.length;

  for(let i = 0; i < amountOfWorkers; i++){
    let newWorker = new Worker("scripts/routeAlgorithm.js");
    workerList.push(newWorker);
    routePartList.push([]);
    displayedRouteNodes.push([]);
  }


  for(let i = 0; i < workerList.length; i++){
    // when the worker gives a message back
    workerList[i].onmessage = function(returnedEvent){
    // if it contains nodes, it is the full route, so return that data
      if(typeof returnedEvent.data[0] == "object"){
        let workerRoute = returnedEvent.data;
        routePartList[i] = workerRoute;
        showRouteNodes = false;
        
        if(routePartList.every(element => element.length != 0)){
          endAlgorithm();
        }
      }
      else{
        displayedRouteNodes[i] = returnedEvent.data[1];
        showRouteNodes = true;
      }
    }
  }

  if(extraRoutePoints.length == 0){
    startAlgorithmWorker(workerList[0], [startX, startY], [goalX, goalY], weight);
  }

  else{
    startAlgorithmWorker(workerList[0], [startX, startY], extraRoutePoints[0], weight);
    
    for(let i = 1; i < extraRoutePoints.length; i++){
      startAlgorithmWorker(workerList[i], extraRoutePoints[i-1], extraRoutePoints[i], weight);
    }
    
    startAlgorithmWorker(workerList[workerList.length-1], extraRoutePoints[extraRoutePoints.length-1], [goalX, goalY], weight);
  }

}

// when algorithm started
function startAlgorithmWorker(thisWorker, [startX, startY], [goalX, goalY], weight){
  // send start message and the data for the algorithm
  thisWorker.postMessage("start");
  thisWorker.postMessage([startX, startY, goalX, goalY, heatMap, weight]);

}


function endAlgorithm(){
  route = [];
  for(let i = 0; i < routePartList.length; i++){
    for(let j = routePartList[i].length-1; j >= 0; j--){
      route.push(routePartList[i][j]);
    }
    console.log(routePartList, route)
  }
  routePartList = [];
  document.getElementById("routeCancelButton").style.display = "none";
}

function cancelAlgorithm(){
  
  if(workerList.length != 0){
    for(let i = 0; i < workerList.length; i++){
      workerList[i].terminate();
    }
  }
  
  workerList = [];
  routePartList = [];
  route = [];
  showRouteNodes = false;
  displayedRouteNodes = [];
  document.getElementById("routeCancelButton").style.display = "none";
  
}