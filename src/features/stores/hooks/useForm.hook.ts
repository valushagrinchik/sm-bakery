import { FormState } from '@/shared/types/form'
import { submitForm } from '@/shared/utils/formSubmit'
import { validateBySchema } from '@/shared/utils/validateBySchema'
import { RefObject, useActionState, useEffect, useState } from 'react'
import { ZodSchema } from 'zod'

export type FormHookProps<T> = {
    isGeneralForm?: boolean
    formRef: RefObject<HTMLFormElement>
    id: string
    action: any
    schema: ZodSchema
    payload: T
    schemaInput?: any
    saveChangesToState: (payload: T) => void
    isConfirmationNeeded?: () => boolean
    onSubmitSuccess: () => void
    initialStateFields?: any
}
export const useForm = <T>({
    isGeneralForm = false,
    formRef,
    id,
    initialStateFields = {},
    action,
    schema,
    payload,
    schemaInput,
    onSubmitSuccess,
    saveChangesToState,
    isConfirmationNeeded = () => {
        return false
    },
}: FormHookProps<T>) => {
    const isNewForm = id == 'new'
    const [errors, setErrors] = useState<Record<string, string | undefined>>({})

    const initialState = {
        errors: {},
        fields: initialStateFields,
    }

    const [state, formAction, isPending] = useActionState<FormState, FormData>(
        action,
        initialState
    )

    // server action after submit processing
    useEffect(() => {
        if (state.success == undefined) {
            return
        }
        if (state?.errors) {
            setErrors(errors => ({ ...errors, ...state?.errors }))
            return
        }

        if (state.success) {
            onSubmitSuccess()
        }
    }, [state])

    const validateRequiredFields = () => {
        const errorResponse = validateBySchema(schema, schemaInput || payload)

        if (errorResponse) {
            setErrors(errorResponse)
            return false
        }

        return true
    }

    const handleSubmitForm = () => {
        const valid = validateRequiredFields()
        if (!valid) {
            return
        }
        if (isConfirmationNeeded()) {
            return
        }
        if (isGeneralForm) {
            submitForm(formRef)
        } else {
            rawSubmitForm()
        }
    }

    // without validations
    const rawSubmitForm = () => {
        saveChangesToState(payload)

        if (!isNewForm) {
            submitForm(formRef)
        } else {
            onSubmitSuccess()
        }
    }

    return {
        errors,
        setErrors,
        onAfterFormSubmit: () => {},
        action: formAction,
        state,
        isPending,
        handleSubmitForm,
        rawSubmitForm,
    }
}
