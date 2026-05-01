import { updateStoreOrderPerHours } from '@/actions/store'
import { Store, StoreOrderPerHour } from '@/entities/stores/provider'
import {
    ListOrderPerHoursDto,
    StoreOrderPerHoursDto,
    WeekName,
} from '@/shared/lib/sanMartinApi/Api'
import { storeOrderPerHoursSchema } from '@/shared/schema/store'
import { FormHookProps, useForm } from './useForm.hook'

export const useStoreMaxOrderAmountForm = ({
    store,
    setStore,
    workingHoursDay,
    storeAmountsPerHours,
    ...props
}: Omit<
    FormHookProps<StoreOrderPerHour[]>,
    'schema' | 'payload' | 'action' | 'saveChangesToState'
> & {
    store?: Partial<Store>
    setStore: (store: Partial<Store>) => void
    workingHoursDay: string
    storeAmountsPerHours: ListOrderPerHoursDto[]
}) => {
    const dataToStore =
        store?.storeOrderPerHours &&
        store?.storeOrderPerHours.find(
            dayData => dayData.weekName == workingHoursDay
        )
            ? store?.storeOrderPerHours.map(dayData =>
                  dayData.weekName == workingHoursDay
                      ? {
                            weekName: workingHoursDay! as WeekName,
                            listOrderPerHours: storeAmountsPerHours,
                        }
                      : {
                            weekName: dayData.weekName!,
                            listOrderPerHours: dayData.listOrderPerHours!,
                        }
              )
            : (store?.storeOrderPerHours || [])
                  .map(v => v as StoreOrderPerHoursDto)
                  .concat({
                      weekName: workingHoursDay! as WeekName,
                      listOrderPerHours: storeAmountsPerHours,
                  })

    const update = updateStoreOrderPerHours.bind(
        null,
        store?.id ? store?.id : -1,
        dataToStore
    )

    const formProps = useForm({
        ...props,
        action: update,
        schema: storeOrderPerHoursSchema(
            storeAmountsPerHours.map(o => o.timePeriod)
        ),
        schemaInput: Object.fromEntries(
            storeAmountsPerHours.map(o => [o.timePeriod, o.maxOrderAmount])
        ),
        payload: dataToStore,
        saveChangesToState: () => {
            setStore({ storeOrderPerHours: dataToStore })
        },
        initialStateFields: Object.fromEntries(
            storeAmountsPerHours.map(data => [
                data.timePeriod,
                data.maxOrderAmount,
            ])
        ),
    })

    return formProps
}
