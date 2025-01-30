export class FetchWrapper {
    baseUrl: string
    authToken?: string

    constructor(baseUrl: string, authToken?: string) {
        this.baseUrl = baseUrl
        this.authToken = authToken
    }

    async get(url: string, query?: Record<string, any>, tags: string[] = []) {
        const stringifiedQuery = Object.fromEntries(
            Object.entries(query || {})
                .filter(([_, v]) => !!v)
                .map(([k, v]) => [k, v.toString()])
        )
        const queryParams = new URLSearchParams(stringifiedQuery).toString()
        const headers = new Headers({
            platform: 'admin_panel',
        })
        if (this.authToken) headers.set('Authorization', this.authToken)
        const response = await fetch(
            `${this.baseUrl}${url}${queryParams ? '?' + queryParams : ''}`,
            {
                method: 'GET',
                headers,
                cache: 'force-cache',
                next: {
                    tags,
                },
            }
        )

        return {
            data: await response.json(),
            ok: response.ok,
        }
    }

    async put(
        url: string,
        query?: Record<string, any>,
        data?: unknown,
        isFormData = false
    ) {
        const stringifiedQuery = Object.fromEntries(
            Object.entries(query || {}).map(([k, v]) => [k, v.toString()])
        )
        const queryParams = new URLSearchParams(stringifiedQuery).toString()
        const headers = new Headers({
            platform: 'admin_panel',
        })
        if (this.authToken) headers.set('Authorization', this.authToken)
        if (!isFormData) headers.set('Content-Type', 'application/json')
        const response = await fetch(
            `${this.baseUrl}${url}${queryParams ? '?' + queryParams : ''}`,
            {
                method: 'PUT',
                body: JSON.stringify(data),
                headers,
            }
        )

        if (response.headers.get('content-length') === '0')
            return {
                ok: response.ok,
            }
        return {
            data: await response.json(),
            ok: response.ok,
        }
    }

    async patch(url: string, query?: Record<string, any>, data?: unknown) {
        const stringifiedQuery = Object.fromEntries(
            Object.entries(query || {}).map(([k, v]) => [k, v.toString()])
        )
        const queryParams = new URLSearchParams(stringifiedQuery).toString()
        const headers = new Headers({
            platform: 'admin_panel',
        })
        if (this.authToken) headers.set('Authorization', this.authToken)
        const response = await fetch(
            `${this.baseUrl}${url}${queryParams ? '?' + queryParams : ''}`,
            {
                method: 'PATCH',
                body: JSON.stringify(data),
                headers,
            }
        )
        if (response.headers.get('content-length') === '0')
            return {
                ok: response.ok,
            }
        return {
            data: await response.json(),
            ok: response.ok,
        }
    }

    async post(
        url: string,
        query?: Record<string, string>,
        data?: any,
        isFormData = false
    ) {
        const stringifiedQuery = Object.fromEntries(
            Object.entries(query || {}).map(([k, v]) => [k, v.toString()])
        )
        const queryParams = new URLSearchParams(stringifiedQuery).toString()
        const headers = new Headers({
            platform: 'admin_panel',
        })
        if (!isFormData) headers.set('Content-Type', 'application/json')
        if (this.authToken) headers.set('Authorization', this.authToken)
        const response = await fetch(
            `${this.baseUrl}${url}${queryParams ? '?' + queryParams : ''}`,
            {
                method: 'POST',
                body: isFormData ? data : JSON.stringify(data),
                headers,
            }
        )
        if (response.headers.get('content-length') === '0')
            return {
                ok: response.ok,
            }
        return {
            data: await response.json(),
            ok: response.ok,
        }
    }

    async delete(url: string, query?: Record<string, string>) {
        const stringifiedQuery = Object.fromEntries(
            Object.entries(query || {}).map(([k, v]) => [k, v.toString()])
        )
        const queryParams = new URLSearchParams(stringifiedQuery).toString()
        const headers = new Headers({
            platform: 'admin_panel',
        })
        if (this.authToken) headers.set('Authorization', this.authToken)
        const response = await fetch(
            `${this.baseUrl}${url}${queryParams ? '?' + queryParams : ''}`,
            {
                method: 'DELETE',
                headers,
            }
        )
        if (response.headers.get('content-length') === '0')
            return {
                ok: response.ok,
            }
        return {
            data: await response.json(),
            ok: response.ok,
        }
    }
}
