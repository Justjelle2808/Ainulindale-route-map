// Gemaakt door Marcel Lemmey en Jelver Prons (6V1)
// Meesterproef/Profielwerkstuk 2022/2023
// Dit script bevat de basisfuncties voor de webpagina


function scrollExtend(){
  document.getElementById("navBarMiddle").style.height = "300px";
  document.getElementById("navBarScrollBottom").style.marginTop = "-20px";
}

function scrollClose(){
  document.getElementById("navBarMiddle").style.height = "0px";
  document.getElementById("navBarScrollBottom").style.marginTop = "-15px";
}