import {createRandomCharacters, createRandomNumbers} from "./random";

let defaultAddress = {
  firstName: null,
  lastName: null,
  address1: null,
  address2: null,
  city: null,
  state: null,
  zip: null,
  tel: null,
  fullZip: null,
  country: null
}

export function getAddress(location, userSn, firstName, lastName) {
  let address = Object.assign({}, defaultAddress);

  switch (location) {
    // case "US1":
    //   address.firstName = firstName;
    //   address.lastName = lastName;
    //   address.address1 = createRandomCharacters(4, false) + " 277A Randolph Ave";
    //   address.address2 = userSn;
    //   address.city = "Jersey City";
    //   address.state = "NJ";
    //   address.zip = "07304";
    //   address.tel = "732" + createRandomNumbers(7);
    //   address.fullZip = "07304-2719";
    //   return address;
    case "US2":
      address.firstName = firstName;
      address.lastName = lastName;
      address.address1 = "830 S GArfield Ave";
      address.address2 = userSn;
      address.city = "Monterey Park";
      address.state = "CA";
      address.zip = "91754";
      address.tel = "626" + createRandomNumbers(7);
      address.fullZip = "91754-3957";
      return address;
    case "CA":
      address.firstName = firstName;
      address.lastName = lastName;
      address.address1 = "410 deer view avenue";
      address.address2 = userSn;
      address.city = "Ottawa";
      address.state = "Ontario";
      address.zip = "K1T0B8";
      address.tel = "836716" + createRandomNumbers(4);
      return address;
    case "DE":
      address.firstName = createRandomCharacters(2, true) + " Fei";
      address.lastName = "CHEN";
      address.address1 = createRandomCharacters(3, false) + " Zschopauer Str 40";
      address.address2 = userSn;
      address.city = "Chemnitz";
      address.state = "Sachsen";
      address.zip = "09111";
      address.tel = "176" + createRandomNumbers(8);
      return address;
    case "NL":
      address.firstName = firstName;
      address.lastName = "Simply";
      address.address1 = "Arend Vijfvinkelplein 39";
      address.address2 = userSn;
      address.city = "Den Haag";
      address.state = "Zuid Holland";
      address.zip = "2552RX";
      address.tel = "06" + createRandomNumbers(8);
      address.fullZip = "91754-3957";
      return address;
    case "IT":
      address.firstName = firstName;
      address.lastName = "bisacca";
      let random = Math.floor(Math.random() * 3);
      if (random === 0) {
        address.address1 = createRandomCharacters(4, true) + " corso ferrucci 99";
      } else if (random === 1) {
        address.address1 = "corso ferrucci " + createRandomCharacters(3, true) + " 99";
      } else {
        address.address1 = "corso ferrucci 99 " + createRandomCharacters(3, true);
      }
      address.address2 = "bisacca " + userSn;
      address.city = "Torino";
      address.state = "Torino";
      address.zip = "10138";
      address.tel = "3396" + createRandomNumbers(6);
      return address;
    case "SP":
      address.firstName = "Jing";
      address.lastName = "Cong";
      address.address1 = createRandomCharacters(4, false) + " Crete 80，puerta 303";
      address.address2 = userSn;
      address.city = "Gran Alacant";
      address.state = "Alicante";
      address.zip = "03130";
      address.tel = "688" + createRandomNumbers(6);
      address.country = "España";
      return address;
    // case "EN":
    //   address.firstName = "LINBO";
    //   address.lastName = userSn;
    //   address.address1 = "Unit 1B Astor road";
    //   address.address2 = userSn;
    //   address.city = "Salford";
    //   address.state = "Lancashire";
    //   address.zip = "M50 1BB";
    //   address.tel = "07" + createRandomNumbers(9);
    //   address.country = "United Kingdom";
    //   return address;
    case "UK":
      address.firstName = userSn + "+任意";
      address.lastName = "Yuan";
      address.address1 = "13 Small Street";
      address.address2 = "Flat 4";
      address.city = "Bristol";
      address.state = "Somerset";
      address.zip = "BS1 1DE";
      address.tel = "0752" + createRandomNumbers(7);
      address.country = "United Kingdom";
      return address;
    case "AU":
      address.firstName = "Zhiren";
      address.lastName = "Sun";
      address.address1 = createRandomCharacters(4, false) + " 12 Jackson Green Bvd";
      address.address2 = userSn;
      address.city = "South Clayton";
      address.state = "Victoria";
      address.zip = "3128";
      address.tel = "04" + createRandomNumbers(8);
      return address;
    case "JP":
      address.firstName = "FENG YUANZHE";
      address.lastName = lastName;
      address.address1 = "西荻南2-27-6";
      address.address2 = "メインステージ西荻窪ⅱ 201室";
      address.city = "杉並区";
      address.state = "東京都";
      address.zip = "167-0053";
      address.tel = "08096992125";
      return address;
    case "HK":
      address.firstName = userSn;
      address.lastName = lastName;
      address.address1 = "Tuen Mun Yan Tin Estate";
      address.address2 = "Hei Tin House 1917 ROOM";
      address.city = "Tuen Mun";
      address.zip = "999077";
      address.tel = "63388352";
      return address;
  }
}
