import {
    MdCreditCard,
    MdHome,
    MdOutlineLocalOffer,
    MdOutlineMap,
    MdStars,
} from 'react-icons/md'

const Navbar = () => {
    return (
        <div className="fixed bottom-0 left-0 z-50 w-full h-16 bg-white border-t border-gray-200">
            <div className="grid h-full max-w-screen-sm grid-cols-5 mx-auto font-medium">
                <button
                    type="button"
                    className="inline-flex flex-col items-center justify-center px-5 "
                >
                    <MdHome color="gray" />
                    <span className="text-sm text-gray-500  ">Home</span>
                </button>
                <button
                    type="button"
                    className="inline-flex flex-col items-center justify-center px-5 group"
                >
                    <MdOutlineLocalOffer color="gray" />
                    <span className="text-sm text-gray-500 ">Deals</span>
                </button>
                <button
                    type="button"
                    className="inline-flex flex-col items-center justify-center px-5 group"
                >
                    <MdCreditCard color="gray" />
                    <span className="text-sm text-gray-500 ">Card</span>
                </button>
                <button
                    type="button"
                    className="inline-flex flex-col items-center justify-center px-5 group"
                >
                    <MdOutlineMap color="gray" />
                    <span className="text-sm text-gray-500">Map</span>
                </button>
                <button
                    type="button"
                    className="inline-flex flex-col items-center justify-center px-5 group"
                >
                    <MdStars color="gray" />
                    <span className="text-sm text-gray-500">Rewards</span>
                </button>
            </div>
        </div>
    )
}

export default Navbar
