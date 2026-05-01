import { UserResponseDto } from '@/shared/lib/sanMartinApi/Api'
import AvatarWithText from '@/shared/ui/AvatarWithText.ui'
import { useState } from 'react'

type AssigneeListProps = {
    data: UserResponseDto[]
    link: string
    onClick: React.MouseEventHandler<HTMLAnchorElement>
}

export const AssigneeList = ({ data, link, onClick }: AssigneeListProps) => {
    const minShowCount = 4
    const [showCount, setShowCount] = useState(minShowCount)
    return (
        <div>
            <div className={`grid grid-cols-2 gap-4`}>
                {data.slice(0, showCount).map(o => (
                    <AvatarWithText
                        key={o.id}
                        status={o.status!}
                        avatar={o.avatar}
                        name={[o.firstName, o.lastName].join(' ')}
                        link={link.replace('[id]', '' + o.id)}
                        onClick={onClick}
                    />
                ))}
            </div>
            {data.length > minShowCount && (
                <div
                    className='relative whitespace-nowrap py-4 pl-3 pr-4 text-sm font-medium text-brand-dark sm:pr-0 cursor-pointer'
                    onClick={() =>
                        setShowCount(
                            showCount == minShowCount
                                ? data.length
                                : minShowCount
                        )
                    }
                >
                    {showCount == minShowCount ? 'See all' : 'Hide'}
                </div>
            )}
        </div>
    )
}
