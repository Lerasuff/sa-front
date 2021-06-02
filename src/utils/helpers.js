export const cardStatus = {
    deck: 'deck',
    battle: 'battle',
    deleted: 'deleted'
}

export const applyDrag = (arr, dragResult) => {
    const { removedIndex, addedIndex, payload } = dragResult
    if (removedIndex === null && addedIndex === null) return arr

    const result = [...arr]
    let itemToAdd = payload

    if (removedIndex !== null) {
        itemToAdd = result.splice(removedIndex, 1)[0]
    }

    if (addedIndex !== null) {
        result.splice(addedIndex, 0, itemToAdd)
    }

    return result
}

export const generateItems = (count, creator) => {
    const result = []
    for (let i = 0; i < count; i++) {
        result.push(creator(i))
    }
    return result
}

export const getRandomCharacteristic = max => {
    return String(Math.floor(Math.random() * max));
}

export const removeCard = (arr, card) => {
    let cardForDel = arr.indexOf(card);
    if (cardForDel >= 0) {
        if (card.props.status === cardStatus.deck) {
            arr.splice(cardForDel,1);
        } else {
            delete arr[cardForDel];
        }
    }
    return arr;
}

export const calcCardIndex = (line, pos, offset) => {
    return (line-1) * offset + (pos-1);
}