'use server'

import { RoleResponseDto } from '@/shared/lib/sanMartinApi/Api'
import { FetchWrapper } from '@/shared/lib/sanMartinApi/fetchWrapper'
import { cookies } from 'next/headers'

export async function getRoles(isFilter?: boolean) {
    const cookieStore = await cookies()
    const accessToken = cookieStore.get('access_token')?.value
    const fetchWrapper = new FetchWrapper(
        process.env.NEXT_PUBLIC_BASE_URL || '',
        'Bearer ' + accessToken
    )

    const { data } = await fetchWrapper.get(`/admin/roles`, {
        isFilter: (!!isFilter).toString(),
    })
    return data?.result as RoleResponseDto[]
}
