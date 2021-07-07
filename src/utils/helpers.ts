import { CardModel } from '@/contracts/CardModel';

export const removeCard = (arr: CardModel[], card: CardModel): CardModel[] => {
  const cardForDel: number = arr.indexOf(card);
  if (cardForDel >= 0) {
    if (cardForDel) {
      arr.splice(cardForDel, 1);
    } else {
      delete arr[cardForDel];
    }
  }
  return arr;
};
