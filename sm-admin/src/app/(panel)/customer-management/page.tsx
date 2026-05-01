import { getAllCountries } from '@/actions/country'
import { getCurrentUser, getUsers } from '@/actions/user'
import { Role } from '@/shared/enums/role'
import { UserStatus } from '@/shared/lib/sanMartinApi/Api'
import { StatusBadge } from '@/shared/ui/StatusBadge'
import { getTranslations } from 'next-intl/server'
import { TableWithFilter } from '../../../shared/ui/TableWithFilter'

const fields = [
    'id',
    'name',
    'email',
    'phone',
    'registrationDate',
    'totalValue',
    'status',
]

type Params = Promise<{ page: string }>
type SearchParams = Promise<{
    roleId?: string
    countryId?: string
    status?: string
    search?: string
}>

export default async function CustomerManagement(props: {
    params: Params
    searchParams: SearchParams
}) {
    const me = await getCurrentUser()
    const params = await props.params
    const searchParams = await props.searchParams
    const t = await getTranslations('panel.customer-management')
    const countries = await getAllCountries({ isFilter: true })

    const filterFields = [
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
    const pageNumber = params?.page ? parseInt(params?.page) : undefined
    const { result: customers, count } = await getUsers(
        {
            countryId:
                me.roleId === Role.SUPER_ADMINISTRATOR
                    ? (searchParams?.countryId as unknown as number)
                    : me.operator!.countryId,
            status: searchParams?.status,
            search: searchParams?.search,
            isCustomer: true,
        },
        pageNumber || 1
    )

    const items = customers.map(customer => ({
        ...customer,
        name: `${customer.firstName} ${customer.lastName}`,
        status: <StatusBadge status={customer.status!} />,
        registrationDate: customer.createdAt
            ? new Date(customer.createdAt).toLocaleDateString()
            : '',
        totalValue: `Q${(0).toFixed(2)}`,
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
            </div>
            <TableWithFilter
                items={items as any}
                total={count}
                fields={fields as any}
                filterFields={filterFields as any}
                filterValues={filterValues as any}
                pagename='customer-management'
                page={pageNumber}
                edit
                view
            />
        </>
    )
}
