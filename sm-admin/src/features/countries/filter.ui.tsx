import { CountriesSearchDto, EntityStatus } from '@/shared/lib/sanMartinApi/Api'
import { Filter } from '@/shared/ui/Filter'
import { getTranslations } from 'next-intl/server'

export type CountriesFilterProps = {
    searchParams: Pick<CountriesSearchDto, 'status'>
}
export const CountriesFilter = async ({
    searchParams,
}: CountriesFilterProps) => {
    const t = await getTranslations('panel.countries.filters')

    const filterFields = [
        {
            label: t('status.name'),
            name: 'status' as const,
            options: [
                { id: '', name: t('status.options.all') },
                ...Object.values(EntityStatus).map(status => ({
                    id: status,
                    name: t('status.options.' + status),
                })),
            ],
        },
    ]

    const filterValues = {
        ...searchParams,
    }
    return (
        <Filter<{ status: string }>
            fields={filterFields}
            pagename={'countries'}
            values={filterValues}
        />
    )
}
