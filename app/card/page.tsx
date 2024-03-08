import { IoMdArrowBack } from 'react-icons/io'

export default function CardPage() {
    //todo get the real customer name
    const customerName = 'John'
    return (
        <div className="h-screen items-center justify-center">
            {/*header*/}
            <div className="flex-row my-4 px-4 border-b-2 h-[8%] w-full bg-white">
                <div className="w-[100%] flex flex-row items-center">
                    <div className="w-[20%]">
                        <IoMdArrowBack size={20} color={'blue'} />
                    </div>
                    <h1 className="text-blue-text text-2xl font-extrabold">
                        My Journie Card
                    </h1>
                </div>
            </div>
        </div>
    )
}
