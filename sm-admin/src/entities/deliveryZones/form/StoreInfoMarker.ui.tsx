import { EntityStatus } from '@/shared/lib/sanMartinApi/Api'
import { StatusBadge } from '@/shared/ui/StatusBadge.ui'
import { useTranslations } from 'next-intl'

export const StoreInfoMarker = ({
    store,
}: {
    store: {
        status: EntityStatus
        address?: string
        name: string
        isMainStore: boolean
    }
}) => {
    const t = useTranslations('panel.form.delivery-zones.stores')
    return (
        <div className='w-full p-2 bg-white rounded-lg shadow justify-start items-start gap-4 inline-flex'>
            <div className='flex flex-col justify-start items-start gap-1'>
                <div className='self-stretch justify-start items-center gap-1 inline-flex'>
                    <div className='justify-start items-start gap-3 flex'>
                        <div className='flex-col justify-start items-start inline-flex'>
                            <div className="self-stretch text-gray-700 text-sm font-semibold font-['Inter'] leading-tight">
                                {store.name}
                            </div>
                        </div>
                    </div>

                    {store.isMainStore && (
                        <div className='px-2.5 py-0.5 rounded-[10px] border border-[#103c76] justify-center items-center flex'>
                            <div className='text-center text-[#103c76] text-xs font-medium leading-none'>
                                {t('isMainStore')}
                            </div>
                        </div>
                    )}
                </div>

                {store.address && (
                    <div className='self-stretch text-gray-700 text-xs font-normal leading-none'>
                        {store.address}
                    </div>
                )}
                <StatusBadge value={store.status!} />
            </div>
        </div>
    )
}
