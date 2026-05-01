'use server'

import { v2 } from '@/shared/lib/sanMartinApi'
import { VersionsFindManyResponseDto } from '@/shared/lib/sanMartinApi/Api'
import { versionSchema } from '@/shared/schema/version'

export async function getVersions() {
    const { data } = (await v2.versionsAdminControllerGetVersions({
        offset: 0,
        limit: 10,
    })) as unknown as { data: VersionsFindManyResponseDto }
    return {
        customerAppAndroid: data.result[0].version,
        customerAppIos: data.result[1].version,
        operatorAppAndroid: data.result[2].version,
        operatorAppIos: data.result[3].version,
    }
}

export async function updateVersions(state: any, formData: FormData) {
    const rawFormData = {
        customerAppAndroid: formData.get('customerAppAndroid') as string,
        customerAppIos: formData.get('customerAppIos') as string,
        operatorAppAndroid: formData.get('operatorAppAndroid') as string,
        operatorAppIos: formData.get('operatorAppIos') as string,
    }
    const versions = versionSchema.safeParse(rawFormData)
    if (!versions.success) {
        return {
            fields: rawFormData,
            errors: {
                customerAppAndroid:
                    versions?.error?.flatten()?.fieldErrors
                        ?.customerAppAndroid &&
                    versions?.error?.flatten()?.fieldErrors
                        ?.customerAppAndroid![0],
                customerAppIos:
                    versions?.error?.flatten()?.fieldErrors?.customerAppIos &&
                    versions?.error?.flatten()?.fieldErrors?.customerAppIos![0],
                operatorAppAndroid:
                    versions?.error?.flatten()?.fieldErrors
                        ?.operatorAppAndroid &&
                    versions?.error?.flatten()?.fieldErrors
                        ?.operatorAppAndroid![0],
                operatorAppIos:
                    versions?.error?.flatten()?.fieldErrors?.operatorAppIos &&
                    versions?.error?.flatten()?.fieldErrors?.operatorAppIos![0],
            },
        }
    }
    const res = await v2.versionsAdminControllerUpdateVersions(rawFormData)
    return { ok: res.ok, fields: rawFormData }
}
