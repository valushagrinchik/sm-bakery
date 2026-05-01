import { updateStoreTimeWork } from '@/actions/store'
import { Store, StoreTimeWork } from '@/entities/stores/provider'
import { storeTimeworkSchema } from '@/shared/schema/common'
import { TIMEWORK_KEYS } from '@/shared/utils/constant'
import { pick } from 'lodash'
import { FormHookProps, useForm } from './useForm.hook'

const transformTimeWorkToCreate = (timeWork: StoreTimeWork) => {
    const correctFields = pick(timeWork, TIMEWORK_KEYS)
    return {
        ...correctFields,
        ...Object.fromEntries(
            Object.entries(correctFields).map(([key, value]) => [
                key,
                typeof value == 'string' && value ? value.slice(0, 5) : value,
            ])
        ),
    } as StoreTimeWork
}

export const useStoreWorkingHours = ({
    store,
    storeTimeWork,
    ...props
}: Omit<FormHookProps<StoreTimeWork>, 'schema' | 'payload' | 'action'> & {
    store?: Partial<Store>
    storeTimeWork: StoreTimeWork
}) => {
    const update = updateStoreTimeWork.bind(
        null,
        store?.id ? store?.id : -1,
        transformTimeWorkToCreate(storeTimeWork)
    )

    const formProps = useForm({
        ...props,
        action: update,
        schema: storeTimeworkSchema,
        payload: storeTimeWork,
        initialStateFields: {},
    })

    return formProps
}
