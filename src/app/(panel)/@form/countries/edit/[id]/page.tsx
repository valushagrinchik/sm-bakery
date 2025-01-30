import { getCountryQuery } from '@/actions/country'
import { CountriesForm } from '@/features/countries'

type Params = Promise<{ id: number }>
export default async function CountriesEditFormPage(props: { params: Params }) {
    const params = await props.params
    const country = await getCountryQuery(params.id)

    return <CountriesForm id={params.id} data={country} />
}
