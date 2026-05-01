import { DeliveryZoneStoresResponseDto } from '@/shared/lib/sanMartinApi/Api'
import { StatusBadge } from '@/shared/ui'
import { useTranslations } from 'next-intl'

export const StoreRadioButtonLabel = ({
    store,
}: {
    store: DeliveryZoneStoresResponseDto
}) => {
    const t = useTranslations('panel.form.delivery-zones.stores')

    return (
        <div
            key={store.id}
            className='self-stretch justify-start items-start gap-2 inline-flex'
        >
            <div className='flex-col justify-start items-start inline-flex'>
                <div className='self-stretch text-gray-700 text-sm font-medium  leading-tight'>
                    {store.name}
                </div>
            </div>
            <StatusBadge value={store.status!} />
            {store.isMainStore && (
                <div className='px-2.5 py-0.5 rounded-[10px] border border-[#103c76] justify-center items-center flex'>
                    <div className='text-center text-[#103c76] text-xs font-medium leading-none'>
                        {t('isMainStore')}
                    </div>
                </div>
            )}
        </div>
    )
}
