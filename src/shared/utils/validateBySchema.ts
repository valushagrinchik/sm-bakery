import { ZodSchema } from 'zod'

export const validateBySchema = (schema: ZodSchema, payload: any) => {
    const result = schema.safeParse(payload)

    if (result.error) {
        const errors: any = {}
        result.error?.errors.map(error => {
            errors[error.path.join('_')] = error.message
        })
        return errors
    }
}
