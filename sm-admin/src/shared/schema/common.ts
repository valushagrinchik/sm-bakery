import { transformTimeToSlot } from '@/shared/utils/timeFormat'
import { z } from 'zod'

export const anySchema = z.any()

export const storeTimeworkSchema = z
    .object({
        monday: z.boolean(),
        tuesday: z.boolean(),
        wednesday: z.boolean(),
        thursday: z.boolean(),
        friday: z.boolean(),
        saturday: z.boolean(),
        sunday: z.boolean(),
        mondayOpen: z.string().nullish(),
        mondayClose: z.string().nullish(),
        tuesdayOpen: z.string().nullish(),
        tuesdayClose: z.string().nullish(),
        wednesdayOpen: z.string().nullish(),
        wednesdayClose: z.string().nullish(),
        thursdayOpen: z.string().nullish(),
        thursdayClose: z.string().nullish(),
        fridayOpen: z.string().nullish(),
        fridayClose: z.string().nullish(),
        saturdayOpen: z.string().nullish(),
        saturdayClose: z.string().nullish(),
        sundayOpen: z.string().nullish(),
        sundayClose: z.string().nullish(),
    })
    .refine(
        input => {
            return !(input.monday && !input.mondayOpen)
        },
        {
            path: ['mondayOpen'],
            message: 'IS_NOT_EMPTY',
        }
    )
    .refine(
        input => {
            return !(input.monday && !input.mondayClose)
        },
        {
            path: ['mondayClose'],
            message: 'IS_NOT_EMPTY',
        }
    )
    .refine(
        input => {
            return !(input.tuesday && !input.tuesdayOpen)
        },
        {
            path: ['tuesdayOpen'],
            message: 'IS_NOT_EMPTY',
        }
    )
    .refine(
        input => {
            return !(input.tuesday && !input.tuesdayClose)
        },
        {
            path: ['tuesdayClose'],
            message: 'IS_NOT_EMPTY',
        }
    )
    .refine(
        input => {
            return !(input.wednesday && !input.wednesdayOpen)
        },
        {
            path: ['wednesdayOpen'],
            message: 'IS_NOT_EMPTY',
        }
    )
    .refine(
        input => {
            return !(input.wednesday && !input.wednesdayClose)
        },
        {
            path: ['wednesdayClose'],
            message: 'IS_NOT_EMPTY',
        }
    )
    .refine(
        input => {
            return !(input.thursday && !input.thursdayOpen)
        },
        {
            path: ['thursdayOpen'],
            message: 'IS_NOT_EMPTY',
        }
    )
    .refine(
        input => {
            return !(input.thursday && !input.thursdayClose)
        },
        {
            path: ['thursdayClose'],
            message: 'IS_NOT_EMPTY',
        }
    )
    .refine(
        input => {
            return !(input.friday && !input.fridayOpen)
        },
        {
            path: ['fridayOpen'],
            message: 'IS_NOT_EMPTY',
        }
    )
    .refine(
        input => {
            return !(input.friday && !input.fridayClose)
        },
        {
            path: ['fridayClose'],
            message: 'IS_NOT_EMPTY',
        }
    )
    .refine(
        input => {
            return !(input.saturday && !input.saturdayOpen)
        },
        {
            path: ['saturdayOpen'],
            message: 'IS_NOT_EMPTY',
        }
    )
    .refine(
        input => {
            return !(input.saturday && !input.saturdayClose)
        },
        {
            path: ['saturdayClose'],
            message: 'IS_NOT_EMPTY',
        }
    )
    .refine(
        input => {
            return !(input.sunday && !input.sundayOpen)
        },
        {
            path: ['sundayOpen'],
            message: 'IS_NOT_EMPTY',
        }
    )
    .refine(
        input => {
            return !(input.sunday && !input.sundayClose)
        },
        {
            path: ['sundayClose'],
            message: 'IS_NOT_EMPTY',
        }
    )
    .refine(
        input => {
            return !(
                input.monday &&
                input.mondayOpen &&
                input.mondayClose &&
                transformTimeToSlot(input.mondayClose) <=
                    transformTimeToSlot(input.mondayOpen)
            )
        },
        {
            path: ['mondayTime'],
            message: 'CLOSE_TIME_IS_NOT_CORRECT',
        }
    )
    .refine(
        input => {
            return !(
                input.tuesday &&
                input.tuesdayOpen &&
                input.tuesdayClose &&
                transformTimeToSlot(input.tuesdayClose) <=
                    transformTimeToSlot(input.tuesdayOpen)
            )
        },
        {
            path: ['tuesdayTime'],
            message: 'CLOSE_TIME_IS_NOT_CORRECT',
        }
    )
    .refine(
        input => {
            return !(
                input.wednesday &&
                input.wednesdayOpen &&
                input.wednesdayClose &&
                transformTimeToSlot(input.wednesdayClose) <=
                    transformTimeToSlot(input.wednesdayOpen)
            )
        },
        {
            path: ['wednesdayTime'],
            message: 'CLOSE_TIME_IS_NOT_CORRECT',
        }
    )
    .refine(
        input => {
            return !(
                input.thursday &&
                input.thursdayOpen &&
                input.thursdayClose &&
                transformTimeToSlot(input.thursdayClose) <=
                    transformTimeToSlot(input.thursdayOpen)
            )
        },
        {
            path: ['thursdayTime'],
            message: 'CLOSE_TIME_IS_NOT_CORRECT',
        }
    )
    .refine(
        input => {
            return !(
                input.friday &&
                input.fridayOpen &&
                input.fridayClose &&
                transformTimeToSlot(input.fridayClose) <=
                    transformTimeToSlot(input.fridayOpen)
            )
        },
        {
            path: ['fridayTime'],
            message: 'CLOSE_TIME_IS_NOT_CORRECT',
        }
    )
    .refine(
        input => {
            return !(
                input.saturday &&
                input.saturdayOpen &&
                input.saturdayClose &&
                transformTimeToSlot(input.saturdayClose) <=
                    transformTimeToSlot(input.saturdayOpen)
            )
        },
        {
            path: ['saturdayTime'],
            message: 'CLOSE_TIME_IS_NOT_CORRECT',
        }
    )
    .refine(
        input => {
            return !(
                input.sunday &&
                input.sundayOpen &&
                input.sundayClose &&
                transformTimeToSlot(input.sundayClose) <=
                    transformTimeToSlot(input.sundayOpen)
            )
        },
        {
            path: ['sundayTime'],
            message: 'CLOSE_TIME_IS_NOT_CORRECT',
        }
    )
