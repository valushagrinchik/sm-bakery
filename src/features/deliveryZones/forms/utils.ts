import {
    DeliverySubZone,
    DeliveryZoneTimeWork,
} from '@/entities/deliveryZones/provider'
import { DeliverySubZoneTimeWorkResponseDto } from '@/shared/lib/sanMartinApi/Api'
import { TIMEWORK_KEYS, WEEKDAYS } from '@/shared/utils/constant'
import {
    transformSlotToTime,
    transformTimeToSlot,
} from '@/shared/utils/timeFormat'
import { omit } from 'lodash'

export const validateAndCorrectSubzonesTimework = (
    deliveryZoneTimeWork: DeliveryZoneTimeWork,
    deliverySubZones: DeliverySubZone[]
) => {
    const incorrectItems = new Set()
    const correctedData = deliverySubZones.map(subzone => {
        if (!subzone.deliverySubZoneTimeWork) {
            return subzone
        }
        const correctedData = Object.fromEntries(
            TIMEWORK_KEYS.map(key => {
                const value =
                    subzone.deliverySubZoneTimeWork![
                        key as keyof DeliveryZoneTimeWork
                    ]
                if (WEEKDAYS.includes(key)) {
                    if (value != (deliveryZoneTimeWork as any)[key]) {
                        incorrectItems.add(subzone)
                        return [key, (deliveryZoneTimeWork as any)[key]]
                    }
                    return [key, value]
                }

                const zoneTime = deliveryZoneTimeWork[
                    key as keyof DeliveryZoneTimeWork
                ] as string

                if (!value || !zoneTime) {
                    return [key, zoneTime]
                }

                const zoneTimeSlot = transformTimeToSlot(zoneTime)
                const subZoneTimeSlot = transformTimeToSlot(value as string)

                if (key.endsWith('Open')) {
                    const closeZoneTime = deliveryZoneTimeWork[
                        key.replace(
                            'Open',
                            'Close'
                        ) as keyof DeliveryZoneTimeWork
                    ] as string
                    const closeZoneTimeSlot = transformTimeToSlot(closeZoneTime)

                    if (subZoneTimeSlot < zoneTimeSlot) {
                        incorrectItems.add(subzone)
                        return [key, transformSlotToTime(zoneTimeSlot)]
                    } else {
                        if (subZoneTimeSlot >= closeZoneTimeSlot) {
                            return [key, transformSlotToTime(zoneTimeSlot)]
                        }
                        return [key, value]
                    }
                }

                if (key.endsWith('Close')) {
                    const openZoneTime = deliveryZoneTimeWork[
                        key.replace(
                            'Close',
                            'Open'
                        ) as keyof DeliveryZoneTimeWork
                    ] as string
                    const openZoneTimeSlot = transformTimeToSlot(openZoneTime)

                    if (subZoneTimeSlot > zoneTimeSlot) {
                        incorrectItems.add(subzone)
                        return [key, transformSlotToTime(zoneTimeSlot)]
                    } else {
                        if (subZoneTimeSlot <= openZoneTimeSlot) {
                            return [key, transformSlotToTime(zoneTimeSlot)]
                        }
                        return [key, value]
                    }
                }
                return [key, value]
            })
        )

        return {
            ...subzone,
            deliverySubZoneTimeWork: {
                ...subzone.deliverySubZoneTimeWork,
                ...correctedData,
            },
        }
    })

    return {
        correctedData,
        incorrectItems: [...incorrectItems] as DeliverySubZone[],
    }
}

export const transformTimeWorkToCreate = (
    timeWork: DeliveryZoneTimeWork | DeliverySubZoneTimeWorkResponseDto
) => {
    const correctFields = omit(timeWork, [
        'id',
        'deliverySubZoneId',
        'createdAt',
        'updatedAt',
        'deliveryZoneId',
    ])
    return {
        ...correctFields,
        ...Object.fromEntries(
            Object.entries(correctFields).map(([key, value]) => [
                key,
                typeof value == 'string' && value ? value.slice(0, 5) : value,
            ])
        ),
    }
}
