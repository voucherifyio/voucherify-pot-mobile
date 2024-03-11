import Image from 'next/image'

interface ActiveRewards {
    title: string
    image?: string
}

const ActiveRewards = () => {
    const activeRewards: ActiveRewards[] = [
        {
            title: 'Free package of bubble gum',
            image: require('../../public/images/products/bubble-gum.png'),
        },
        { title: 'Free coca-cola', image: '' },
    ]
    return (
        <div className="mt-4">
            <header>
                <h1 className="mb-4 text-[18px] font-bold text-blue-text">
                    Active rewards/coupons
                </h1>
            </header>
            <div>
                {activeRewards.map((reward) => (
                    <div className="shadow-md rounded-xl flex justify-between bg-white mt-4 text-blue-text w-full h-[60px]	items-center">
                        <h3 className="text-[18px] font-extrabold p-2">
                            {reward?.title}
                        </h3>
                        {reward.image && (
                            <Image
                                src={reward.image}
                                alt="rewardImage"
                                width={48}
                                height={40}
                                className="max-w-[48px] max-h-[48px] mr-2"
                            />
                        )}
                    </div>
                ))}
            </div>
        </div>
    )
}
export default ActiveRewards
