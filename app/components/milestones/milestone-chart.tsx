'use client'
import { MdLock, MdOutlineLocalGasStation } from 'react-icons/md'

interface MilestoneChartProps {
    points: number
}
const MilestoneChart: React.FC<MilestoneChartProps> = ({ points }) => {
    return (
        <div className="p-4">
            <ol className="items-center flex">
                <li className="relative mb-6 w-full">
                    <div className="text-left text-blue-text mb-2 ml-2 font-bold">
                        <button className="bg-blue-button rounded-full focus:border-blue-300 text-[12px]">
                            0
                        </button>
                    </div>
                    <div className="flex items-center">
                        <div
                            className={`${points < 150 ? 'bg-gray-300' : 'bg-yellow-button'} flex w-full h-2 z-0`}
                        ></div>
                    </div>
                    <div
                        className={`relative bottom-4 w-6 h-6 bg-yellow-button z-10 rounded-full flex items-center justify-center text-blue-text`}
                    >
                        <MdOutlineLocalGasStation />
                    </div>
                </li>
                <li className="relative mb-6 w-full">
                    <div className="text-left text-blue-text mb-2 font-bold">
                        <button className="bg-blue-button rounded-full focus:border-blue-300 text-[12px]">
                            150
                        </button>
                    </div>
                    <div className="flex items-center">
                        <div
                            className={`${points < 300 ? 'bg-gray-300' : 'bg-yellow-button'} flex w-full h-2`}
                        ></div>
                    </div>
                    <div
                        className={`${points < 150 ? 'bg-gray-300' : 'bg-yellow-button'} relative bottom-4 w-6 h-6 z-10 rounded-full flex items-center justify-center text-blue-text`}
                    >
                        {points < 150 ? (
                            <MdLock />
                        ) : (
                            <MdOutlineLocalGasStation />
                        )}
                    </div>
                    {points >= 150 && (
                        <div className="text-left text-blue-text m-[-12px]">
                            <button className="bg-blue-button rounded-full focus:border-blue-300 text-[12px]">
                                Choose
                            </button>
                        </div>
                    )}
                </li>
                <li className="relative mb-6 w-full">
                    <div className="text-left text-blue-text mb-2 font-bold">
                        <button className="bg-blue-button rounded-full focus:border-blue-300 text-[12px]">
                            300
                        </button>
                    </div>
                    <div className="flex items-center">
                        <div
                            className={`flex w-full ${points < 10000 ? 'bg-gray-300' : 'bg-yellow-button'} h-2`}
                        ></div>
                    </div>
                    <div
                        className={`relative bottom-4 w-6 h-6 z-10 rounded-full flex items-center justify-center text-blue-text ${points < 300 ? 'bg-gray-300' : 'bg-yellow-button'}`}
                    >
                        {points < 300 ? (
                            <MdLock />
                        ) : (
                            <MdOutlineLocalGasStation />
                        )}
                    </div>
                    {points >= 300 && (
                        <div className="text-left text-blue-text m-[-12px]">
                            <button className="bg-blue-button rounded-full focus:border-blue-300 text-[12px]">
                                Choose
                            </button>
                        </div>
                    )}
                </li>
            </ol>
        </div>
    )
}

export default MilestoneChart
