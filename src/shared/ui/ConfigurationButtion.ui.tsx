import { useTranslations } from 'next-intl'

export const ConfigurationButton = ({
    onClick,
    label,
    disabled,
}: {
    onClick: () => void
    label?: string
    disabled?: boolean
}) => {
    const t = useTranslations()
    return (
        <div
            onClick={onClick}
            className={` pl-[15px] pr-[17px] py-[9px] my-[2px] bg-blue-50 rounded-lg justify-center items-center gap-2 inline-flex ${disabled ? 'bg-gray-100' : 'cursor-pointer'}`}
        >
            <div
                className={` text-sm font-medium leading-tight whitespace-nowrap ${disabled ? 'text-gray-400' : 'text-brand-light'}`}
            >
                {label || t('buttons.configure')}
            </div>
        </div>
    )
}
