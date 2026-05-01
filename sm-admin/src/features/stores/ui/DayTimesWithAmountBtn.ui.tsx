import { DayTimes, DayTimesPeriod, DayTimesProps } from '@/shared/ui'
import { ConfigurationButton } from '@/shared/ui/ConfigurationButtion.ui'
import { useState } from 'react'

export const DayTimesWithAmountBtn = ({
    label,
    onAmountBtnClick,
    ...props
}: { label: string; onAmountBtnClick: () => void } & DayTimesProps) => {
    const [period, setPeriod] = useState<DayTimesPeriod | undefined>(props.data)
    const disabled = !(
        period &&
        period.isOpen &&
        !!period.openTime &&
        !!period.closeTime
    )
    return (
        <div className='flex gap-4 justify-between items-start'>
            <DayTimes
                {...props}
                onChange={(data: DayTimesPeriod) => {
                    setPeriod(data)
                    props.onChange(data)
                }}
            />
            <ConfigurationButton
                disabled={disabled}
                onClick={() => {
                    if (disabled) {
                        return
                    }
                    onAmountBtnClick()
                }}
                label={label}
            />
        </div>
    )
}
