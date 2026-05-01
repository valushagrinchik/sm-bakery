import { SubmitButton } from '@/shared/ui/SubmitButton'
import { PlusIcon } from '@heroicons/react/outline'
import { Url } from 'next/dist/shared/lib/router/router'
import Link from 'next/link'

type PageTitleProps = {
    title: string
    addNewTitle?: string
    addNewLink?: Url
}
export const PageTitle = ({
    title,
    addNewTitle,
    addNewLink,
}: PageTitleProps) => {
    return (
        <div className='flex w-full mb-6'>
            <h1 className='text-2xl font-bold text-gray-800 flex-auto'>
                {title}
            </h1>
            {addNewTitle && addNewLink && (
                <Link prefetch={false} href={addNewLink} scroll={false}>
                    <SubmitButton className='w-fit'>
                        <PlusIcon className='h-5 w-5 text-white' />
                        <p className='font-medium text-sm'>{addNewTitle}</p>
                    </SubmitButton>
                </Link>
            )}
        </div>
    )
}
