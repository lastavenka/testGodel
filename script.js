'use strict';

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

var arr = [];
for (var i = 0; i < 8; i++) {
    arr.push(i);
}
shuffle(arr);

var chips = document.querySelectorAll('li');
console.log(chips);
for (var i = 0; i < chips.length; i++) {
  chips[i].innerText = arr[i];
  chips[chips.length - 1].innerText = '';
}

var onChipClick = function(e) {
  var target = e.target;
  if (target.tagName != 'LI') return;
  console.log('Chip');
};

var field = document.querySelector('.field');
field.addEventListener('click', onChipClick);
