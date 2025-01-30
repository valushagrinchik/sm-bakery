import profileImg from '@/../public/Avatar.png'
import Image from 'next/image'
import Link from 'next/link'
import { StatusBadge } from './StatusBadge.ui'

export default function AvatarWithText({
    name,
    status,
    avatar,
    link,
    onClick,
}: {
    name: string
    status: string
    avatar?: string
    link: string
    onClick: React.MouseEventHandler<HTMLAnchorElement>
}) {
    return (
        <div className='group block shrink-0'>
            <div className='grid grid-cols-[36px_minmax(0,_1fr)] gap-3'>
                {avatar ? (
                    <img
                        src={avatar}
                        width={36}
                        height={36}
                        alt='avatar'
                        className='inline-block h-9 w-9 rounded-full'
                    />
                ) : (
                    <Image
                        src={profileImg}
                        width={36}
                        height={36}
                        alt='default avatar'
                        className='inline-block h-9 w-9 rounded-full'
                    />
                )}

                <div>
                    <div className='flex gap-3'>
                        <div className='text-sm font-medium text-gray-700 group-hover:text-gray-900 truncate'>
                            {name}
                        </div>
                        <StatusBadge value={status} />
                    </div>
                    <Link
                        className='text-xs font-medium text-gray-500 group-hover:text-gray-700'
                        href={{
                            pathname: link,
                        }}
                        onClick={onClick}
                        scroll={false}
                    >
                        View profile
                    </Link>
                </div>
            </div>
        </div>
    )
}
