
export function getNextStatus(originStatus) {
  switch (originStatus) {
    case 0:
      return 1;
    case 4:
      return 10;
    case 5:
      return 10;
    case 6:
      return 10;
    case 7:
      return 10;
    case 8:
      return 11;
    case 9:
      return 10;
    case 10:
      return 12;
    case 13:
      return 16;
    case 14:
      return 16;
    case 15:
      return 17;
    case 16:
      return 18;
    case 17:
      return 18;
    default:
      return -1;
  }
}
