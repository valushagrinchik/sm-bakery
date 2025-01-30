import { ProductResponseDto } from '@/shared/lib/sanMartinApi/Api'

export const ProductNameField = ({
    product,
}: {
    product: ProductResponseDto
}) => {
    return (
        <div className='flex gap-2'>
            {product?.image ? (
                <img
                    src={product?.image}
                    alt=''
                    height={40}
                    width={40}
                    className='h-8 w-8'
                />
            ) : (
                <div className='h-8 w-8' />
            )}
            <div className='flex-auto'>
                <p className='text-sm text-gray-900 font-medium'>
                    {product.name}
                </p>
                <p className='text-sm text-gray-500 font-medium'>
                    SKU {product.sku}
                </p>
            </div>
        </div>
    )
}
