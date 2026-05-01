import { Loader } from '@/shared/ui/Loader.ui'
import { FormModalLayout } from './FormModalLayout.ui'

export function FormLoading() {
    return (
        <FormModalLayout>
            <Loader />
        </FormModalLayout>
    )
}
