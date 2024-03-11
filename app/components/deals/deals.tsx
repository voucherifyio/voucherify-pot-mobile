import Image from 'next/image'
import Button from '@/app/components/ui/atoms/button'

interface Deals {
    title: string
    image?: string
    active: boolean
}

const Deals = () => {
    const deals: Deals[] = [
        {
            title: 'Free package of bubble gum',
            image: require('../../../public/images/products/bubble-gum.png'),
            active: false,
        },
        { title: 'Free coca-cola', image: '', active: true },
    ]
    return (
        <div className="bg-blue-background h-full">
            <ul className="hidden text-sm font-medium text-center text-gray-500 rounded-lg shadow sm:flex dark:divide-gray-700 dark:text-gray-400">
                <li className="w-full focus-within:z-10">
                    <a
                        href="#"
                        className="inline-block w-full p-4 text-gray-900 bg-gray-100 border-r border-gray-200 dark:border-gray-700 rounded-s-lg focus:ring-4 focus:ring-blue-300 active focus:outline-none dark:bg-gray-700 dark:text-white"
                        aria-current="page"
                    >
                        Profile
                    </a>
                </li>
                <li className="w-full focus-within:z-10">
                    <a
                        href="#"
                        className="inline-block w-full p-4 bg-white border-r border-gray-200 dark:border-gray-700 hover:text-gray-700 hover:bg-gray-50 focus:ring-4 focus:ring-blue-300 focus:outline-none dark:hover:text-white dark:bg-gray-800 dark:hover:bg-gray-700"
                    >
                        Dashboard
                    </a>
                </li>
                <li className="w-full focus-within:z-10">
                    <a
                        href="#"
                        className="inline-block w-full p-4 bg-white border-r border-gray-200 dark:border-gray-700 hover:text-gray-700 hover:bg-gray-50 focus:ring-4 focus:ring-blue-300 focus:outline-none dark:hover:text-white dark:bg-gray-800 dark:hover:bg-gray-700"
                    >
                        Settings
                    </a>
                </li>
                <li className="w-full focus-within:z-10">
                    <a
                        href="#"
                        className="inline-block w-full p-4 bg-white border-s-0 border-gray-200 dark:border-gray-700 rounded-e-lg hover:text-gray-700 hover:bg-gray-50 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:hover:text-white dark:bg-gray-800 dark:hover:bg-gray-700"
                    >
                        Invoice
                    </a>
                </li>
            </ul>

            {deals.map((deal) => (
                <div className="shadow-md h-[120px] rounded-xl m-4 flex bg-white text-blue-text w-[90%]">
                    <div className="flex flex-col justify-center p-2 w-3/5">
                        <h3 className="text-[18px] font-extrabold">
                            {deal?.title}
                        </h3>
                        <Button
                            buttonType={deal.active ? 'activeCoupon' : 'yellow'}
                            className="mt-2 max-h-[32px] max-w-[149px] text-[16px]"
                        >
                            {deal.active
                                ? '✓ Active coupon'
                                : 'Activate coupon'}
                        </Button>
                    </div>

                    {/* Second Column: Image */}
                    {deal.image && (
                        <div className="flex items-center ml-2 w-2/5">
                            <Image
                                src={deal.image}
                                alt="rewardImage"
                                width={120}
                                height={100}
                                className="max-w-[120px] max-h-[100px]"
                            />
                        </div>
                    )}
                </div>
            ))}
        </div>
    )
}
export default Deals
