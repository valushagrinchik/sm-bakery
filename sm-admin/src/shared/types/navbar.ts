import { PermissionResponseDto } from '@/shared/lib/sanMartinApi/Api'
import { ReactNode } from 'react'

export type NavbarButtonProps = {
    text: string
    icon?: ReactNode
    link?: string
    onClick?: () => void
    subButtons?: NavbarButtonProps[]
    permission?: keyof PermissionResponseDto | 'viewVersion'
}
