// Gemaakt door Marcel Lemmey en Jelver Prons (6V1)
// Meesterproef/Profielwerkstuk 2022/2023
// File for displaying a map in a processing window

// Highest value in the heatmap.
int heatMax = 0;

float squareWidth;
float squareHeight;



PImage map;
PImage roadMap;
var roadPixels = [];

float zoom = 0.3;
float cameraXOffset = 0;
float cameraYOffset = 0;
float zoomFactor = 1.10;


// Runs once when the program starts.
void setup(){

  // Size of the screen area.
  size(700,700);

  // turns off borders
  noStroke();

  
  map = loadImage("images_and_maps/lotrWithRoads.webp");
  
  // Calculate the width of the "pixels" of the heatmap.
  squareWidth = 1;
  squareHeight = 1;
  
  
  // Loop through every value to find the highest.
  for(int y = 0; y < heatMap.length(); y++){
    for(int x = 0; x < heatMap[y].length(); x++){
      
      // If the current value is higher than the last found highest value,
      // set new highest value.
      if(heatMap[y][x] > heatMax){
        heatMax = heatMap[y][x];
        
      }
    }
  }
  
}

// Runs every frame.
void draw(){
  // Set background color to black (refresh the screen every frame).
  background(0);
  translate(cameraXOffset, cameraYOffset);
  scale(zoom);

  
  // sets image of map

  image(map, 0, 0, map.width, map.height);

  
  // draws all route nodes when the algorithm is running
  
  if(showRouteNodes){
    for(int i = 0; i < displayedRouteNodes.length(); i++){
      for(int j = 0; j < displayedRouteNodes[0].length(); j++){
        if(displayedRouteNodes[i][j] != null){
          fill(255, 0, 0)
          rect(displayedRouteNodes[i][j].x * squareWidth + 0.5 * squareWidth, displayedRouteNodes[i][j].y * squareHeight + 0.5 * squareHeight, squareWidth, squareHeight);
        }
      }
    }
  }

  // set route part curves (while route is made)
  noFill();
  stroke(0, 200, 0);
  strokeWeight(squareWidth);

  for(int j = 0; j < routePartList.length(); j++){
  beginShape();
    for(int i = 0; i < routePartList[j].length(); i++) {
        curveVertex(routePartList[j][i].x * squareWidth + 0.5 * squareWidth, routePartList[j][i].y * squareHeight + 0.5 * squareHeight);
    }
    endShape();
  }
  
  beginShape();
  stroke(0, 0, 200);
  for(int i = 0; i < route.length(); i++){
    curveVertex(route[i].x * squareWidth + 0.5 * squareWidth, route[i].y * squareHeight + 0.5 * squareHeight);
  }
  endShape();
  
  noStroke();


  // set location markers
  for(int i = 0; i < locationList[0].length(); i++){
    
    textSize(1.7)
    fill("0, 0, 0");
    
    let boldFont = createFont("Arial Bold")
    textFont(boldFont);
    
    text(locationList[0][i], locationList[2][i][0] * squareWidth, locationList[2][i][1] * squareHeight);
  }

  for(int i = 0; i < extraRoutePoints.length(); i++){
    fill(color("#FFA500"));
    rect(extraRoutePoints[i][0] * squareWidth, extraRoutePoints[i][1] * squareHeight, squareWidth, squareHeight);
  }
  
  // set start and end point
  fill(0, 255, 0);
  rect(startX * squareWidth, startY * squareHeight, squareWidth, squareHeight);

  fill(255, 0, 0);
  rect(goalX * squareWidth, goalY * squareHeight, squareWidth, squareHeight);

  
  if(extraPointAdding){
    fill(color("#FFA500"));
    let mX = int(((mouseX  - cameraXOffset) / zoom) / (squareWidth));
    let mY = int(((mouseY  - cameraYOffset) / zoom) / (squareHeight));
    rect(mX * squareWidth, mY * squareHeight, squareWidth, squareHeight);
  }
 

}

void mousePressed(){
  let xPos = int(((mouseX  - cameraXOffset) / zoom) / (squareWidth));
  let yPos = int(((mouseY  - cameraYOffset) / zoom) / (squareHeight));
  if(mouseButton == LEFT){
    if(xPos >= 0 && xPos < 3200 && yPos >= 0 && yPos < 4000){

      if(extraPointAdding){
        extraRoutePoints.push([xPos, yPos]);
        document.getElementById("addMidPointButton").style.backgroundColor = "darkgray";
        extraPointAdding = false;
      }
    }
  }
}


void mouseDragged(){
  let xPos = int(((mouseX  - cameraXOffset) / zoom) / (squareWidth));
  let yPos = int(((mouseY  - cameraYOffset) / zoom) / (squareHeight));
  if(mouseButton == LEFT){
    if(xPos >= 0 && xPos < 3200 && yPos >= 0 && yPos < 4000){

      if(!extraPointAdding){
        startX = xPos;
        startY = yPos;
      }
    }
  }

  if(mouseButton == RIGHT){
    if(xPos >= 0 && xPos < 3200 && yPos >= 0 && yPos < 4000){

      goalX = xPos;
      goalY = yPos;
    }
  }

  
  if(mouseButton == CENTER){
    cameraXOffset += (mouseX - pmouseX);
    cameraYOffset += (mouseY - pmouseY);
  }
}


// event listener for mousewheel over canvas
document.getElementById("mainMapCanvas").addEventListener("mousewheel", function(event){
  event.preventDefault();
  
  cameraXOffset -= mouseX;
  cameraYOffset -= mouseY;
  
  if(event.deltaY < 0 ){
      zoom *= zoomFactor;
      cameraXOffset *= zoomFactor;
      cameraYOffset *= zoomFactor;
    }
    if(event.deltaY > 0 && zoom >= 0.2){
      zoom /= zoomFactor;
      cameraXOffset /= zoomFactor;
      cameraYOffset /= zoomFactor;
    }

  
  
  cameraXOffset += mouseX;
  cameraYOffset += mouseY;
    
});




