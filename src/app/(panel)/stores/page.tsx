import { getCurrentUser } from '@/actions/user'
import { StoresFilter, StoresList } from '@/features/stores'
import { Role } from '@/shared/enums/role'
import { StoresFindManyDto } from '@/shared/lib/sanMartinApi/Api'
import { Loader, PageTitle } from '@/shared/ui'
import { getTranslations } from 'next-intl/server'
import { Suspense } from 'react'

type Params = Promise<{ page: string }>
type SearchParams = Promise<StoresFindManyDto>

export default async function StoresPage(props: {
    params: Params
    searchParams: SearchParams
}) {
    const params = await props.params
    const searchParams = await props.searchParams

    const t = await getTranslations('panel.stores')

    const me = await getCurrentUser()
    if (
        me.roleId &&
        [Role.COUNTRY_MANAGER, Role.STORE_MANAGER].includes(me.roleId) &&
        me.operator
    ) {
        searchParams['countryId'] = me.operator.countryId
    }

    const addParams = new URLSearchParams(
        searchParams as Record<string, string>
    )
    const addNewProps = me.role?.permission?.createStore
        ? {
              addNewTitle: t('new'),
              addNewLink: {
                  pathname: `/stores/edit/new`,
                  search: addParams.toString(),
              },
          }
        : {}

    return (
        <div className='flex flex-col h-full'>
            <PageTitle title={t('title')} {...addNewProps} />

            <StoresFilter searchParams={searchParams} />
            <Suspense
                key={JSON.stringify({
                    ...searchParams,
                    ...params,
                })}
                fallback={<Loader />}
            >
                <StoresList
                    page={params?.page ? parseInt(params?.page) : undefined}
                    searchParams={searchParams}
                    actions={{
                        edit: !!me.role?.permission?.updateStore,
                    }}
                />
            </Suspense>
        </div>
    )
}
