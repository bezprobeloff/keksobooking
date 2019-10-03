'use strict';

var ENTER_KEYCODE = 13;
var MAP_PIN_MAIN_HEIGHT = 65 + 16;
var MAP_PIN_MAIN_WIDTH = 33;
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
var mapDialog = document.querySelector('.map');
var mapPins = document.querySelector('.map__pins');
var adForm = document.querySelector('.ad-form');
var adFormSelectRooms = adForm.querySelector('select[name="rooms"]');
var adFormSelectCapacity = adForm.querySelector('select[name="capacity"]');
var adFormAdressInput = adForm.querySelector('input[name="address"]');
var adFormChildElementsList = adForm.querySelectorAll('fieldset, select, input');
var mapfiltersForm = document.querySelector('form.map__filters');
var mapfiltersFormChildElementsList = mapfiltersForm
  .querySelectorAll('fieldset, select, input');
var mapPinMain = document.querySelector('.map__pin--main');

var generateRandomNumberInRange = function (rangeMin, rangeMax) {
  return Math.floor(Math.random() * (rangeMax - rangeMin + 1)) + rangeMin;
};

var getRandomElementFromArray = function (arr) {
  return arr[generateRandomNumberInRange(0, arr.length - 1)];
};

var getListRandomValues = function (values) {
  return values.filter(function () {
    return generateRandomNumberInRange(0, 1);
  });
};

var generateOffersList = function (arrTypesOfHousing, arrCheckTimes,
    arrFeaturesHousing, arrPhotosHouse) {
  var offersList = [];

  for (var i = 1; i < 9; i++) {
    var locationX = generateRandomNumberInRange(0, 1200);
    var locationY = generateRandomNumberInRange(130, 630);
    offersList.push({
      author: {
        avatar: 'img/avatars/user0' + i + '.png'
      },

      offer: {
        title: 'Заголовок предложения №' + i,
        address: locationX + ', ' + locationY,
        price: generateRandomNumberInRange(0, 1000),
        type: getRandomElementFromArray(arrTypesOfHousing),
        rooms: generateRandomNumberInRange(1, 10),
        guests: generateRandomNumberInRange(0, 5),
        checkin: getRandomElementFromArray(arrCheckTimes),
        checkout: getRandomElementFromArray(arrCheckTimes),
        features: getListRandomValues(arrFeaturesHousing),
        description: 'Красивая хата №' + i,
        photos: getListRandomValues(arrPhotosHouse)
      },

      location: {
        x: locationX,
        y: locationY
      }
    });
  }

  return offersList;
};

var renderPin = function (pin) {
  var pinElement = pinTemplate.cloneNode(true);
  pinElement.style.left = pin.location.x + 'px';
  pinElement.style.top = pin.location.y + 'px';
  pinElement.querySelector('img').src = pin.author.avatar;
  pinElement.querySelector('img').alt = pin.offer.title;

  return pinElement;
};

var offersList = generateOffersList(TYPES_OF_HOUSING, CHECK_TIMES, FEATURES_HOUSING,
    PHOTOS_HOUSE);
var fragment = document.createDocumentFragment();

var enabledStatePage = function () {
  mapDialog.classList.remove('map--faded');
  adForm.classList.remove('ad-form--disabled');
  enabledStateElements(adFormChildElementsList);
  enabledStateElements(mapfiltersFormChildElementsList);

  for (var i = 0; i < offersList.length; i++) {
    fragment.appendChild(renderPin(offersList[i]));
  }
  mapPins.appendChild(fragment);
};

var disabledStateElements = function (arr) {
  for (var i = 0; i < arr.length; i++) {
    arr[i].setAttribute('disabled', 'disabled');
  }
};

var enabledStateElements = function (arr) {
  for (var i = 0; i < arr.length; i++) {
    arr[i].removeAttribute('disabled');
  }
};

var convertPxToNumber = function (str) {
  return parseInt(str.replace('px', ''), 10);
};

var getAddressMapPin = function (element) {
  adFormAdressInput.value = (convertPxToNumber(element.style.left) + MAP_PIN_MAIN_WIDTH)
    + ', ' + (convertPxToNumber(element.style.top) + MAP_PIN_MAIN_HEIGHT);

};

var checkValidityRoomsFromCapacity = function (countRooms, countCapacity) {
  if ((parseInt(countRooms, 10) === 100) && (countCapacity > 0)) {
    adFormSelectCapacity.setCustomValidity('Выберите вариант не для гостей');
  } else if (countRooms < countCapacity) {
    adFormSelectCapacity.setCustomValidity('Выберите не больше '
      + adFormSelectRooms.value + ' гостей[я]');
  }
};

mapPinMain.addEventListener('mousedown', function () {
  enabledStatePage();
  getAddressMapPin(mapPinMain);
});

mapPinMain.addEventListener('keydown', function (evt) {
  if (evt.keyCode === ENTER_KEYCODE) {
    enabledStatePage();
  }
});

adFormSelectRooms.addEventListener('click', function () {
  checkValidityRoomsFromCapacity(adFormSelectRooms.value, adFormSelectCapacity.value);
});

disabledStateElements(adFormChildElementsList);
disabledStateElements(mapfiltersFormChildElementsList);
checkValidityRoomsFromCapacity(adFormSelectRooms.value, adFormSelectCapacity.value);
