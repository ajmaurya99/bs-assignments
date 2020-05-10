function uiBindings() {
  getImagesData("../js/app.json", gridLoop);
}
/**
 * Refrence - https://www.w3schools.com/js/tryit.asp?filename=tryjson_http
 */
function getImagesData(url, callback) {
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function () {
    if (xhr.readyState == 4 && xhr.status == 200) {
      var imagesLists = JSON.parse(xhr.responseText);
      callback(imagesLists.imagesJson);
    }
  };
  xhr.open("GET", url, true);
  xhr.send();
}
function gridLoop(imagesLists) {
  for (var i = 0; i < imagesLists.length; i++) {
    createGrid(imagesLists[i]);
  }
}

function createGrid(imagesList) {
  var gridRow = document.querySelector(".grid-row");
  var col = document.createElement("div");
  col.classList.add("col");
  col.innerHTML =
    '<img src="' +
    imagesList.src +
    '" />' +
    '<div class="img-info">' +
    "<p>Image Name : <span>" +
    imagesList.title +
    "</span></p>" +
    "<p>Photographer : <span>" +
    imagesList.photographer +
    "</span></p>" +
    "<p>Date : <span>" +
    imagesList.date +
    "</span></p>" +
    "<p>Location : <span>" +
    imagesList.place +
    "</span></p>" +
    "<p>Category : <span>" +
    imagesList.category +
    "</span></p>" +
    "</div>";
  gridRow.appendChild(col);
}

document.addEventListener("DOMContentLoaded", function () {
  uiBindings();
});
