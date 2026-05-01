'use client'
import { DeliveryZoneStoresResponseDto } from '@/shared/lib/sanMartinApi/Api'
import { Modal } from '@/shared/ui/Modal.ui'
import { sortStringsAsc } from '@/shared/utils/sort'
import { ExclamationCircleIcon } from '@heroicons/react/outline'
import { useTranslations } from 'next-intl'
import { useState } from 'react'

export const AssignedStores = ({
    stores: data,
}: {
    stores: DeliveryZoneStoresResponseDto[]
}) => {
    const t = useTranslations('panel.delivery-zones.stores')
    const [open, setOpen] = useState(false)
    if (!data?.length) {
        return (
            <ExclamationCircleIcon
                width={20}
                height={20}
                className='text-red-500'
            />
        )
    }
    const stores = data.sort((a, b) =>
        sortStringsAsc(
            Number(b.isMainStore || false).toString() + b.name,
            Number(a.isMainStore || false).toString() + a.name
        )
    )

    const minCount = 3

    return (
        <div>
            {stores.slice(0, minCount).map((store, index) => {
                return (
                    <span key={store.id}>
                        <span className='text-gray-900 text-sm font-normal leading-tight'>
                            {store.name}
                        </span>
                        {store.isMainStore && (
                            <span className='text-gray-500 text-sm font-normal leading-tight'>
                                &nbsp;({t('isMainStore')})
                            </span>
                        )}
                        {index != Math.min(stores.length, minCount) - 1 && ', '}
                    </span>
                )
            })}

            {stores.length > 3 && (
                <span>
                    <span
                        onClick={() => setOpen(!open)}
                        className='text-[#28548f] text-sm font-normal leading-tight cursor-pointer'
                    >
                        &nbsp;{t('more')}
                    </span>

                    <Modal
                        onClose={() => setOpen(false)}
                        open={open}
                        title='Assigned stores'
                        content={
                            <div className='flex-col justify-start items-start gap-2 flex'>
                                {stores.map(store => (
                                    <div
                                        key={store.id}
                                        className='self-stretch justify-start items-start gap-2 inline-flex'
                                    >
                                        <div>
                                            <span className='text-gray-900 text-sm font-normal leading-tight'>
                                                {store.name}
                                            </span>
                                            {store.isMainStore && (
                                                <span className='text-gray-500 text-sm font-normal leading-tight'>
                                                    &nbsp;({t('isMainStore')})
                                                </span>
                                            )}
                                            &nbsp;
                                        </div>
                                    </div>
                                ))}
                            </div>
                        }
                    />
                </span>
            )}
        </div>
    )
}
