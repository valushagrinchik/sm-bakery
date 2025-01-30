import { EntityStatus } from '@/shared/lib/sanMartinApi/Api'
import { WEEKDAYS } from '@/shared/utils/constant'
import { z } from 'zod'

export const storeSchema = z
    .object({
        name: z
            .string({ message: 'IS_NOT_EMPTY' })
            .trim()
            .min(1, {
                message: 'IS_NOT_EMPTY',
            })
            .max(50, { message: 'INVALID' })
            .refine(
                value =>
                    /^[a-zA-Z\d\s\^\$\*\.\[\]\{\}\(\)\?\-\"\!\@\#\%\&\/\\\,\>\<\'\:\;\|\_\~\`\+\=áéíóúüñÑüÃÍÖöŠšé]*$/.test(
                        value ?? ''
                    ),
                'INVALID'
            ),
        status: z.nativeEnum(EntityStatus),
        inventoryId: z
            .string({ message: 'IS_NOT_EMPTY' })
            .trim()
            .min(1, {
                message: 'IS_NOT_EMPTY',
            })
            .refine(
                value =>
                    value.match(
                        /[a-zA-Z\d]{8}-[a-zA-Z\d]{4}-4[a-zA-Z\d]{3}-[89AB]{1}[a-zA-Z\d]{3}-[a-zA-Z\d]{12}/
                    ),
                'INVALID'
            ),
        countryId: z.number(),
        servicePhone: z.string().nullish(),
        standardDeliveryTime: z
            .number({ message: 'IS_NOT_EMPTY' })
            .min(1, { message: 'TOO_SMALL' })
            .max(500, { message: 'TOO_BIG' })
            .nullish(),
        maxOrderLag: z
            .number({ message: 'IS_NOT_EMPTY' })
            .min(1, { message: 'TOO_SMALL' })
            .max(500, { message: 'TOO_BIG' })
            .nullish(),
        deliveryZoneId: z.any().nullish(),
        positionLat: z.any().nullish(),
        positionLng: z.any().nullish(),
        storeTimeWork: z.any().nullish(),
    })
    .refine(
        input => {
            return !(input.status == EntityStatus.Active && !input.maxOrderLag)
        },
        {
            path: ['maxOrderLag'],
            message: 'IS_NOT_EMPTY',
        }
    )
    .refine(
        input => {
            return !(
                input.status == EntityStatus.Active &&
                !input.standardDeliveryTime
            )
        },
        {
            path: ['standardDeliveryTime'],
            message: 'IS_NOT_EMPTY',
        }
    )
    .refine(
        input => {
            return !(input.status == EntityStatus.Active && !input.servicePhone)
        },
        {
            path: ['servicePhone'],
            message: 'IS_NOT_EMPTY',
        }
    )
    .refine(
        input => {
            return !(
                input.status == EntityStatus.Active &&
                !(input.positionLat && input.positionLng)
            )
        },
        {
            path: ['deliveryZoneId'],
            message: 'IS_NOT_EMPTY',
        }
    )

    .refine(
        input => {
            return !(
                input.status == EntityStatus.Active &&
                !WEEKDAYS.find(
                    day => input.storeTimeWork && input.storeTimeWork[day]
                )
            )
        },
        {
            path: ['storeTimeWork'],
            message: 'IS_NOT_EMPTY',
        }
    )

export const storeOrderPerHoursSchema = (keys: string[]) => {
    return z.object(
        Object.fromEntries(
            keys.map(key => [
                key,
                z
                    .number()
                    .int({ message: 'INVALID' })
                    .min(10, {
                        message: 'TOO_SMALL',
                    })
                    .max(100, {
                        message: 'TOO_BIG',
                    }),
            ])
        )
    )
}

export const addressAndDeliveryZoneSchema = z
    .object({
        address: z
            .string({ message: 'IS_NOT_EMPTY' })
            .trim()
            .min(1, {
                message: 'IS_NOT_EMPTY',
            })
            .max(100, { message: 'INVALID' })
            .refine(
                value =>
                    value
                        ? /^[a-zA-Z\d\.\-\+\s\,\_\'\(\)\/&áéíóúüñÑüÃÍÖöŠšé]*$/.test(
                              value
                          )
                        : true,
                'INVALID'
            ),
        positionLat: z.number().nullish(),
        positionLng: z.number().nullish(),
    })
    .refine(
        input => {
            return input.positionLat && input.positionLng
        },
        {
            path: ['position'],
            message: 'IS_NOT_EMPTY',
        }
    )
    .refine(
        input => {
            return input.positionLat && input.positionLng
        },
        {
            path: ['deliveryZonePolygonNotification'],
            message: 'IS_NOT_EMPTY',
        }
    )
