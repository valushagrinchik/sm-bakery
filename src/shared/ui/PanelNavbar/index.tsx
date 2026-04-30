import { getCurrentUserPermissions } from '@/actions/user'
import { getLocale } from 'next-intl/server'
import Image from 'next/image'
import NavbarLogo from '../../../app/(panel)/NavbarLogo.svg'
import { panelNavbarConfig } from './config'
import { LanguageSelector } from './LanguageSelect'
import { LogoutButton } from './LogoutButton'
import { PanelNavbarButton } from './PanelNavbarButton'

export const PanelNavbar = async () => {
    const locale = await getLocale()
    const permissions = await getCurrentUserPermissions()

    return (
        <div className='bg-brand-dark h-screen max-h-screen flex flex-col pb-4 overflow-auto flex-shrink-0 w-fit'>
            <Image src={NavbarLogo} alt='San Martin' className='m-4 mt-5' />
            <div className='flex flex-col gap-1 flex-auto'>
                {panelNavbarConfig.map((props, index) => (
                    <PanelNavbarButton
                        key={index}
                        {...props}
                        permissions={permissions}
                    />
                ))}
            </div>
            <div className='flex flex-col gap-1 mt-8'>
                <LanguageSelector locale={locale} />
                <LogoutButton />
            </div>
        </div>
    )
}
