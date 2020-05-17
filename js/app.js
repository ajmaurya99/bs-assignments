function uiBindings() {
  getImagesData("../js/app.json", gridLoop);
}
/**
 * Refrence - https://www.w3schools.com/js/tryit.asp?filename=tryjson_http
 * Ajax call to get data from json
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

// Ajax callback function
function gridLoop(imagesLists) {
  for (var i = 0; i < imagesLists.length; i++) {
    createGrid(imagesLists[i]);
  }
  // Image Filter
  setTimeout(function () {
    createSelectFilter("p#location > span", "location-filter");
    createSelectFilter("p#category > span", "category-filter");
  }, 0);
}

// create grid layout
function createGrid(imagesList) {
  var gridRow = document.querySelector(".grid-row"),
    col = document.createElement("div");
  col.classList.add("col");
  col.innerHTML =
    '<img src="' +
    imagesList.src +
    '" />' +
    '<div class="img-info">' +
    '<p id="image-name">Image Name : <span>' +
    imagesList.title +
    "</span></p>" +
    '<p id="photographer">Photographer : <span>' +
    imagesList.photographer +
    "</span></p>" +
    '<p id="date">Date : <span>' +
    imagesList.date +
    "</span></p>" +
    '<p id="location">Location : <span>' +
    imagesList.place +
    "</span></p>" +
    '<p id="category">Category : <span>' +
    imagesList.category +
    "</span></p>" +
    "</div>";
  gridRow.appendChild(col);
}

// Create Filter
function createSelectFilter(selector, id) {
  var selectedFilter = document.querySelectorAll(selector),
    sel = document.getElementById(id),
    filterId = sel.getAttribute("id"),
    filterType = filterId.split("-", 1),
    loopOver = ["Show All"];

  // set data attributes for filter
  for (var i = 0; i < selectedFilter.length; i++) {
    if (loopOver.indexOf(selectedFilter[i].innerHTML) === -1) {
      loopOver.push(selectedFilter[i].innerHTML);
    }
  }

  if (loopOver) {
    for (var i = 0; i < loopOver.length; i++) {
      var opt = document.createElement("button");
      opt.appendChild(document.createTextNode(loopOver[i]));
      opt.className = "btn";
      opt.setAttribute("data-filter", loopOver[i]);
      opt.setAttribute("data-filter-type", filterType);
      if (i == 0) {
        opt.className = "btn active";
      }
      sel.appendChild(opt);
    }
  }

  var filterLogic = document.querySelectorAll("#" + id + " .btn");

  for (var i = 0; i < filterLogic.length; i++) {
    filterLogic[i].addEventListener("click", selectFilter);
  }
}

// get all sibling buttons
function getSiblings(elem) {
  var siblings = [],
    sibling = elem.parentNode.firstChild;
  // Loop through each sibling and push to the array
  while (sibling) {
    // If the node is an element node, the nodeType property will return 1.
    if (sibling.nodeType === 1) {
      siblings.push(sibling);
    }
    sibling = sibling.nextSibling;
  }
  return siblings;
}

// btn click add remove active class
function selectFilter() {
  var elem = this,
    currentSiblings = getSiblings(elem);

  for (var i = 0; i < currentSiblings.length; i++) {
    if (currentSiblings[i].classList.contains("active")) {
      currentSiblings[i].classList.remove("active");
    }
  }
  elem.classList.add("active");
  resetFilter(elem);
  filterItems(
    elem.getAttribute("data-filter"),
    elem.getAttribute("data-filter-type")
  );
}

function resetFilter(currentFilter) {
  var getCurrentFilterId = currentFilter.parentElement.id;
  if (getCurrentFilterId == "location-filter") {
    resetOtherFilters("category-filter");
  } else if (getCurrentFilterId == "category-filter") {
    resetOtherFilters("location-filter");
  }
}

// reset another filter to default
function resetOtherFilters(elem) {
  var resetFilterElement = getSiblings(
    document.getElementById(elem).firstChild
  );
  for (var i = 0; i < resetFilterElement.length; i++) {
    if (resetFilterElement[i].classList.contains("active")) {
      resetFilterElement[i].classList.remove("active");
    }
  }
  resetFilterElement[0].classList.add("active");
}

//  Hide show images based on selected filter
function filterItems(filterData, filterType) {
  var filterValues = document.querySelectorAll("p#" + filterType + " > span"),
    allItems = document.querySelectorAll(".grid-row > .col");

  for (var i = 0; i < allItems.length; i++) {
    if (filterData.toLowerCase() == "show all") {
      if (allItems[i].classList.contains("hide")) {
        allItems[i].classList.remove("hide");
        allItems[i].classList.add("show");
      }
    } else if (allItems[i].classList.contains("show")) {
      allItems[i].classList.remove("show");
    }
    allItems[i].classList.add("hide");
  }

  for (var i = 0; i < filterValues.length; i++) {
    var parentCol = filterValues[i].parentElement.parentElement.parentElement;
    if (filterValues[i].innerHTML.toLowerCase() == filterData.toLowerCase()) {
      if (parentCol.classList.contains("hide")) {
        parentCol.classList.remove("hide");
        parentCol.classList.add("show");
      }
    }
  }
}

document.addEventListener("DOMContentLoaded", function () {
  uiBindings();
});
