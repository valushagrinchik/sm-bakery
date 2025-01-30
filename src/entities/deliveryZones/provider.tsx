import {
    DeliverySubZoneResponseDto,
    DeliveryZoneStoresResponseDto,
    DeliveryZoneTimeWorkResponseDto,
    EntityStatus,
    PolygonDto,
    StoresDeliveryZone,
    UserResponseDto,
} from '@/shared/lib/sanMartinApi/Api'
import { createContext, useContext, useRef } from 'react'
import { createStore, useStore } from 'zustand'

export type DeliveryZone = {
    id?: number
    name: string
    countryId: number
    status: EntityStatus
    minOrderAmount: number | null
    maxOrderAmount: number | null
    deliveryZonePolygon: PolygonDto[]
    deliveryZoneTimeWork: DeliveryZoneTimeWork
    deliverySubZones: DeliverySubZone[]
    stores: DeliveryZoneStoresResponseDto[]
    operators: UserResponseDto[]
}

export type DeliverySubZone = Omit<DeliverySubZoneResponseDto, 'id'> & {
    id: number | string
}

export type DeliveryZoneStore = StoresDeliveryZone & {
    name: string
    status: EntityStatus
}
export type DeliveryZoneTimeWork = Omit<
    DeliveryZoneTimeWorkResponseDto,
    'id' | 'deliveryZoneId'
>

export interface DeliveryZoneStateProps {
    deliveryZone?: Partial<DeliveryZone>
    // for managing in separate modal
    deliveryZoneTimeWork?: DeliveryZoneTimeWork
    // for managing in separate modal
    deliverySubZones: DeliverySubZone[]
    deliverySubZoneInEdit?: DeliverySubZone
}

interface DeliveryZoneState extends DeliveryZoneStateProps {
    setDeliveryZone: (data: Partial<DeliveryZone>) => void
    setDeliveryZoneTimeWork: (data: {
        [P in keyof Partial<DeliveryZoneTimeWork>]: DeliveryZoneTimeWork[P]
    }) => void
    setDeliverySubZones: (data: DeliverySubZone[]) => void
}

type DeliveryZoneContext = ReturnType<typeof createDeliveryZoneContext>

const createDeliveryZoneContext = (
    initProps?: Partial<DeliveryZoneStateProps>
) => {
    const DEFAULT_PROPS: DeliveryZoneStateProps = {
        deliveryZone: undefined,
        deliverySubZones: [],
        deliveryZoneTimeWork: undefined,
        deliverySubZoneInEdit: undefined,
    }
    return createStore<DeliveryZoneState>()(set => ({
        ...DEFAULT_PROPS,
        ...initProps,
        setDeliveryZone: (data: Partial<DeliveryZone>) => {
            set((state: DeliveryZoneState) => ({
                ...state,
                deliveryZone: {
                    ...state.deliveryZone,
                    ...data,
                },
            }))
        },
        setDeliveryZoneTimeWork: (data: {
            [P in keyof Partial<DeliveryZoneTimeWork>]: DeliveryZoneTimeWork[P]
        }) => {
            set((state: DeliveryZoneState) => ({
                ...state,
                deliveryZoneTimeWork: {
                    monday: false,
                    tuesday: false,
                    wednesday: false,
                    thursday: false,
                    friday: false,
                    saturday: false,
                    sunday: false,
                    ...state.deliveryZoneTimeWork,
                    ...data,
                },
            }))
        },

        setDeliverySubZones: (data: DeliverySubZone[]) => {
            set((state: DeliveryZoneState) => ({
                ...state,
                deliverySubZones: data,
            }))
        },
    }))
}

export const DeliveryZoneContext = createContext<DeliveryZoneContext | null>(
    null
)
type DeliveryZoneProviderProps = React.PropsWithChildren<DeliveryZoneStateProps>

export const useDeliveryZoneContext = <T,>(
    selector: (state: DeliveryZoneState) => T
): T => {
    const store = useContext(DeliveryZoneContext)
    if (!store)
        throw new Error('Missing DeliveryZoneContext.Provider in the tree')
    return useStore(store, selector)
}

export const DeliveryZoneProvider = ({
    children,
    ...props
}: DeliveryZoneProviderProps) => {
    const storeRef = useRef<DeliveryZoneContext>()
    if (!storeRef.current) {
        storeRef.current = createDeliveryZoneContext(props)
    }
    return (
        <DeliveryZoneContext.Provider value={storeRef.current}>
            {children}
        </DeliveryZoneContext.Provider>
    )
}
