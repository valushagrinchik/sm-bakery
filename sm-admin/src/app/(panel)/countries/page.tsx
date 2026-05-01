import { getCurrentUser } from '@/actions/user'
import { CountriesFilter, CountriesList } from '@/features/countries'
import { Role } from '@/shared/enums/role'
import { CountriesSearchDto } from '@/shared/lib/sanMartinApi/Api'
import { PageTitle } from '@/shared/ui'
import { Loader } from '@/shared/ui/Loader.ui'
import { getTranslations } from 'next-intl/server'
import { Suspense } from 'react'

type Params = Promise<{ page: string }>
type SearchParams = Promise<CountriesSearchDto>

export default async function CountriesPage(props: {
    params: Params
    searchParams: SearchParams
}) {
    const params = await props.params
    const searchParams = await props.searchParams

    const me = await getCurrentUser()
    if (me.roleId == Role.COUNTRY_MANAGER && me.operator) {
        searchParams['id'] = me.operator.countryId
    }

    const t = await getTranslations(`panel.countries`)

    return (
        <div className='flex flex-col h-full'>
            <PageTitle title={t('title')} />

            <CountriesFilter searchParams={searchParams} />
            <Suspense
                key={JSON.stringify({ ...searchParams, ...params })}
                fallback={<Loader />}
            >
                <CountriesList
                    page={params?.page ? parseInt(params?.page) : undefined}
                    searchParams={searchParams}
                    actions={{
                        edit: me.role?.permission?.updateCountry || false,
                    }}
                />
            </Suspense>
        </div>
    )
}
