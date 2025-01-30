'use client'

import { PAGINATION_LIMIT } from '@/shared/utils/constant'
import { Filter, FilterProps } from './Filter'
import { Pagination } from './Pagination'
import { Table, TableProps } from './Table'

export const TableWithFilter = <T extends { id?: string | number }>({
    fields,
    items,
    total,
    pagename,
    filterFields,
    filterValues,
    view,
    edit,
    page,
    withFilter = true,
}: TableProps<T> & {
    filterFields?: FilterProps<T>['fields']
    filterValues?: FilterProps<T>['values']
    page?: number
    withFilter?: boolean
    total: number
}) => {
    return (
        <>
            {withFilter && (
                <Filter
                    fields={filterFields!}
                    pagename={pagename}
                    values={filterValues!}
                />
            )}
            <>
                <Table
                    fields={fields}
                    items={items}
                    pagename={pagename}
                    view={view}
                    edit={edit}
                />
                {total > PAGINATION_LIMIT && (
                    <Pagination
                        page={page}
                        pageCount={Math.ceil(total / PAGINATION_LIMIT)}
                    />
                )}
            </>
        </>
    )
}
