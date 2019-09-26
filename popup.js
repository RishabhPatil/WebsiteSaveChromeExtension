// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

'use strict';

//
// MAIN
//

$("#form").toggle();
chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
  var url = tabs[0].url;

  //CHECK IF URL MATCHES ANYTHING
  chrome.storage.sync.get('data', function(data) {

    if(data.hasOwnProperty("data")) {
      for(var i in data["data"]) {
        console.log(data["data"]);
        if (url.includes(i)) {
          $("#patterntext").val(i);
          $("#notes").val(data["data"][i]["notes"]);
        }
      }
    }
  });

  // IF NOT
  var v = $("#patterntext").val();
  if (!v){
  $("#patterntext").val(url);
  }
});

chrome.storage.sync.get('data', function(data) {

  var txt = JSON.stringify(data);
  $("#ASDF").text(txt);

});
//
//  END MAIN
//

// // REMOVE LATER
// let changeColor = document.getElementById('changeColor');
// chrome.storage.sync.get('color', function(data) {
//   changeColor.style.backgroundColor = data.color;
//   changeColor.setAttribute('value', data.color);
// });

// // REMOVE LATER
// changeColor.onclick = function(element) {
//   let color = element.target.value;
//   chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
//     chrome.tabs.executeScript(
//         tabs[0].id,
//         {code: 'document.body.style.backgroundColor = "' + color + '";'});
//   });
// };

// ONCLICK HANDLERS
var viewFormCheckbox = document.getElementById('checkbox');
viewFormCheckbox.onclick = function(element) {
  $("#form").toggle();
};

var submitForm = document.getElementById('submit');
submitForm.onclick = function(ele) {

  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    var url = tabs[0].url;
    var start = Date.now();
    var pattern = $("#patterntext").val();
    var notes = $("#notes").val()
    var obj = {"url": url, "timestamp":start, "notes":notes};  
    updateData(pattern, obj);
  });

}

// FUNCTIONS
function getPrettyDate(timestamp) {
  var date = new Date(timestamp);
  var s = date.getDate().toString() + '-' + date.getMonth().toString() + '-' + date.getFullYear().toString();
  return s;
}

function updateData(key, value) {
  var oldValue = {};
  chrome.storage.sync.get('data', function(data) {
    if(!data.hasOwnProperty('data')) {
      data["data"] = {}
    }
    // oldValue = {}
    oldValue = data["data"];
    
    if(oldValue.hasOwnProperty(key)) {
      oldValue[key]["urls"].push(value["url"]);
      oldValue[key]["timestamp"] = value["timestamp"];
      oldValue[key]["notes"] = value["notes"];
    }
    else {
      oldValue[key] = {}
      oldValue[key]["urls"] = [value["url"]];
      oldValue[key]["timestamp"] = value["timestamp"];
      oldValue[key]["notes"] = value["notes"];
    }

    console.log(oldValue);

    chrome.storage.sync.set({"data": oldValue}, function() {
      console.log("NEW VALUE SET");
    });
  });
}

// SYNC:
//   "DATA": JSON
//     URL: KEY, returns json
//       "URL":  TEXT
//       "NOTES":  TEXT
//       "LAST MODIFIED": TIMESTAMP