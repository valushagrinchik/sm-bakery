import { PageTitle } from '@/shared/ui'
import { AccountSettingsForm } from '@/features/accountSettings'
import { getTranslations } from 'next-intl/server'
import { getCurrentUser } from '@/actions/user'
import { getRoles } from '@/actions/role'

export default async function AccountSettings() {
    const t = await getTranslations(`panel.account-settings`)
    const me = await getCurrentUser()

    const roles = await getRoles(true)
    return (
        <div className='flex flex-col h-full'>
            <PageTitle title={t('title')} />
            <AccountSettingsForm me={me} roles={roles} />
        </div>
    )
}
