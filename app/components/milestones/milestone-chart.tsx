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
                    <div className="flex items-center">
                        <div
                            className={`${points < 150 ? 'bg-gray-300' : 'bg-yellow-button'} flex w-full bg-yellow-button h-2 z-0`}
                        ></div>
                    </div>
                    <div className="relative bottom-4 w-6 h-6 bg-yellow-button z-10 rounded-full flex items-center justify-center text-blue-text">
                        <MdOutlineLocalGasStation />
                    </div>
                    <div>
                        <h3 className="text-12 font-bold text-blue-text">0</h3>
                    </div>
                </li>
                <li className="relative mb-6 w-full">
                    <div className="flex items-center">
                        <div
                            className={`${points < 300 ? 'bg-gray-300' : 'bg-yellow-button'} ${points < 150 ? 'bg-gray-300' : 'bg-yellow-button'} flex w-full bg-yellow-button h-2`}
                        ></div>
                    </div>
                    <div
                        className={`${points < 150 ? 'bg-gray-300' : 'bg-yellow-button'} relative bottom-4 w-6 h-6 bg-yellow-button z-10 rounded-full flex items-center justify-center text-blue-text`}
                    >
                        {points < 300 ? (
                            <MdLock />
                        ) : (
                            <MdOutlineLocalGasStation />
                        )}
                    </div>
                    <div>
                        <div className="text-12 font-bold text-blue-text">
                            150
                        </div>
                    </div>
                </li>
                <li className="relative mb-6 w-full">
                    <div className="flex items-center">
                        <div
                            className={`flex w-full ${points < 1000 ? 'bg-gray-300' : 'bg-yellow-button'} h-2`}
                        ></div>
                    </div>
                    <div
                        className={`relative bottom-4 w-6 h-6 bg-yellow-button z-10 rounded-full flex items-center justify-center text-blue-text ${points < 300 ? 'bg-gray-300' : 'bg-yellow-button'}`}
                    >
                        {points < 1000 ? (
                            <MdLock />
                        ) : (
                            <MdOutlineLocalGasStation />
                        )}
                    </div>
                    <div>
                        <h3 className="text-12 font-bold text-blue-text">
                            300
                        </h3>
                    </div>
                </li>
            </ol>
        </div>
    )
}

export default MilestoneChart
