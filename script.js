'use strict';
var container = document.querySelector('.container');
var resultArr;
var winArr;
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

var renderField = function(fieldRows, fieldCols) {
  var arr = [];
  winArr = [];
  resultArr = [];
  var fieldSquare = fieldRows * fieldCols;
  for (var i = 1; i < fieldSquare; i++) {
    arr.push(i);
  }
  shuffle(arr);

  var fragment = document.createDocumentFragment();
  var chipList = document.createElement('ul');
  chipList.classList.add('field');
  chipList.style.width = 100 * fieldCols + 'px';
  chipList.style.height = 100 * fieldRows + 'px';
  chipList.style.gridTemplateColumns = 'repeat(' + fieldCols + ', 1fr)';
  chipList.style.gridTemplateRows = 'repeat(' + fieldRows + ', 1fr)';

  var col = 1;
  var row = 1;
  for (var j = 0; j < fieldSquare; j++) {
    if (col > fieldCols) {
      col = 1;
      row++;
    }

    var li = document.createElement('li');
    li.innerText = arr[j];
    li.style.order = j + 1;
    li.classList.add('chip');
    li.setAttribute('data-index', 10 * row + col);
    resultArr[10 * row + col] = arr[j];
    chipList.appendChild(li);
    col++;

    if (winArr.length < fieldSquare - 1) {
      winArr.push(j + 1);
    } else {
      winArr.push(' ');
    }
  }

  resultArr[fieldRows * 10 + +fieldCols] = ' ';

  chipList.lastElementChild.innerText = '';
  chipList.lastElementChild.setAttribute('id', 'empty');

  container.innerHTML = '';
  fragment.appendChild(chipList);
  container.appendChild(fragment);
  chipList.addEventListener('click', onChipClick);
  time = performance.now();
};

var onWin = function() {
  time = (performance.now() - time) / 1000;
  var timeInMins = Math.floor(time / 60);
  var winMessage = document.createElement('p');
  winMessage.innerText =
    'Ура! Вы решили головоломку за ' +
    timeInMins +
    ' мин ' +
    Math.floor(time - timeInMins * 60) +
    ' c!';
  winMessage.classList.add('win-message');
  container.appendChild(winMessage);
  var field = document.querySelector('.field');
  var chipList = document.querySelector('ul');
  chipList.removeEventListener('click', onChipClick);
};

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
      resultArr[targetChipIndex] = ' ';
      if (resultArr.join('') === winArr.join('')) {
        setTimeout(onWin, 300);
      }
  }
};

var form = document.querySelector('.form');
form.addEventListener('submit', function(e) {
  e.preventDefault();
  renderField(
    form.querySelector('.height').value,
    form.querySelector('.width').value
  );
  document.querySelector('.submit').value = 'Начать заново';
});
