import {
  Button,
  ButtonText,
  Card,
  H1,
  H2,
  H3,
  Label,
  Paragraph,
  ScrollView,
  Stack,
  Text,
  Theme,
  View,
  XStack,
  YStack,
} from '@my/ui'

import React from 'react'

import {
  UseDistributionsResultData,
  useDistributions,
  useSendTokenBalance,
} from 'app/utils/distributions'
import { useDistributionNumber } from 'app/routers/params'
import { TimeRemaining, useTimeRemaining } from 'app/utils/useTimeRemaining'
import { useUserReferralsCount } from 'app/utils/useUserReferralsCount'

import { useChainAddresses } from 'app/utils/useChainAddresses'
import { DistributionClaimButton } from './components/DistributionClaimButton'

export function EarnTokensScreen() {
  const { data: distributions, isLoading } = useDistributions()
  const [distributionNumberParam] = useDistributionNumber()
  const selectedDistributionIndex = distributionNumberParam
    ? distributionNumberParam - 1
    : distributions
      ? distributions.length - 1
      : 0
  const selectedDistribution = distributions?.at(selectedDistributionIndex)

  return (
    <YStack
      f={1}
      my="auto"
      gap="$6"
      px="$3"
      $gtLg={{ px: '$11' }}
      pb="$2"
      $gtSm={{ pb: '$8', px: '$6' }}
      jc="space-between"
    >
      {selectedDistribution ? (
        <YStack
          gap="$4"
          f={2}
          overflow={'hidden'}
          $gtSm={{ borderTopColor: '$gray7Dark', borderTopWidth: '$1', gap: '$8' }}
        >
          <DistributionRewardsSection distribution={selectedDistribution} isLoading={isLoading} />
        </YStack>
      ) : (
        <Stack f={1} gap="$6" jc="center" ai="center">
          <H2>No distributions available</H2>
        </Stack>
      )}

      <DistributionRewardsList
        selectedIndex={selectedDistributionIndex}
        distributions={distributions}
      />
    </YStack>
  )
}

const DistributionRewardsSection = ({
  distribution,
  isLoading,
}: { distribution: UseDistributionsResultData[number]; isLoading: boolean }) => {
  const now = new Date()
  const hasDistribution = !isLoading && distribution

  const isBeforeQualification = hasDistribution && now < distribution.qualification_start
  const isDuringQualification =
    hasDistribution &&
    now >= distribution.qualification_start &&
    now <= distribution.qualification_end
  const isClaimable =
    hasDistribution && now > distribution.qualification_end && now <= distribution.claim_end

  const timeRemaining = useTimeRemaining(
    isLoading
      ? now
      : isBeforeQualification
        ? distribution.qualification_start
        : isDuringQualification
          ? distribution.qualification_end
          : isClaimable
            ? distribution.claim_end
            : now
              ? distribution.qualification_start
              : isDuringQualification
                ? distribution.qualification_end
                : isClaimable
                  ? distribution.claim_end
                  : now
  )
  return (
    <YStack f={1} $gtXs={{ gap: '$6' }} gap="$4">
      <Stack gap="$2" $gtSm={{ py: '$6', gap: '$6' }}>
        <Label fontFamily={'$mono'} fontSize={'$5'}>
          ROUND
        </Label>
        <XStack w="100%" ai="center" jc="space-around" mt="auto">
          <Stack>
            <Theme inverse>
              <H1
                fontFamily={'$mono'}
                fontWeight={'300'}
                fontSize={54}
                $gtSm={{ fontSize: 79 }}
                col="$background"
              >
                #{distribution.number}
              </H1>
            </Theme>
          </Stack>
          <View borderRightWidth={1} borderColor={'$decay'} w={0} h="100%" ai="stretch" mx="$4" />
          <Stack
            $gtSm={{ fd: 'row', gap: '$0' }}
            fd="column"
            gap="$2"
            f={1}
            justifyContent="space-between"
          >
            <ClaimTimeRemaining timeRemaining={timeRemaining} />
            <YStack $gtSm={{ ai: 'flex-end' }} gap="$2">
              <Label fontFamily={'$mono'}>Status</Label>
              <Theme inverse>
                <DistributionStatus distribution={distribution} />
              </Theme>
            </YStack>
          </Stack>
        </XStack>
      </Stack>
      <Stack fd="column" $gtLg={{ fd: 'row' }} gap="$2" $gtSm={{ gap: '$4', f: 1 }} my="auto">
        <YStack f={1} $gtLg={{ w: '50%' }} gap="$2" $gtSm={{ gap: '$4' }}>
          <Stack f={1} gap="$2" $gtSm={{ gap: '$4' }}>
            <SendBalanceCard />
          </Stack>
          <XStack f={1} gap="$2" $gtSm={{ gap: '$4' }}>
            <MinBalanceCard hodler_min_balance={distribution.hodler_min_balance} />
            <ReferralsCard />
          </XStack>
        </YStack>
        <Stack f={1} $gtLg={{ w: '50%', f: 1 }}>
          <SendRewardsCard distribution={distribution} />
        </Stack>
      </Stack>
    </YStack>
  )
}

const ClaimTimeRemaining = ({ timeRemaining }: { timeRemaining: TimeRemaining }) => {
  return (
    <YStack gap="$2">
      <Label fontFamily={'$mono'}>Valid for</Label>
      <XStack ai={'flex-start'} jc="space-between" maw={312}>
        <Theme inverse>
          <ClaimTimeRemainingDigit>
            {String(timeRemaining.days).padStart(2, '0')}D
          </ClaimTimeRemainingDigit>
          <ClaimTimeRemainingDigit>:</ClaimTimeRemainingDigit>
          <ClaimTimeRemainingDigit>
            {String(timeRemaining.hours).padStart(2, '0')}Hr
          </ClaimTimeRemainingDigit>
          <ClaimTimeRemainingDigit>:</ClaimTimeRemainingDigit>
          <ClaimTimeRemainingDigit>
            {String(timeRemaining.minutes).padStart(2, '0')}Min
          </ClaimTimeRemainingDigit>
          <ClaimTimeRemainingDigit>:</ClaimTimeRemainingDigit>
          <ClaimTimeRemainingDigit>
            {String(timeRemaining.seconds).padStart(2, '0')}Sec
          </ClaimTimeRemainingDigit>
        </Theme>
      </XStack>
    </YStack>
  )
}

const ClaimTimeRemainingDigit = ({ children }: { children?: string | string[] }) => (
  <Text
    fontWeight={'500'}
    fontSize="$5"
    $gtMd={{ fontSize: '$7' }}
    col="$background"
    fontFamily={'$mono'}
  >
    {children}
  </Text>
)

const SendBalanceCard = () => {
  const { data: addresses, error: chainAddressesError } = useChainAddresses()

  const address = addresses?.[0]?.address
  if (chainAddressesError) throw chainAddressesError

  const { data: sendBalance, error: sendBalanceError } = useSendTokenBalance(address)

  if (sendBalanceError) throw sendBalanceError

  return (
    <Card
      f={1}
      bc="transparent"
      borderWidth={1}
      br={12}
      borderColor={'$decay'}
      p="$4"
      $gtSm={{ p: '$6' }}
      jc="center"
    >
      <YStack gap="$4">
        <Label fontFamily={'$mono'} col="$olive">
          Send Balance
        </Label>
        <Theme inverse>
          <Paragraph fontFamily={'$mono'} col="$background" fontSize={'$7'} fontWeight={'500'}>
            {sendBalance?.value ? sendBalance.value : '?'} SEND
          </Paragraph>
        </Theme>
      </YStack>
    </Card>
  )
}
const MinBalanceCard = ({ hodler_min_balance }: { hodler_min_balance?: number }) => (
  <Card
    f={2}
    bc="transparent"
    borderWidth={1}
    br={12}
    borderColor={'$decay'}
    p="$4"
    $gtSm={{ p: '$6' }}
    jc="center"
  >
    <YStack gap="$4">
      <Label fontFamily={'$mono'}>Min Balance required</Label>
      <Theme inverse>
        <Paragraph fontFamily={'$mono'} col="$background" fontSize={'$7'} fontWeight={'500'}>
          {hodler_min_balance ? hodler_min_balance : '?'} SEND
        </Paragraph>
      </Theme>
    </YStack>
  </Card>
)

const ReferralsCard = () => {
  const { referralsCount, error } = useUserReferralsCount()
  if (error) throw error
  return (
    <Card
      f={1}
      bc="transparent"
      borderWidth={1}
      br={12}
      borderColor={'$decay'}
      p="$4"
      $gtSm={{ p: '$6' }}
      jc="center"
    >
      <YStack gap="$4">
        <Label fontFamily={'$mono'} col="$olive">
          Referrals
        </Label>
        <Theme inverse>
          <Paragraph fontFamily={'$mono'} col="$background" fontSize={'$7'} fontWeight={'500'}>
            {referralsCount}
          </Paragraph>
        </Theme>
      </YStack>
    </Card>
  )
}

const SendRewardsCard = ({
  distribution,
}: { distribution: UseDistributionsResultData[number] }) => {
  return (
    <Card f={1} mih={198} $gtLg={{ f: 1 }} $gtMd={{ f: 2 }} bc="$darkest" br={12} jc="center">
      <YStack w={'100%'} gap="$8" mx="auto" jc="center" ai="center">
        <Stack gap="$6">
          <Label fontFamily={'$mono'} col="$olive">
            Rewards
          </Label>
          <Theme inverse>
            <Paragraph
              fontFamily={'$mono'}
              col="$background"
              $gtXs={{ fontSize: '$10' }}
              fontSize={'$9'}
              fontWeight={'500'}
              lh={40}
            >
              0 SEND
            </Paragraph>
          </Theme>
        </Stack>
        <DistributionClaimButton distribution={distribution} />
      </YStack>
    </Card>
  )
}

const DistributionStatus = ({
  distribution,
}: { distribution: UseDistributionsResultData[number] }) => {
  const isClaimActive = distribution.qualification_end < new Date()
  return (
    <H3 fontSize="$5" $gtMd={{ fontSize: '$7' }} fontWeight={'500'} col="$background">
      {isClaimActive ? 'Open' : 'Closed'}
    </H3>
  )
}

const numOfDistributions = 10
const DistributionRewardsList = ({
  distributions,
  selectedIndex,
}: { distributions?: UseDistributionsResultData; selectedIndex: number }) => {
  const { isLoading, error } = useDistributions()
  const [distributionNumberParam, setDistributionNumberParam] = useDistributionNumber()
  const allDistributions = distributions?.concat(
    Array(numOfDistributions - distributions.length).fill(undefined)
  )

  if (error) throw error

  if (isLoading) return <DistributionRewardsSkeleton />

  return (
    <ScrollView
      jc="flex-start"
      $gtLg={{ f: 1 }}
      flex={0}
      overflow="scroll"
      showsHorizontalScrollIndicator={false}
      showsVerticalScrollIndicator={false}
    >
      <XStack w="100%" gap="$2" jc={'space-between'} py="$2" maw={1072} mx="auto">
        {allDistributions?.map((distribution, i) => {
          return distribution === undefined ? (
            <Button bc={'$darkest'} maw={84} miw="$7" h="$2" br={6} disabled opacity={0.4}>
              <ButtonText size={'$1'} padding={'unset'} ta="center" margin={'unset'} col="$olive">
                {`# ${i + 1}`}
              </ButtonText>
            </Button>
          ) : distributionNumberParam === distribution?.number ||
            (distributionNumberParam === undefined &&
              distribution?.number === distributions?.length) ? (
            <Button
              key={distribution?.id}
              bc={'$accent12Dark'}
              maw={84}
              miw="$7"
              h="$2"
              br={6}
              onPress={() => setDistributionNumberParam(distribution.number)}
            >
              <ButtonText size={'$1'} padding={'unset'} ta="center" margin={'unset'} col="$black">
                {`# ${distribution?.number}  `}
              </ButtonText>
            </Button>
          ) : (
            <Button
              key={distribution?.id}
              bc={'$decay'}
              maw={84}
              miw="$7"
              h="$2"
              br={6}
              onPress={() => setDistributionNumberParam(distribution.number)}
            >
              <ButtonText size={'$1'} padding={'unset'} ta="center" margin={'unset'} col="white">
                {`# ${distribution?.number}  `}
              </ButtonText>
            </Button>
          )
        })}
      </XStack>
    </ScrollView>
  )
}

const DistributionRewardsSkeleton = () => {
  return null
}
