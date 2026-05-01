'use server'

import { Role } from '@/shared/enums/role'
import { v2 } from '@/shared/lib/sanMartinApi'
import { UserResponseDto } from '@/shared/lib/sanMartinApi/Api'
import { FetchWrapper } from '@/shared/lib/sanMartinApi/fetchWrapper'
import {
    changePasswordSchema,
    userSchema,
    userUpdateSchema,
} from '@/shared/schema/user'
import { CACHE_TAGS, PAGINATION_LIMIT } from '@/shared/utils/constant'
import { parseErrorMessage } from '@/shared/utils/parseErrorMessage'
import { revalidatePath, revalidateTag } from 'next/cache'
import { cookies } from 'next/headers'

export async function getCurrentUser() {
    const { data: user } = await v2.usersMeControllerGetUsersMe()
    return user as Partial<UserResponseDto>
}

export async function getCurrentUserPermissions() {
    const user = await getCurrentUser()
    return user?.role?.permission
}

export async function getUsers(
    filter?: {
        roleId?: string | number
        countryId?: string | number
        status?: string | number
        search?: string
        isOperator?: boolean
        isCustomer?: boolean
    },
    page?: number
) {
    const offset = `${((page || 1) - 1) * PAGINATION_LIMIT}`
    const cookieStore = await cookies()
    const accessToken = cookieStore.get('access_token')?.value
    const fetchWrapper = new FetchWrapper(
        process.env.NEXT_PUBLIC_BASE_URL || '',
        'Bearer ' + accessToken
    )
    const response = await fetchWrapper.get(
        '/admin/users',
        {
            ...filter,
            offset,
            limit: PAGINATION_LIMIT,
        },
        ['operators']
    )

    const { data } = response

    return data as {
        result: UserResponseDto[]
        count: number
    }
}

export async function getUser(id: number) {
    const cookieStore = await cookies()
    const accessToken = cookieStore.get('access_token')?.value
    const fetchWrapper = new FetchWrapper(
        process.env.NEXT_PUBLIC_BASE_URL || '',
        'Bearer ' + accessToken
    )
    const { data } = await fetchWrapper.get(`/admin/users/${id}`, {}, [
        `operator_${id}`,
    ])
    return data as UserResponseDto
}

export async function updateUser(state: any, data: FormData) {
    const cookieStore = await cookies()
    const accessToken = cookieStore.get('access_token')?.value
    const id = data.get('id')
    const rawFormData = {
        email: data.get('email') as string,
        firstName: data.get('firstName') as string,
        lastName: data.get('lastName') as string,
        phone: data.get('phone') === '+502' ? null : data.get('phone'),
        roleId: parseInt(data.get('roleId') as string) || state?.fields?.roleId,
        countryId: parseInt(data.get('countryId') as string) || 1,
        storeId: parseInt(data.get('storeId') as string) || null,
        deliveryZoneId: parseInt(data.get('deliveryZoneId') as string) || null,
        status: data.get('status') as string,
        avatar: (data.get('avatar') as string) || null,
    }

    const user = userSchema.safeParse(rawFormData)

    if (!user.success) {
        return {
            fields: rawFormData,
            errors: {
                email:
                    user?.error?.flatten()?.fieldErrors?.email &&
                    user?.error?.flatten()?.fieldErrors?.email![0],
                firstName:
                    user?.error?.flatten()?.fieldErrors?.firstName &&
                    user?.error?.flatten()?.fieldErrors?.firstName![0],
                lastName:
                    user?.error?.flatten()?.fieldErrors?.lastName &&
                    user?.error?.flatten()?.fieldErrors?.lastName![0],
                phone:
                    user?.error?.flatten()?.fieldErrors?.phone &&
                    user?.error?.flatten()?.fieldErrors?.phone![0],
                roleId:
                    user?.error?.flatten()?.fieldErrors?.roleId &&
                    user?.error?.flatten()?.fieldErrors?.roleId![0],
                storeId:
                    user?.error?.flatten()?.fieldErrors?.storeId &&
                    user?.error?.flatten()?.fieldErrors?.storeId![0],
                countryId:
                    user?.error?.flatten()?.fieldErrors?.countryId &&
                    user?.error?.flatten()?.fieldErrors?.countryId![0],
                deliveryZoneId:
                    user?.error?.flatten()?.fieldErrors?.deliveryZoneId &&
                    user?.error?.flatten()?.fieldErrors?.deliveryZoneId![0],
                status:
                    user?.error?.flatten()?.fieldErrors?.status &&
                    user?.error?.flatten()?.fieldErrors?.status![0],
            },
        }
    }

    const fetchWrapper = new FetchWrapper(
        process.env.NEXT_PUBLIC_BASE_URL || '',
        'Bearer ' + accessToken
    )
    const { data: result, ok } = await fetchWrapper.put(
        `/admin/users/${id || 'me'}`,
        {},
        rawFormData
    )

    if (ok) {
        revalidateTag(`operator_${id}`)
        revalidateTag(CACHE_TAGS.OPERATORS)
        // revalidatePath('/countries/edit/[id]', 'page')
        revalidatePath('/operator-management')
        return { ...rawFormData, ok }
    }

    const errors = parseErrorMessage(result.message)
    return {
        fields: rawFormData,
        errors: errors.general
            ? {
                  email:
                      result.message === 'user_with_this_phone_exists'
                          ? undefined
                          : result.message,
                  phone:
                      result.message === 'user_with_this_phone_exists'
                          ? result.message
                          : undefined,
              }
            : errors,
    }
}

export async function addUser(state: any, data: FormData) {
    const cookieStore = await cookies()
    const accessToken = cookieStore.get('access_token')?.value
    const fetchWrapper = new FetchWrapper(
        process.env.NEXT_PUBLIC_BASE_URL || '',
        'Bearer ' + accessToken
    )
    const rawFormData = {
        email: data.get('email') as string,
        firstName: data.get('firstName') as string,
        lastName: data.get('lastName') as string,
        phone: data.get('phone') === '+502' ? null : data.get('phone'),
        roleId: parseInt(data.get('roleId') as string) || state?.fields?.roleId,
        countryId: parseInt(data.get('countryId') as string) || 1,
        storeId: parseInt(data.get('storeId') as string) || null,
        deliveryZoneId: parseInt(data.get('deliveryZoneId') as string) || null,
        status: data.get('status') as string,
        avatar: (data.get('avatar') as string) || null,
    }

    const user = userSchema.safeParse(rawFormData)
    if (!user.success) {
        return {
            fields: rawFormData,
            errors: {
                email:
                    user?.error?.flatten()?.fieldErrors?.email &&
                    user?.error?.flatten()?.fieldErrors?.email![0],
                firstName:
                    user?.error?.flatten()?.fieldErrors?.firstName &&
                    user?.error?.flatten()?.fieldErrors?.firstName![0],
                lastName:
                    user?.error?.flatten()?.fieldErrors?.lastName &&
                    user?.error?.flatten()?.fieldErrors?.lastName![0],
                phone:
                    user?.error?.flatten()?.fieldErrors?.phone &&
                    user?.error?.flatten()?.fieldErrors?.phone![0],
                roleId:
                    user?.error?.flatten()?.fieldErrors?.roleId &&
                    user?.error?.flatten()?.fieldErrors?.roleId![0],
                storeId:
                    user?.error?.flatten()?.fieldErrors?.storeId &&
                    user?.error?.flatten()?.fieldErrors?.storeId![0],
                countryId:
                    user?.error?.flatten()?.fieldErrors?.countryId &&
                    user?.error?.flatten()?.fieldErrors?.countryId![0],
                deliveryZoneId:
                    user?.error?.flatten()?.fieldErrors?.deliveryZoneId &&
                    user?.error?.flatten()?.fieldErrors?.deliveryZoneId![0],
                status:
                    user?.error?.flatten()?.fieldErrors?.status &&
                    user?.error?.flatten()?.fieldErrors?.status![0],
            },
        }
    }

    const { data: result, ok } = await fetchWrapper.post(
        `/admin/users`,
        {},
        rawFormData,
        false
    )

    if (ok) {
        revalidateTag(CACHE_TAGS.OPERATORS)
        // revalidatePath('/countries/edit/[id]', 'page')
        revalidatePath('/operator-management')
        return { ...rawFormData, ok }
    }
    const errors = parseErrorMessage(result.message)
    return {
        fields: rawFormData,
        errors: errors.general
            ? {
                  email:
                      result.message === 'user_with_this_phone_exists'
                          ? undefined
                          : result.message,
                  phone:
                      result.message === 'user_with_this_phone_exists'
                          ? result.message
                          : undefined,
              }
            : errors,
    }
}

export async function updateCurrentUser(state: any, data: FormData) {
    const currentUser = await getCurrentUser()

    const rawFormData = {
        email:
            currentUser.roleId === Role.SUPER_ADMINISTRATOR
                ? data.get('email')
                : (currentUser.email as string),
        firstName: data.get('firstName') as string,
        lastName: data.get('lastName') as string,
        phone: data.get('phone') === '+502' ? null : data.get('phone'),
        avatar: (data.get('avatar') as string) || null,
    }

    const user = userUpdateSchema.safeParse(rawFormData)
    if (!user.success) {
        return {
            fields: rawFormData,
            errors: {
                email:
                    user?.error?.flatten()?.fieldErrors?.email &&
                    user?.error?.flatten()?.fieldErrors?.email![0],
                firstName:
                    user?.error?.flatten()?.fieldErrors?.firstName &&
                    user?.error?.flatten()?.fieldErrors?.firstName![0],
                lastName:
                    user?.error?.flatten()?.fieldErrors?.lastName &&
                    user?.error?.flatten()?.fieldErrors?.lastName![0],
                phone:
                    user?.error?.flatten()?.fieldErrors?.phone &&
                    user?.error?.flatten()?.fieldErrors?.phone![0],
            },
        }
    }

    const res: any = await v2.usersMeControllerUpdateUsersMe(
        rawFormData as any,
        {
            cache: 'no-cache',
        }
    )
    if (res.ok) {
        revalidateTag(CACHE_TAGS.OPERATORS)
        revalidatePath('/operator-management')
        return { fields: user.data, ok: res.ok }
    }

    const result = await res.json()
    const errors = parseErrorMessage(result.message)
    return {
        fields: rawFormData,
        errors: errors.general
            ? {
                  email:
                      result.message === 'user_with_this_phone_exists'
                          ? undefined
                          : result.message,
                  phone:
                      result.message === 'user_with_this_phone_exists'
                          ? result.message
                          : undefined,
              }
            : errors,
    }
}

export async function resetUserPassword(id: string | number) {
    const cookieStore = await cookies()
    const accessToken = cookieStore.get('access_token')?.value
    const fetchWrapper = new FetchWrapper(
        process.env.NEXT_PUBLIC_BASE_URL || '',
        'Bearer ' + accessToken
    )
    const response = await fetchWrapper.get(`/admin/users/${id}/resetPassword`)
    return response.ok
}

export async function changePassword(state: any, formData: FormData) {
    const rawFormData = {
        oldPassword: formData.get('oldPassword') as string,
        newPassword: formData.get('newPassword') as string,
        repeatPassword: formData.get('repeatPassword') as string,
    }

    const changePasswordBody = changePasswordSchema.safeParse(rawFormData)
    if (!changePasswordBody.success) {
        return {
            fields: rawFormData,
            errors: {
                oldPassword:
                    changePasswordBody?.error?.flatten()?.fieldErrors
                        ?.oldPassword &&
                    changePasswordBody?.error?.flatten()?.fieldErrors
                        ?.oldPassword![0],
                newPassword:
                    changePasswordBody?.error?.flatten()?.fieldErrors
                        ?.newPassword &&
                    changePasswordBody?.error?.flatten()?.fieldErrors
                        ?.newPassword![0],
                repeatPassword:
                    changePasswordBody?.error?.flatten()?.fieldErrors
                        ?.repeatPassword &&
                    changePasswordBody?.error?.flatten()?.fieldErrors
                        ?.repeatPassword![0],
            },
        }
    }

    const res = (await v2.usersMeControllerChangePassword(
        {
            oldPassword: rawFormData.oldPassword,
            password: rawFormData.newPassword,
        },
        {
            cache: 'no-cache',
        }
    )) as { ok: boolean; data: any }
    if (!res.ok) {
        return {
            fields: rawFormData,
            errors: {
                oldPassword: 'wrong_password',
            },
        }
    }
    return { fields: rawFormData, ok: res.ok }
}
