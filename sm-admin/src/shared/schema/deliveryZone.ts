import { DeliveryZoneTimeWork } from '@/entities/deliveryZones/provider'
import {
    DeliverySubZoneType,
    EntityStatus,
} from '@/shared/lib/sanMartinApi/Api'
import { WEEKDAYS } from '@/shared/utils/constant'
import { z } from 'zod'

export const deliveryZoneSchema = z
    .object({
        name: z
            .string()
            .trim()
            .min(1, {
                message: 'IS_NOT_EMPTY',
            })
            .max(50, { message: 'INVALID' }),
        status: z.nativeEnum(EntityStatus),
        deliveryZoneTimeWork: z.any().optional(),
        deliveryZonePolygon: z
            .array(z.any())
            .min(1, { message: 'IS_NOT_EMPTY' }),
        minOrderAmount: z
            .number({ message: 'IS_NOT_EMPTY' })
            .min(1, { message: 'TOO_SMALL' })
            .max(1000, { message: 'TOO_BIG' })
            .nullable(),
        maxOrderAmount: z
            .number({ message: 'IS_NOT_EMPTY' })
            .min(100, { message: 'TOO_SMALL' })
            .max(5000, { message: 'TOO_BIG' })
            .nullable(),
    })
    .refine(
        input => {
            return !(
                input.status == EntityStatus.Active &&
                !WEEKDAYS.find(
                    day =>
                        input.deliveryZoneTimeWork &&
                        input.deliveryZoneTimeWork[
                            day as keyof DeliveryZoneTimeWork
                        ]
                )
            )
        },
        {
            path: ['deliveryZoneTimeWork'],
            message: 'IS_NOT_EMPTY',
        }
    )
    .refine(
        input => {
            return !(
                input.status == EntityStatus.Active && !input.minOrderAmount
            )
        },
        {
            path: ['minOrderAmount'],
            message: 'IS_NOT_EMPTY',
        }
    )
    .refine(
        input => {
            return !(
                input.status == EntityStatus.Active && !input.maxOrderAmount
            )
        },
        {
            path: ['maxOrderAmount'],
            message: 'IS_NOT_EMPTY',
        }
    )
    // both required if at least one of them defined
    .refine(
        input => {
            if (
                ![input.minOrderAmount, input.maxOrderAmount].every(
                    value => !value
                ) &&
                [input.minOrderAmount, input.maxOrderAmount].some(
                    value => !value
                )
            ) {
                return false
            }
            return true
        },
        val => ({
            path: [
                ['minOrderAmount', 'maxOrderAmount'].find(
                    key => !(val as any)[key]
                )!,
            ],
            message: 'IS_NOT_EMPTY',
        })
    )
    // compare values when both defined
    .refine(
        input => {
            if (
                [input.minOrderAmount, input.maxOrderAmount].every(
                    value => !!value
                ) &&
                input.minOrderAmount! >= input.maxOrderAmount!
            ) {
                return false
            }
            return true
        },
        {
            path: ['minOrderAmount'],
            message: 'SHOULD_BE_LESS',
        }
    )
    .refine(
        input => {
            if (
                [input.minOrderAmount, input.maxOrderAmount].every(
                    value => !!value
                ) &&
                input.minOrderAmount! >= input.maxOrderAmount!
            ) {
                return false
            }
            return true
        },
        {
            path: ['maxOrderAmount'],
            message: 'SHOULD_BE_LESS',
        }
    )
const deliverySubZoneSchema = z
    .object({
        deliveryZonePolygon: z.array(z.any()),
        type: z.nativeEnum(DeliverySubZoneType),
    })
    .refine(
        input => {
            return !!input.deliveryZonePolygon.length
        },
        {
            path: ['deliveryZonePolygon'],
            message: 'IS_NOT_EMPTY',
        }
    )
    .refine(
        input => {
            return !!input.deliveryZonePolygon.length
        },
        {
            path: ['deliveryZonePolygonNotification'],
            message: 'IS_NOT_EMPTY',
        }
    )

export const deliverySubZonesSchema = z.array(deliverySubZoneSchema)

export const setMainStorePayloadSchema = z.object({
    storeId: z.number({ message: 'IS_NOT_EMPTY' }),
})
