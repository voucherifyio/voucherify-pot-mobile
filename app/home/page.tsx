import { MdOutlineAccountCircle } from 'react-icons/md'
import Button from '@/app/components/ui/atoms/button'
import Image from 'next/image'
import aeroplan from '@/public/images/aeroplan.png'

export default function HomePage() {
    //todo get the real customer name
    const customerName = 'John'
    return (
        <div className="h-screen items-center justify-center">
            <div className="flex my-4 px-4 border-b-2 h-[8%] w-full bg-white">
                <div className="w-[80%]">
                    <h1 className="text-blue-text text-2xl font-extrabold">
                        My Journie
                    </h1>
                    <h4 className="text-blue-text text-[15px] font-normal">
                        Hello {customerName}
                    </h4>
                </div>
                <div className="w-[20%]">
                    <MdOutlineAccountCircle size={24} color="blue" />
                </div>
            </div>
            <div className="flex-row my-4 mx-border-b-2 h-[100%] w-full bg-blue-background">
                {/*upselling*/}
                <div className="h-[15%] bg-blue-background w-full">
                    {/*UPSELLING COMPONENT*/}
                </div>
                {/*main*/}
                <div className="h-[50%] w-full"></div>
                {/*partner hub*/}
                <div className="h-[20%] mx-4 text-blue-text text-18 font-bold flex justify-between">
                    <div className="flex-col">
                        <h1 className="mb-2 text-blue-text text-18 font-bold">
                            Partner Hub
                        </h1>
                        <h4 className="mb-4 text-blue-text text-14 font-normal">
                            Get linked. Get more.
                        </h4>
                        <Button buttonType="yellow" className="w-[140px] px-2">
                            Link to Aeroplan
                        </Button>
                    </div>
                    <Image
                        src={aeroplan}
                        alt="aeroplan"
                        className="h-[112px] w-[130px] object-cover object-right"
                    />
                </div>
            </div>
        </div>
    )
}
