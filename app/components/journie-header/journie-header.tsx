import { IoMdArrowBack } from 'react-icons/io'

interface JournieHeaderProps {
    headerText: string
}
const JournieHeader: React.FC<JournieHeaderProps> = ({ headerText }) => {
    return (
        <div className="flex px-4 border-b h-[8%] w-full bg-white">
            <div className="w-full flex flex-row items-center">
                <div>
                    <IoMdArrowBack size={20} color={'blue'} />
                </div>
                <h1 className="text-center w-[100%] text-blue-text text-2xl font-extrabold">
                    {headerText}
                </h1>
            </div>
        </div>
    )
}

export default JournieHeader
