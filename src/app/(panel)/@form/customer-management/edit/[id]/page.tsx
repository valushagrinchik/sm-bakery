import { getUser } from '@/actions/user'
import { FormModalLayout } from '@/shared/ui/FormModalLayout.ui'
import { CustomerForm } from '@/widgets/CustomerForm'

export default async function CustomerFormPage({ params }: any) {
    const param = await params
    if (!param.id) return null

    const user = param.id !== 'new' ? await getUser(param.id) : null
    return (
        <FormModalLayout>
            <CustomerForm user={user!} />
        </FormModalLayout>
    )
}
