// Gemaakt door Marcel Lemmey en Jelver Prons (6V1)
// Meesterproef/Profielwerkstuk 2022/2023
// Dit is het hoofdscript dat verschillende functies bevat

// main function responsable for controlling the algorithm

var extraPointAdding = false;


// init the global variables
var heatMap = createHeatmap("images_and_maps/lotr.csv");

var locationList = readLocationNames("web_data/map_locations.csv");





function readLocationNames(link){
  var data = readFromCSV(link);


  var locationList = [[],[],[]]

  var dataList = data.split("\n")

  for(let i = 0; i < dataList.length; i++){
    dataList[i] = dataList[i].split(", ")
    
    let name = dataList[i][0].toLowerCase().split(" ").map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(" ")
    
    locationList[0].push(name);
    
    locationList[1].push(dataList[i][1]);
    locationList[2].push([dataList[i][2], dataList[i][3]]);
  }

  return locationList;
}



// function for reading from a csv file
function readFromCSV(link){
   // Reading magic from stackoverflow (https://stackoverflow.com/questions/14446447/how-to-read-a-local-text-file-in-the-browser).
  // This stores the data from the csv file in a long string. 
  var file = new XMLHttpRequest();
  var data;
  file.open("GET", link, false);
  
  file.onreadystatechange = function (){
      if(file.readyState === 4){
          if(file.status === 200 || file.status == 0){
              data = file.responseText;
          }
      }
  }
  file.send(null);

  return data;
}



// function for making a map list from a csv file
function createHeatmap(link){
 
  data = readFromCSV(link);
  
  // Split the string into rows (each row ends with "], ").
  var tempMap = data.split("], ");
  
  // Split each row into the individual data-pieces (they are separated with ", ").
  for(let i = 0; i < tempMap.length; i++){
    tempMap[i] = tempMap[i].split(", ");
  }
  
  // Delete all occurences of "[" and "]" from the data. These are remnants of how it is stored.
  // This is repeated twice for good measures.
  for(let i = 0; i < 2; i++){
    for(let y = 0; y < tempMap.length; y++){
      for(let x = 0; x < tempMap[0].length; x++){
        tempMap[y][x] = tempMap[y][x].replace("[", "");
        tempMap[y][x] = tempMap[y][x].replace("]", "");
      }
    }
  }

  return tempMap
}



function addExtraPoint(){
  if(!extraPointAdding){
    extraPointAdding = true;
    document.getElementById("addMidPointButton").style.backgroundColor = "darkslategray";
  }
  else{
    extraPointAdding = false;
    document.getElementById("addMidPointButton").style.backgroundColor = "darkgray";
  }
}

function deleteExtraPoints(){
  extraRoutePoints = [];
}
  