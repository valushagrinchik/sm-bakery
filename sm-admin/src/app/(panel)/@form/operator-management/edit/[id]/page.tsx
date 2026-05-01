import { getAllCountries } from '@/actions/country'
import { getRoles } from '@/actions/role'
import { getStoresQuery } from '@/actions/store'
import { getCurrentUser, getUser } from '@/actions/user'
import { Role } from '@/shared/enums/role'
import { FormModalLayout } from '@/shared/ui/FormModalLayout.ui'
import { FILTER_LIMIT, GOOGLE_MAPS_API_KEY } from '@/shared/utils/constant'
import { OperatorForm } from '@/widgets/OperatorForm'
import { redirect } from 'next/navigation'

export default async function OperatorFormPage({ params }: any) {
    const param = await params
    if (!param.id) return null
    const me = await getCurrentUser()
    if (
        me.roleId !== Role.SUPER_ADMINISTRATOR &&
        me.roleId !== Role.COUNTRY_MANAGER
    )
        redirect('/operator-management')
    const roleFields = {
        roles: (await getRoles(true)).filter(
            role =>
                role.id !== Role.CUSTOMER &&
                (me.roleId === Role.SUPER_ADMINISTRATOR ||
                    (role.id !== Role.SUPER_ADMINISTRATOR &&
                        role.id !== Role.COUNTRY_MANAGER))
        ),
        countries: (await getAllCountries({ isFilter: true })) || [],
        stores:
            (
                await getStoresQuery({
                    isFilter: true,
                    limit: FILTER_LIMIT,
                    offset: 0,
                    countryId: me.countryId,
                })
            ).result || [],
        deliveryZonesPolygons: [],
    }

    const user = param.id !== 'new' ? await getUser(param.id) : null
    return (
        <FormModalLayout>
            <OperatorForm
                user={user}
                mapApiKey={GOOGLE_MAPS_API_KEY}
                roleFields={roleFields}
                defaultRole={
                    me.roleId === Role.SUPER_ADMINISTRATOR
                        ? Role.SUPER_ADMINISTRATOR
                        : Role.STORE_MANAGER
                }
            />
        </FormModalLayout>
    )
}
