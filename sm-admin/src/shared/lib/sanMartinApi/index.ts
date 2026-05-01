import { cookies } from 'next/headers'
import { Api } from './Api'

const { v2 } = new Api({
    baseUrl: process.env.NEXT_PUBLIC_BASE_URL?.slice(0, -3),
    async securityWorker() {
        return {
            headers: {
                ...(await getAuthHeader()),
                platform: 'admin_panel',
            },
        }
    },
})

const api = new Proxy(v2, {
    get(target, prop) {
        if (typeof target[prop as keyof typeof target] === 'function') {
            return new Proxy(target[prop as keyof typeof target], {
                apply: async (target, thisArgs, argumentsList) => {
                    console.log(prop, JSON.stringify(argumentsList), 'API')
                    try {
                        const response = await Reflect.apply(
                            target,
                            thisArgs,
                            argumentsList
                        )
                        return response
                    } catch (r: any) {
                        if (r.status == 400) {
                            return r
                        }

                        throw new Error(`${r?.status}_${r?.error?.message}`)
                    }
                },
            })
        } else {
            return Reflect.get(target, prop)
        }
    },
})

export { api as v2 }

export const getAuthHeader = async () => {
    const cookieStore = await cookies()
    const accessToken = cookieStore.get('access_token')?.value

    if (accessToken) {
        return { Authorization: `Bearer ${accessToken}` }
    }
}
