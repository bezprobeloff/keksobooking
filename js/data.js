'use strict';

(function () {












  var TYPES_OF_HOUSING = ['palace', 'flat', 'house', 'bungalo'];
  var CHECK_TIMES = ['12:00', '13:00', '14:00'];
  var FEATURES_HOUSING = ['wifi', 'dishwasher', 'parking', 'washer',
    'elevator', 'conditioner'];
  var PHOTOS_HOUSE = ['http://o0.github.io/assets/images/tokyo/hotel1.jpg',
    'http://o0.github.io/assets/images/tokyo/hotel2.jpg',
    'http://o0.github.io/assets/images/tokyo/hotel3.jpg'];
  var offersList;

  var generateOffersList = function (arrTypesOfHousing, arrCheckTimes,
      arrFeaturesHousing, arrPhotosHouse) {
    var offersListNew = [];

    for (var i = 1; i < 9; i++) {
      var locationX = window.common.generateRandomNumberInRange(0, 1200);
      var locationY = window.common.generateRandomNumberInRange(130, 630);
      offersListNew.push({
        author: {
          avatar: 'img/avatars/user0' + i + '.png'
        },

        offer: {
          title: 'Заголовок предложения №' + i,
          address: locationX + ', ' + locationY,
          price: window.common.generateRandomNumberInRange(0, 1000),
          type: window.common.getRandomElementFromArray(arrTypesOfHousing),
          rooms: window.common.generateRandomNumberInRange(1, 10),
          guests: window.common.generateRandomNumberInRange(0, 5),
          checkin: window.common.getRandomElementFromArray(arrCheckTimes),
          checkout: window.common.getRandomElementFromArray(arrCheckTimes),
          features: window.common.getListRandomValues(arrFeaturesHousing),
          description: 'Красивая хата №' + i,
          photos: window.common.getListRandomValues(arrPhotosHouse)
        },

        location: {
          x: locationX,
          y: locationY
        }
      });
    }

    return offersListNew;
  };

  offersList = generateOffersList(TYPES_OF_HOUSING, CHECK_TIMES,
      FEATURES_HOUSING, PHOTOS_HOUSE);

  window.data = {
    offersList: offersList
  };

})();
