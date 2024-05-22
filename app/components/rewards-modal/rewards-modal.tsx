import {
    CustomerObject,
    LoyaltiesListMemberRewardsResponseBody,
} from '@voucherify/sdk'
import { Dispatch, FC, SetStateAction, useContext, useState } from 'react'
import Button from '@/app/components/ui/atoms/button'
import { MobileAppContext } from '../app-context/app-context'
import { CAMPAIGNS } from '@/enum/campaigns'
import { PulseLoader } from 'react-spinners'
import {
    Box,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    useDisclosure,
} from '@chakra-ui/react'

type RewardsModalProps = {
    rewards: LoyaltiesListMemberRewardsResponseBody['data']
    rewardModalOpened: boolean
    setRewardModalOpened: Dispatch<SetStateAction<boolean>>
    loading: boolean
    setCalculatedRewardPoints: Dispatch<SetStateAction<number>>
}

const RewardsModal: FC<RewardsModalProps> = ({
    rewards,
    rewardModalOpened,
    setRewardModalOpened,
    loading,
    setCalculatedRewardPoints,
}) => {
    const [rewardId, setRewardId] = useState<string | null>(null)
    const [isVoucherGenerationProcess, setIsVoucherGenerationProcess] =
        useState(false)
    const {
        dealsAndRewards,
        setDealsAndRewards,
        autoRedeem,
        customer,
        redeemCustomerReward,
        loyaltyPoints,
    } = useContext(MobileAppContext)
    const { onClose } = useDisclosure()

    const handleRedeemReward = async (
        customer: CustomerObject | undefined,
        rewardId: string,
        campaignName: string
    ) => {
        setIsVoucherGenerationProcess(true)
        const { status } = await redeemCustomerReward(
            customer,
            rewardId,
            campaignName
        )
        if (customer?.id && status === 'success') {
            setDealsAndRewards({
                ...dealsAndRewards,
                rewards: dealsAndRewards.rewards + 1,
            })
            setRewardModalOpened(false)
            setIsVoucherGenerationProcess(false)
            setCalculatedRewardPoints(0)
            autoRedeem(customer, loyaltyPoints)
        }
    }

    if (!rewardModalOpened) return null

    return (
        <Modal isCentered isOpen={rewardModalOpened} onClose={onClose}>
            <ModalOverlay bg="blue.700" backdropFilter="blur(1px)" />
            <ModalContent
                style={{
                    backgroundColor: '#FFF',
                    margin: '110px 10px 0 10px',
                    borderRadius: '8px',
                    padding: '10px',
                    position: 'relative',
                    boxShadow: '0px 0px 15px 0px rgba(152, 152, 152, 1)',
                }}
            >
                {isVoucherGenerationProcess && (
                    <VoucherGenerationProcess message="Voucher generation process..." />
                )}
                {loading && (
                    <PulseLoader
                        size={5}
                        color="#173c9f"
                        style={{ margin: 'auto' }}
                    />
                )}
                {!loading && rewards?.length <= 0 && (
                    <Box className="flex-1 w-full h-full flex justify-center items-center">
                        <ModalCloseButton
                            onClick={() => setRewardModalOpened(false)}
                            style={{
                                position: 'absolute',
                                top: '10px',
                                right: '10px',
                            }}
                        />
                        <p className="text-[14px] font-bold text-blue-text">
                            You don't have any rewards.
                        </p>
                    </Box>
                )}
                {!loading &&
                    !isVoucherGenerationProcess &&
                    rewards?.length >= 1 && (
                        <Box
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '20px',
                            }}
                        >
                            <ModalHeader
                                style={{
                                    fontSize: '18px',
                                    textAlign: 'center',
                                    flex: 1,
                                    fontWeight: 700,
                                    color: '#173c9f',
                                }}
                            >
                                Rewards
                            </ModalHeader>
                            <ModalCloseButton
                                onClick={() => setRewardModalOpened(false)}
                                style={{
                                    position: 'absolute',
                                    top: '15px',
                                    right: '15px',
                                }}
                            />
                            <ModalBody
                                style={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    gap: '10px',
                                    flexWrap: 'wrap',
                                }}
                            >
                                {rewards.map(({ reward }) => (
                                    <Button
                                        key={reward.id}
                                        style={{
                                            backgroundColor:
                                                rewardId === reward.id
                                                    ? '#000'
                                                    : '#22c55e',
                                        }}
                                        className="h-auto text-white text-center text-sm rounded-md py-2 px-2"
                                        onClick={() => {
                                            setRewardId(reward.id)
                                        }}
                                    >
                                        {reward.name}
                                    </Button>
                                ))}
                            </ModalBody>
                            <ModalFooter
                                style={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    padding: '0 15px',
                                    gap: '20px',
                                }}
                            >
                                {rewardId && (
                                    <Button
                                        onClick={() =>
                                            handleRedeemReward(
                                                customer,
                                                rewardId,
                                                CAMPAIGNS.MILESTONE_REWARDS_PROGRAM
                                            )
                                        }
                                        style={{
                                            backgroundColor: '#173c9f',
                                            height: '35px',
                                            padding: '0 8px',
                                            color: '#FFF',
                                        }}
                                    >
                                        Choose
                                    </Button>
                                )}
                                <Button
                                    onClick={() => setRewardModalOpened(false)}
                                    style={{
                                        backgroundColor: '#edf2f7',
                                        height: '35px',
                                        padding: '0 8px',
                                    }}
                                >
                                    Close
                                </Button>
                            </ModalFooter>
                        </Box>
                    )}
            </ModalContent>
        </Modal>
    )
}

const VoucherGenerationProcess = ({ message }: { message: string }) => (
    <div className="flex justify-center items-center w-full h-full min-h-[35px]">
        <p className="text-[14px] font-bold text-blue-text">{message}</p>
    </div>
)

export default RewardsModal
