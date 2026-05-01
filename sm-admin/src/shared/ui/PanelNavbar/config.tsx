import { NavbarButtonProps } from '@/shared/types/navbar'
import {
    AdjustmentsIcon,
    ChartBarIcon,
    FolderOpenIcon,
    MenuIcon,
    OfficeBuildingIcon,
    PencilAltIcon,
    UsersIcon,
} from '@heroicons/react/outline'

export const panelNavbarConfig: NavbarButtonProps[] = [
    {
        text: 'productManagement',
        icon: <MenuIcon className='h6 w-6 text-white' />,
        //subButtons: [
        //    {
        //        text: 'categories',
        //        link: '/categories',
        //        permission: 'viewProductManagement',
        //    },
        //    {
        //        text: 'products',
        //        link: '/products',
        //        permission: 'viewProductManagement',
        //    },
        //],
        link: '/product-management',
        permission: 'viewProductManagement',
    },
    {
        text: 'operationalStructure',
        icon: <OfficeBuildingIcon className='h-6 w-6 text-white' />,
        subButtons: [
            {
                text: 'countries',
                link: '/countries',
                permission: 'viewCountry',
            },
            {
                text: 'stores',
                link: '/stores',
                permission: 'viewStore',
            },
            {
                text: 'deliveryZones',
                link: '/delivery-zones',
                permission: 'viewOperationalStructure',
            },
        ],
        permission: 'viewOperationalStructure',
    },
    {
        text: 'orderManagement',
        link: '/order-management',
        icon: <FolderOpenIcon className='h-6 w-6 text-white' />,
        permission: 'viewOrderManagement',
    },
    {
        text: 'usersManagement',
        icon: <UsersIcon className='h-6 w-6 text-white' />,
        subButtons: [
            {
                text: 'customerManagement',
                link: '/customer-management',
                permission: 'viewUserManagement',
            },
            {
                text: 'operator-management',
                link: '/operator-management',
                permission: 'viewUserManagement',
            },
        ],
        permission: 'viewUserManagement',
    },
    {
        text: 'reportingAndAnalytics',
        link: '/analytics',
        icon: <ChartBarIcon className='h-6 w-6 text-white' />,
        permission: 'viewReportingAndAnalytics',
    },
    {
        text: 'appVersionManagement',
        link: '/app-version-management',
        icon: <PencilAltIcon className='min-w-6 h-6 w-6 text-white' />,
        permission: 'viewVersion',
    },
    {
        text: 'accountSettings',
        link: '/account-settings',
        icon: <AdjustmentsIcon className='h-6 w-6 text-white' />,
    },
]
