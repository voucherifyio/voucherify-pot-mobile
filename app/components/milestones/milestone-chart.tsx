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
                        <p className="bg-blue-button rounded-full focus:border-blue-300 text-[12px]">
                            0
                        </p>
                    </div>
                    <div className="flex items-center">
                        <div
                            className={`${points < 37.5 ? 'bg-gray-300' : 'bg-yellow-button'} flex w-full h-2 z-0`}
                        ></div>
                    </div>
                    <div
                        className={`relative bottom-4 w-6 h-6 bg-yellow-button z-10 rounded-full flex items-center justify-center text-blue-text`}
                    >
                        <MdOutlineLocalGasStation />
                    </div>
                </li>
                <li className="relative w-full">
                    <div className="flex items-center">
                        <div
                            className={`${points < 75 ? 'bg-gray-300' : 'bg-yellow-button'} flex w-full h-2`}
                        ></div>
                    </div>
                    <div
                        className={` bg-white relative bottom-4 w-1 h-[9px] my-[7px] z-10 rounded-full flex items-center justify-center text-blue-text`}
                    ></div>
                </li>
                <li className="relative w-full">
                    <div className="flex items-center">
                        <div
                            className={`${points < 112.5 ? 'bg-gray-300' : 'bg-yellow-button'} flex w-full h-2`}
                        ></div>
                    </div>
                    <div
                        className={` bg-white relative bottom-4 w-1 h-[9px] my-[7px] z-10 rounded-full flex items-center justify-center text-blue-text`}
                    ></div>
                </li>
                <li className="relative w-full">
                    <div className="flex items-center">
                        <div
                            className={`${points < 150 ? 'bg-gray-300' : 'bg-yellow-button'} flex w-full h-2`}
                        ></div>
                    </div>
                    <div
                        className={` bg-white relative bottom-4 w-1 h-[9px] my-[7px] z-10 rounded-full flex items-center justify-center text-blue-text`}
                    ></div>
                </li>
                <li className="relative mb-6 w-full">
                    <div className="text-left text-blue-text mb-2 font-bold">
                        <p className="bg-blue-button rounded-full focus:border-blue-300 text-[12px]">
                            150
                        </p>
                    </div>
                    <div className="flex items-center">
                        <div
                            className={`${points < 187.5 ? 'bg-gray-300' : 'bg-yellow-button'} flex w-full h-2`}
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
                        <div className="text-left text-blue-text m-[-15px] absolute top-[70px] left-[-10px]">
                            <button className="text-white bg-[#173C9F] h-[32px] rounded text-[16px] px-2">
                                Choose
                            </button>
                        </div>
                    )}
                </li>
                <li className="relative w-full">
                    <div className="flex items-center">
                        <div
                            className={`${points < 225 ? 'bg-gray-300' : 'bg-yellow-button'} flex w-full h-2`}
                        ></div>
                    </div>
                    <div
                        className={` bg-white relative bottom-4 w-1 h-[9px] my-[7px] z-10 rounded-full flex items-center justify-center text-blue-text`}
                    ></div>
                </li>
                <li className="relative w-full">
                    <div className="flex items-center">
                        <div
                            className={`${points < 262.5 ? 'bg-gray-300' : 'bg-yellow-button'} flex w-full h-2`}
                        ></div>
                    </div>
                    <div
                        className={` bg-white relative bottom-4 w-1 h-[9px] my-[7px] z-10 rounded-full flex items-center justify-center text-blue-text`}
                    ></div>
                </li>
                <li className="relative w-full">
                    <div className="flex items-center">
                        <div
                            className={`${points < 300 ? 'bg-gray-300' : 'bg-yellow-button'} flex w-full h-2`}
                        ></div>
                    </div>
                    <div
                        className={` bg-white relative bottom-4 w-1 h-[9px] my-[7px] z-10 rounded-full flex items-center justify-center text-blue-text`}
                    ></div>
                </li>
                <li className="relative mb-6">
                    <div className="text-left text-blue-text mb-2 font-bold">
                        <p className="bg-blue-button rounded-full focus:border-blue-300 text-[12px]">
                            300
                        </p>
                    </div>
                    <div className="items-center">
                        <div
                            className={`flex  ${points < 10000 ? 'bg-gray-300' : 'bg-yellow-button'} h-2`}
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
                </li>
            </ol>
        </div>
    )
}

export default MilestoneChart
