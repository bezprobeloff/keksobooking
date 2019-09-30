'use strict';

var TYPES_OF_HOUSING = ['palace', 'flat', 'house', 'bungalo'];
var CHECK_TIMES = ['12:00', '13:00', '14:00'];
var FEATURES_HOUSING = ['wifi', 'dishwasher', 'parking', 'washer',
  'elevator', 'conditioner'];
var PHOTOS_HOUSE = ['http://o0.github.io/assets/images/tokyo/hotel1.jpg',
  'http://o0.github.io/assets/images/tokyo/hotel2.jpg',
  'http://o0.github.io/assets/images/tokyo/hotel3.jpg'];

var pinTemplate = document.querySelector('#pin')
  .content
  .querySelector('.map__pin');

var generateRandomNumberInRange = function (rangeMin, rangeMax) {
  return Math.floor(Math.random() * (rangeMax - rangeMin + 1)) + rangeMin;
};

var getRandomElement = function (arr) {
  return arr[generateRandomNumberInRange(0, arr.length - 1)];
};

var getRandomArray = function (arr) {
  var arrTemp = [];
  var maxLength = generateRandomNumberInRange(1, arr.length - 1);

  for (var i = 0; i < maxLength; i++) {
    arrTemp.push(getRandomElement(arr));
  }

  return arrTemp;
};

var generateCards = function () {
  var cards = [];

  for (var i = 1; i < 9; i++) {
    var locationX = generateRandomNumberInRange(0, 1200);
    var locationY = generateRandomNumberInRange(130, 630);
    cards.push({
      author: {
        avatar: 'img/avatars/user0' + i + '.png'
      },

      offer: {
        title: 'Заголовок предложения №' + i,
        address: locationX + ', ' + locationY,
        price: generateRandomNumberInRange(0, 1000),
        type: getRandomElement(TYPES_OF_HOUSING),
        rooms: generateRandomNumberInRange(1, 10),
        guests: generateRandomNumberInRange(0, 5),
        checkin: getRandomElement(CHECK_TIMES),
        checkout: getRandomElement(CHECK_TIMES),
        features: getRandomArray(FEATURES_HOUSING),
        description: 'Красивая хата №' + i,
        photos: getRandomArray(PHOTOS_HOUSE)
      },

      location: {
        x: locationX,
        y: locationY
      }
    });
  }

  return cards;
};

var cards = generateCards();

var renderPin = function (pin) {
  var pinElement = pinTemplate.cloneNode(true);
  pinElement.style.left = pin.location.x + 'px';
  pinElement.style.top = pin.location.y + 'px';
  pinElement.querySelector('img').src = pin.author.avatar;
  pinElement.querySelector('img').alt = pin.offer.title;

  return pinElement;
};

var fragment = document.createDocumentFragment();
for (var i = 0; i < cards.length; i++) {
  fragment.appendChild(renderPin(cards[i]));
}

var mapPins = document.querySelector('.map__pins');
mapPins.appendChild(fragment);

var mapDialog = document.querySelector('.map');
mapDialog.classList.remove('map--faded');
