import { getVersions } from '@/actions/version'
import { AppVersionForm } from '@/features/appVersion'
import { PageTitle } from '@/shared/ui'
import { getTranslations } from 'next-intl/server'

export default async function AppVersionManagement() {
    const t = await getTranslations(`panel.app-version-management`)
    const versionFields = await getVersions()
    return (
        <div className='flex flex-col h-full'>
            <PageTitle title={t('title')} />
            <AppVersionForm versionFields={versionFields} />
        </div>
    )
}
