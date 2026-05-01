import { checkCatalogParsing, ProductSearchDto } from '@/actions/product'
import { getCurrentUser } from '@/actions/user'
import { ProductsList } from '@/features/products'
import { ProductsFilter } from '@/features/products/filter.ui'
import { ProductPageTitle } from '@/features/products/pageTitle.ui'
import { Loader } from '@/shared/ui/Loader.ui'
import { Suspense } from 'react'

type Params = Promise<{ page: string }>
type SearchParams = Promise<
    Omit<ProductSearchDto, 'limit' | 'offset'> & { id?: string | number }
>

export default async function ProductManagement(props: {
    params: Params
    searchParams: SearchParams
}) {
    const params = await props.params
    const searchParams = await props.searchParams

    const me = await getCurrentUser()
    const parsingStatus = await checkCatalogParsing()

    return (
        <div className='flex flex-col h-full'>
            <ProductPageTitle status={parsingStatus} />
            <ProductsFilter
                page={params.page ? parseInt(params.page) : undefined}
                searchParams={searchParams}
            />
            <Suspense
                key={JSON.stringify({ ...searchParams, ...params })}
                fallback={<Loader />}
            >
                <ProductsList
                    page={params?.page ? parseInt(params?.page) : undefined}
                    searchParams={searchParams as any}
                    me={me}
                    actions={{
                        view: true,
                    }}
                />
            </Suspense>
        </div>
    )
}
