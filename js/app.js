var imagesObject = function () {
  var imageData, // global object
    target = { location: 0, category: 0, data: false }; // target variable to store data for manipulation
  function init() {
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
    imageData = imagesLists;
    var filterUniqueValues = getUniqueArray(imagesLists);
    // create the filter buttons with the unique values returned from getUniqueArray
    createFilterButtons(filterUniqueValues.location, "location");
    createFilterButtons(filterUniqueValues.category, "category");
    addEvent(); // Add Click event to filter btns
    createGrid(imageData);
  }

  // Create Buttons from array list
  function createFilterButtons(loopOver, filterType) {
    if (loopOver.length > 0) {
      var sel = document.getElementById(filterType + "-filter");
      for (var i = 0; i < loopOver.length; i++) {
        var opt = document.createElement("button");
        opt.appendChild(document.createTextNode(loopOver[i]));
        opt.className = "btn filter-btn";
        opt.setAttribute("data-filter", loopOver[i]);
        opt.setAttribute("data-filter-type", filterType);
        sel.appendChild(opt);
      }
    }
  }

  // get unique values from the json array
  function getUniqueArray(imagesLists) {
    var location = {},
      category = {};
    // get only json values.
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_objects/Object/values
    Object.values(imagesLists).forEach(function (element) {
      // if unique value save to array with key as name and value as 1
      if (!(element.location in location)) {
        location[element.location] = 1;
      }
      if (!(element.category in location)) {
        category[element.category] = 1;
      }
    });
    // get the keys in the newly created object
    location = Object.keys(location);
    category = Object.keys(category);
    return {
      location: location,
      category: category,
    };
  }

  function addEvent() {
    var fillterDivRef = document.querySelector(".filter");
    fillterDivRef.addEventListener("click", function (e) {
      var currElem = e.target;
      addActiveClass(currElem);
      if (currElem.classList.contains("filter-btn")) {
        // get data attributes for the clicked element
        // https://developer.mozilla.org/en-US/docs/Web/API/HTMLOrForeignElement/dataset
        filterJson(currElem.dataset["filterType"], currElem.dataset["filter"]);
      }
    });
  }

  function filterJson(type, value) {
    target[type] = value;

    // making the copy of imageData
    target.data = imageData.slice();
    target.data = target.data.filter(function (elem) {
      // console.log(target);
      // if both category and location is selected
      if (target.category && target.location) {
        return (
          elem.category === target.category && elem.location === target.location
        );
      } else {
        // if any one is selected
        return elem[type] === value;
      }
    });
    // console.log(target.data);
    createGrid(target.data);
  }

  function addActiveClass(currElem) {
    var allBtns = getSiblings(currElem);
    for (var i = 0; i < allBtns.length; i++) {
      if (allBtns[i].classList.contains("active")) {
        allBtns[i].classList.remove("active");
      }
    }
    currElem.classList.add("active");
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

  // create grid layout
  function createGrid(imagesLists) {
    var gridRow = document.querySelector(".grid-row");
    gridRow.innerHTML = "";
    imagesLists.forEach(function (imagesList) {
      var col = document.createElement("div");
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
        imagesList.location +
        "</span></p>" +
        '<p id="category">Category : <span>' +
        imagesList.category +
        "</span></p>" +
        "</div>";
      gridRow.appendChild(col);
    });

    showSelectedValues(target);
  }

  function showSelectedValues(selectedValues) {
    console.log(selectedValues["data"].length == 0);
    var selectedDiv = document.querySelector(".selected-values");
    if (selectedValues["data"].length == 0) {
      selectedDiv.innerHTML = "";
      var para = document.createElement("p");
      para.appendChild(
        document.createTextNode(
          "No match found, Please try another combination"
        )
      );
      selectedDiv.appendChild(para);
    } else {
      if (selectedValues["data"]) {
        var selectedCat =
          selectedValues["category"] == 0 ? " " : selectedValues["category"];
        var selectedloc =
          selectedValues["location"] == 0 ? " " : selectedValues["location"];
        selectedDiv.innerHTML = "";
        var para = document.createElement("p");

        para.appendChild(
          document.createTextNode(selectedloc + " , " + selectedCat)
        );
        selectedDiv.appendChild(para);
      }
    }
  }

  // select dropdown filters
  function filterData(filterBy) {
    target.data = target.data || imageData.slice();
    // console.log(target);
    switch (filterBy) {
      case "ascending":
        target.data.sort(ascending);
        break;
      case "descending":
        target.data.sort(descending);
        break;
      case "alphabetically":
        target.data.sort(alphabetically);
        break;
      case "reverse":
        target.data.sort(reverse);
        break;
      default:
      // code block
    }
    createGrid(target.data);
  }
  function ascending(a, b) {
    return new Date(a.date).getTime() - new Date(b.date).getTime();
  }
  function descending(a, b) {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  }
  function alphabetically(a, b) {
    return a.title.localeCompare(b.title);
  }
  function reverse(a, b) {
    return b.title.localeCompare(a.title);
  }
  function showAll(e) {
    var allBtns = document.querySelectorAll(".btn");
    for (var i = 0; i < allBtns.length; i++) {
      if (allBtns[i].classList.contains("active")) {
        allBtns[i].classList.remove("active");
      }
    }
    target.category = target.location = 0;
    target.data = imageData;
    createGrid(imageData);
  }
  return {
    init: init,
    filterData: filterData,
    showAll: showAll,
  };
};
var app = imagesObject();
app.init();
