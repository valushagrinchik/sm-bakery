import { RefObject } from 'react'

export const submitForm = (formRef: RefObject<HTMLFormElement>) => {
    if (formRef?.current?.requestSubmit) {
        formRef?.current?.requestSubmit()
    } else {
        formRef?.current?.submit()
    }
}
