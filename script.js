'use strict';
var container = document.querySelector(".container");
var resultArr = [];
var time;

function shuffle(arr) {
  var currentIndex = arr.length,
    temporaryValue,
    randomIndex;
  while (0 !== currentIndex) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = arr[currentIndex];
    arr[currentIndex] = arr[randomIndex];
    arr[randomIndex] = temporaryValue;
  }
  return arr;
}

var winStr = "";
var renderField = function(fieldRows, fieldCols) {
  var arr = [];
  for (var i = 1; i < fieldRows * fieldCols; i++) {
    arr.push(i);
  }
  shuffle(arr);

  var fragment = document.createDocumentFragment();

  var chipList = document.createElement('ul');
  chipList.classList.add("field");
  chipList.style.width = 100 * fieldCols + "px";
  chipList.style.height = 100 * fieldRows + "px";
  chipList.style.gridTemplateColumns = "repeat(" + fieldCols + ", 1fr)";
  chipList.style.gridTemplateRows = "repeat(" + fieldRows + ", 1fr)";
  
  var col = 1;
  var row = 1;
  for (var j = 0; j < fieldRows * fieldCols; j++) {
    var li = document.createElement('li');
    li.innerText = arr[j];
    li.style.order = j + 1;
    li.classList.add("chip");
    if (col > fieldCols) {
      col = 1;
      row += 1;
    }
    li.setAttribute('data-index', 10 * row + col);
    chipList.appendChild(li);
    col++;
    winStr += j + 1;
  }
  winStr = winStr.slice(0, winStr.length - 1) + " ";
  var emptyLi = chipList.lastElementChild;
  emptyLi.innerText = '';
  emptyLi.setAttribute('id', 'empty');

  fragment.appendChild(chipList);
  container.innerHTML = "";
  container.appendChild(fragment);
  chipList.addEventListener('click', onChipClick);
  time = performance.now();
};


var onWin = function() {
    time = (performance.now() - time) / 1000;
    var winMessage = document.createElement("p");
    winMessage.innerText = "Ура! Вы решили головоломку за " + Math.floor(time / 60) + " мин " + Math.floor(time) + " c!";
    winMessage.classList.add("win-message");
    container.appendChild(winMessage);
}

var onChipClick = function(e) {
    var field = document.querySelector('.field');
    var targetChip = e.target;
    var targetChipIndex = +targetChip.getAttribute('data-index');
    var emptyChip = field.querySelector('#empty');
    var emptyChipIndex = +emptyChip.getAttribute('data-index');
    var emptyChipOrder = +emptyChip.style.order;
    if (targetChip.tagName != 'LI') return;
    if (targetChip == emptyChip) return;
  
    switch (targetChipIndex) {
      case emptyChipIndex + 1:
      case emptyChipIndex - 1:
      case emptyChipIndex + 10:
      case emptyChipIndex - 10:
        emptyChip.style.order = targetChip.style.order;
        targetChip.style.order = emptyChipOrder;
        emptyChip.setAttribute('data-index', targetChipIndex);
        targetChip.setAttribute('data-index', emptyChipIndex);
  
        resultArr[emptyChipIndex] = targetChip.innerText;
        resultArr[targetChipIndex] = " ";
        if (resultArr.join('') === winStr) {
            setTimeout(onWin, 300);
        }
    }
  };

var form = document.querySelector('.form');
form.addEventListener("submit", function(e) {
    e.preventDefault();
    var fieldCols = form.querySelector(".width").value;
    var fieldRows = form.querySelector(".height").value;
    renderField(fieldRows, fieldCols);
    document.querySelector('.submit').value = "Начать заново";
});