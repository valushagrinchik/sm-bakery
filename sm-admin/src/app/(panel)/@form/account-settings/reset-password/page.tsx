import { getCurrentUser } from '@/actions/user'
import { ChangePasswordForm } from '@/features/accountSettings'
import { Role } from '@/shared/enums/role'
import { FormModalLayout } from '@/shared/ui'
import { redirect } from 'next/navigation'

export default async function ResetPassword() {
    const me = await getCurrentUser()
    if (me?.roleId !== Role.SUPER_ADMINISTRATOR) {
        redirect('/account-settings')
    }
    return (
        <FormModalLayout>
            <ChangePasswordForm />
        </FormModalLayout>
    )
}
