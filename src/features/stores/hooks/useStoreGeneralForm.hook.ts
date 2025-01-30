import { createStore, updateStore } from '@/actions/store'
import { Store } from '@/entities/stores/provider'
import { storeSchema } from '@/shared/schema/store'
import {
    CREATE_STORE_FIELDS,
    UPDATE_STORE_FIELDS,
} from '@/shared/utils/constant'
import { pick } from 'lodash'
import { FormHookProps, useForm } from './useForm.hook'

export const useStoreGeneralForm = ({
    store,
    ...props
}: Omit<
    FormHookProps<Partial<Store>>,
    'schema' | 'payload' | 'action' | 'saveChangesToState' | 'payload'
> & {
    store?: Partial<Store>
}) => {
    const isNewForm = props.id == 'new'

    const update = updateStore.bind(
        null,
        store?.id ? store?.id : -1,
        pick(store, UPDATE_STORE_FIELDS)
    )

    const create = createStore.bind(null, {
        ...pick(store, CREATE_STORE_FIELDS),
        storeOrderPerHours: store?.storeOrderPerHours?.map(
            storeOrderPerHour => ({
                weekName: storeOrderPerHour.weekName!,
                listOrderPerHours: storeOrderPerHour.listOrderPerHours!,
            })
        ),
    })

    const formProps = useForm({
        isGeneralForm: true,
        payload: {},
        saveChangesToState: () => {},

        ...props,
        action: !isNewForm ? update : create,
        schema: storeSchema,
        schemaInput: store,
        initialStateFields: {
            ...store,
        },
    })

    return formProps
}
