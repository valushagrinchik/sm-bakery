import { UserStatus } from '@/shared/lib/sanMartinApi/Api'
import { useTranslations } from 'next-intl'

const bgColor = {
    [UserStatus.Active]: 'bg-green-100',
    [UserStatus.Blocked]: 'bg-red-100',
    [UserStatus.Deleted]: 'bg-gray-100',
}

const textColor = {
    [UserStatus.Active]: 'text-green-800',
    [UserStatus.Blocked]: 'text-red-800',
    [UserStatus.Deleted]: 'text-gray-800',
}

export const StatusBadge = ({ status }: { status: UserStatus }) => {
    const t = useTranslations('status')

    return (
        <div className={`px-2.5 py-0.5 w-fit rounded ${bgColor[status]}`}>
            <p className={`text-sm font-medium ${textColor[status]}`}>
                {t(status)}
            </p>
        </div>
    )
}
