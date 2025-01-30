import { getProductQuery } from '@/actions/product'
import { getCurrentUser } from '@/actions/user'
import { ProductView } from '@/features/products'
import { FormModalLayout } from '@/shared/ui/FormModalLayout.ui'

type Params = Promise<{ id: number }>
export default async function ViewProductPage(props: { params: Params }) {
    const params = await props.params
    const product = await getProductQuery(params.id)
    const me = await getCurrentUser()

    return (
        <FormModalLayout>
            <ProductView id={params.id} data={product} me={me} />
        </FormModalLayout>
    )
}
