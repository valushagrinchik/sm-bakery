import { getCountriesQuery } from '@/actions/country'
import {
    CountriesSearchDto,
    CountryResponseDto,
} from '@/shared/lib/sanMartinApi/Api'
import { StatusBadge } from '@/shared/ui/StatusBadge.ui'
import { TableWithFilter } from '@/shared/ui/TableWithFilter'
import { PAGINATION_LIMIT } from '@/shared/utils/constant'

export type CountriesListProps = {
    page?: number
    searchParams: Pick<CountriesSearchDto, 'status'>
    actions: Record<string, boolean>
}
export const CountriesList = async ({
    page,
    searchParams,
    actions,
}: CountriesListProps) => {
    const query = Object.fromEntries(
        Object.entries(searchParams || {})
            .filter(([_, v]) => !!v)
            .map(([k, v]) => [k, v.toString()])
    )
    const data = await getCountriesQuery({
        ...query,
        limit: PAGINATION_LIMIT,
        offset: page ? (page - 1) * PAGINATION_LIMIT : 0,
    })

    const items = (data!.result || []).map(country => ({
        ...country,
        status: <StatusBadge value={country.status!} />,
    }))

    const fields = [
        'id',
        'name',
        'inventoryId',
        'currency',
        'phoneCode',
        'status',
    ]

    return (
        <TableWithFilter<CountryResponseDto>
            items={items}
            total={data!.count || 0}
            fields={fields as any}
            pagename='countries'
            page={page}
            edit={actions.edit}
            withFilter={false}
        />
    )
}
