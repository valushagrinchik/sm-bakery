'use client'

import { updateProductVisibility } from '@/actions/product'
import { Role } from '@/shared/enums/role'
import {
    ProductResponseDto,
    UserResponseDto,
} from '@/shared/lib/sanMartinApi/Api'
import { StatusBadge } from '@/shared/ui'
import { SubmitButton } from '@/shared/ui/SubmitButton'
import { Checkbox, Radio, RadioGroup, Switch } from '@headlessui/react'
import { XIcon } from '@heroicons/react/outline'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export const ProductView = ({
    id,
    data,
    me,
}: {
    id: number
    data: ProductResponseDto
    me: UserResponseDto
}) => {
    const t = useTranslations('panel.product-management.form.view')
    const router = useRouter()
    const [productVisibility, setProductVisibility] = useState(
        data?.isVisibility
    )

    return (
        <>
            <div className='w-full flex items-center px-8 min-h-20 bg-brand-dark'>
                <p className='flex-auto text-lg text-white font-semibold'>
                    {t('title')}
                </p>
                <div
                    className='p-2 cursor-pointer'
                    onClick={() => router.back()}
                >
                    <XIcon className='h-4 w-4 text-white' />
                </div>
            </div>
            <div className='p-6 flex-auto w-fit'>
                {data?.image && (
                    <img
                        src={data?.image}
                        alt=''
                        height={190}
                        width={190}
                        className='h-[190px] w-[190px]'
                    />
                )}
                <div className='flex gap-2 items-center'>
                    <h1 className='text-lg text-gray-900 font-semibold'>
                        {data?.name}
                    </h1>
                    <StatusBadge value={data.status as unknown as string} />
                    <p className='text-sm text-brand-dark font-semibold flex-auto self-start text-right'>
                        {data.price} GTQ
                    </p>
                </div>
                <p className='text-sm text-gray-500'>SKU {data.sku}</p>
                <p className='text-sm leading-5 mt-3 max-w-[552px]'>
                    {data.description}
                </p>
                <div className='flex gap-2 mt-4'>
                    {data?.categories?.map(category => (
                        <p
                            key={category.id}
                            className='text-sm text-gray-800 font-medium rounded text-ls px-2.5 py-0.5 bg-gray-100'
                        >
                            {category.name}
                        </p>
                    ))}
                    {data?.subCategories?.map(category => (
                        <p
                            key={category.id}
                            className='text-sm text-gray-800 font-medium rounded text-ls px-2.5 py-0.5 bg-gray-100'
                        >
                            {category.name}
                        </p>
                    ))}
                </div>
                <div
                    className={`flex gap-3 mt-4 items-center ${me?.roleId !== Role.SUPER_ADMINISTRATOR ? 'opacity-80' : ''}`}
                >
                    <Switch
                        checked={productVisibility}
                        onChange={
                            me?.roleId === Role.SUPER_ADMINISTRATOR
                                ? () => {
                                      updateProductVisibility(
                                          id,
                                          !productVisibility
                                      )
                                      setProductVisibility(!productVisibility)
                                  }
                                : undefined
                        }
                        className={`group relative inline-flex h-6 w-11 shrink-0 rounded-full border-2 border-transparent bg-gray-200 transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-brand-blue focus:ring-offset-2 data-[checked]:bg-brand-dark ${me?.roleId !== Role.SUPER_ADMINISTRATOR ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                    >
                        <span className='sr-only'>Use setting</span>
                        <span
                            aria-hidden='true'
                            className='pointer-events-none inline-block size-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out group-data-[checked]:translate-x-5'
                        />
                    </Switch>
                    <p className='text-sm text-gray-800 font-medium'>
                        {t('isVisibility')}
                    </p>
                </div>
                {!!data?.modifiers?.length && (
                    <div className='mt-4'>
                        <p className='text-lg text-gray-700 font-semibold'>
                            {t('modifiers')}
                        </p>
                        <div className='flex mt-2 gap-10 w-fit'>
                            {data.modifiers?.map((modifier: any) => (
                                <div
                                    key={modifier.id}
                                    className='flex flex-col gap-2'
                                >
                                    <p className='text-sm text-gray-700 font-semibold'>
                                        {modifier.name}
                                    </p>
                                    {modifier?.modifierProducts.length ? (
                                        modifier.modifierProducts?.map(
                                            (product: any) => (
                                                <div
                                                    key={product.id}
                                                    className='flex gap-2 items-center'
                                                >
                                                    {modifier.typeModifier ===
                                                    1 ? (
                                                        <Checkbox
                                                            disabled
                                                            className='h-4 w-4 border border-gray-300 bg-gray-100 rounded'
                                                        />
                                                    ) : (
                                                        <RadioGroup className='min-w-4'>
                                                            <Radio
                                                                disabled
                                                                value
                                                                className='h-4 min-w-4 border border-gray-300 bg-gray-100 rounded-full block'
                                                            />
                                                        </RadioGroup>
                                                    )}
                                                    <p className='text-sm text-gray-800 font-medium'>
                                                        {product.name}
                                                    </p>
                                                    {product?.typeChange ===
                                                        '+' && (
                                                        <p className='text-sm text-gray-500 font-medium'>
                                                            {`(+Q${product.price})`}
                                                        </p>
                                                    )}
                                                </div>
                                            )
                                        )
                                    ) : (
                                        <p className='text-sm text-gray-800 font-medium'>
                                            {t('noModifiers')}
                                        </p>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
            <div className='p-4 border-t border-gray-200'>
                <SubmitButton
                    className='w-fit ml-auto'
                    onClick={() => router.back()}
                >
                    {t('ok')}
                </SubmitButton>
            </div>
        </>
    )
}
