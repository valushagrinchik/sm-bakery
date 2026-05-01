export const twoDigitNumber = (number: number) => {
    return ('0' + number).slice(-2)
}

export const transformTimeToSlot = (time: string, slotMin: number = 30) => {
    const [hours, minuts] = time.split(':')
    return (+hours * 60 + +minuts) / slotMin
}

export const transformSlotToTime = (slot: number, slotMin: number = 30) => {
    return `${twoDigitNumber(Math.floor((slot * slotMin) / 60))}:${twoDigitNumber((slot * slotMin) % 60)}`
}
