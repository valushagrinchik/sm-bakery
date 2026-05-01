import {
    EntityStatus,
    StoreOrderPerHoursDto,
    StoreOrderPerHoursResponseDto,
    StoresTimeWorkCreateDto,
    StoresTimeWorkResponseDto,
    UserResponseDto,
} from '@/shared/lib/sanMartinApi/Api'
import { createContext, useContext, useRef } from 'react'
import { createStore, useStore } from 'zustand'

export interface Store {
    id?: number
    name: string
    inventoryId: string
    status: EntityStatus
    countryId: number
    servicePhone: string
    standardDeliveryTime: number
    maxOrderLag: number
    address?: string
    positionLat?: number
    positionLng?: number
    deliveryZoneId?: number
    isMainStore?: boolean
    storeTimeWork?: StoresTimeWorkCreateDto
    storeOrderPerHours?: StoreOrderPerHoursDto[]
    operators: UserResponseDto[]
}

export type StoreTimeWork = Omit<StoresTimeWorkResponseDto, 'id' | 'storeId'>
export type StoreOrderPerHour = Required<
    Omit<StoreOrderPerHoursResponseDto, 'storeId'>
>
export interface StoresStateProps {
    store?: Partial<Store>
    storeTimeWork?: StoreTimeWork
}

interface StoresState extends StoresStateProps {
    setStore: (data: Partial<Store>) => void
    setStoreTimeWork: (data: {
        [P in keyof Partial<StoreTimeWork>]: StoreTimeWork[P]
    }) => void
}

type StoresContext = ReturnType<typeof createStoresContext>

const createStoresContext = (initProps?: Partial<StoresStateProps>) => {
    const DEFAULT_PROPS: StoresStateProps = {
        store: undefined,
        storeTimeWork: undefined,
    }
    return createStore<StoresState>()(set => ({
        ...DEFAULT_PROPS,
        ...initProps,
        setStore: (data: Partial<Store>) => {
            set((state: StoresState) => ({
                ...state,
                store: {
                    ...state.store,
                    ...data,
                },
            }))
        },
        setStoreTimeWork: (data: {
            [P in keyof Partial<StoreTimeWork>]: StoreTimeWork[P]
        }) => {
            set((state: StoresState) => ({
                ...state,
                storeTimeWork: {
                    monday: false,
                    tuesday: false,
                    wednesday: false,
                    thursday: false,
                    friday: false,
                    saturday: false,
                    sunday: false,
                    ...state.storeTimeWork,
                    ...data,
                },
            }))
        },
    }))
}

export const StoresContext = createContext<StoresContext | null>(null)
type StoresProviderProps = React.PropsWithChildren<StoresStateProps>

export const useStoresContext = <T,>(
    selector: (state: StoresState) => T
): T => {
    const store = useContext(StoresContext)
    if (!store) throw new Error('Missing StoresContext.Provider in the tree')
    return useStore(store, selector)
}

export const StoresProvider = ({ children, ...props }: StoresProviderProps) => {
    const storeRef = useRef<StoresContext>()
    if (!storeRef.current) {
        storeRef.current = createStoresContext(props)
    }
    return (
        <StoresContext.Provider value={storeRef.current}>
            {children}
        </StoresContext.Provider>
    )
}
