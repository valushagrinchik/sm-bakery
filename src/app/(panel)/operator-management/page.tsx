import { getAllCountries } from '@/actions/country'
import { getRoles } from '@/actions/role'
import { getCurrentUser, getUsers } from '@/actions/user'
import { Role } from '@/shared/enums/role'
import { UserStatus } from '@/shared/lib/sanMartinApi/Api'
import { StatusBadge } from '@/shared/ui/StatusBadge'
import { SubmitButton } from '@/shared/ui/SubmitButton'
import { PlusIcon } from '@heroicons/react/outline'
import { getTranslations } from 'next-intl/server'
import Link from 'next/link'
import { TableWithFilter } from '../../../shared/ui/TableWithFilter'

const fields = ['id', 'name', 'email', 'phone', 'role', 'status']

type Params = Promise<{ page: string }>
type SearchParams = Promise<{
    roleId?: string
    countryId?: string
    status?: string
    search?: string
}>

export default async function OperatorManagement(props: {
    params: Params
    searchParams: SearchParams
}) {
    const me = await getCurrentUser()
    const params = await props.params
    const searchParams = await props.searchParams
    const t = await getTranslations('panel.operator-management')
    const roles = await getRoles(true)
    const countries = await getAllCountries({ isFilter: true })

    const filterFields = [
        {
            name: 'roleId',
            label: t('role'),
            options: [
                { id: '', name: 'All' },
                ...roles.filter(role => role.id !== 5),
            ],
        },
        {
            name: 'countryId',
            label: t('country'),
            options: [{ id: '', name: 'All' }, ...countries!],
            hidden: me.roleId !== 1,
        },
        {
            name: 'status',
            label: t('status'),
            options: [
                { id: '', name: 'All' },
                ...Object.values(UserStatus)
                    .filter(status => status !== 'deleted')
                    .map(status => ({
                        id: status,
                        name: t(status),
                    })),
            ],
        },
    ]
    const addParams = new URLSearchParams(searchParams)

    const pageNumber = params?.page ? parseInt(params?.page) : undefined

    const { result: operators, count } = await getUsers(
        {
            countryId: Number(
                me.roleId === Role.SUPER_ADMINISTRATOR
                    ? searchParams?.countryId
                    : me.operator!.countryId
            ),
            roleId: Number(searchParams?.roleId),
            status: searchParams?.status,
            search: searchParams?.search,
            isOperator: true,
        },
        pageNumber || 1
    )

    const items = operators.map(operator => ({
        ...operator,
        name: `${operator.firstName} ${operator.lastName}`,
        role: roles.find(role => role.id === operator.roleId)?.name,
        status: <StatusBadge status={operator.status!} />,
        edit:
            me?.roleId === Role.SUPER_ADMINISTRATOR ||
            (me?.roleId === Role.COUNTRY_MANAGER &&
                (operator?.roleId || 1) > (me?.roleId || 1)),
    }))
    const filterValues = {
        ...searchParams,
        roleId: searchParams?.roleId && parseInt(searchParams?.roleId),
        countryId: searchParams?.countryId && parseInt(searchParams?.countryId),
    }

    return (
        <>
            <div className='flex w-full mb-6'>
                <h1 className='text-2xl font-bold text-gray-800 flex-auto'>
                    {t('title')}
                </h1>
                <Link
                    prefetch={false}
                    href={{
                        pathname: `/operator-management/edit/new`,
                        search: addParams.toString(),
                    }}
                >
                    <SubmitButton className='w-fit'>
                        <PlusIcon className='h-5 w-5 text-white' />
                        <p className='font-medium text-sm'>{t('add')}</p>
                    </SubmitButton>
                </Link>
            </div>
            <TableWithFilter
                items={items as any}
                total={count}
                fields={fields as any}
                filterFields={filterFields as any}
                filterValues={filterValues as any}
                pagename='operator-management'
                page={pageNumber}
                edit
            />
        </>
    )
}
