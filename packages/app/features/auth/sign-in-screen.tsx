import {
  Container,
  H3,
  Stack,
  View,
  YStack,
  CornerTriangle,
  Button,
  ButtonText,
  Sup,
  Theme,
  XStack,
  useMedia,
  Text,
  useWindowDimensions,
} from '@my/ui'
import { IconSLogo, IconSendLogoGreenSlash } from 'app/components/icons'
import { InstantPayments, QRCodePayments, RealTimePayments } from 'app/components/img'
import { useEffect, useState } from 'react'

export const SignInScreen = () => {
  const { height: windowHeight } = useWindowDimensions()
  return (
    <Container>
      <YStack w="100%" h={windowHeight * 0.95} jc="space-around" mb="auto" mt="auto">
        <Stack f={1} h="25%" py="$5" jc="flex-end" ai="center" $gtMd={{ dsp: 'none' }}>
          <Theme inverse={true}>
            <IconSendLogoGreenSlash size={'$10'} color="$background" />
          </Theme>
        </Stack>
        <SignInCarousel />
      </YStack>
    </Container>
  )
}

const carouselComponents = [
  [
    <InstantPayments key="instant" style={{ borderRadius: 33 }} />,
    <>
      <Text
        fontSize="$8"
        $gtMd={{ fontSize: '$13' }}
        fontWeight={'bold'}
        lineHeight="$5"
        color="$white"
      >
        INSTANT
      </Text>
      <Sup super="TM" fontSize="$8" $gtMd={{ fontSize: '$13' }} color="$white" fontWeight={'bold'}>
        PAYMENTS
      </Sup>
      <Text
        fontSize="$2"
        $gtMd={{ fontSize: '$8', maw: '55%' }}
        fontWeight={'normal'}
        maw="70%"
        color="$green5Light"
      >
        INFRASTRUCTURE FOR MERCHANTS AND STABLECOIN TRANSACTIONS
      </Text>
    </>,
  ],
  [
    <QRCodePayments key="qrcode" style={{ borderRadius: 33 }} />,
    <>
      <Text
        fontSize="$8"
        $gtMd={{ fontSize: '$13' }}
        fontWeight={'bold'}
        lineHeight="$5"
        color="$white"
      >
        QRCODE
      </Text>
      <Sup super="TM" fontSize="$8" $gtMd={{ fontSize: '$13' }} color="$white" fontWeight={'bold'}>
        PAYMENTS
      </Sup>
      <Text
        fontSize="$2"
        $gtMd={{ fontSize: '$8', maw: '55%' }}
        fontWeight={'normal'}
        maw="70%"
        color="$green5Light"
      >
        INFRASTRUCTURE FOR MERCHANTS AND STABLECOIN TRANSACTIONS
      </Text>
    </>,
  ],
  [
    <RealTimePayments key="realtime" style={{ borderRadius: 33 }} />,
    <>
      <Text
        fontWeight="bold"
        fontSize="$8"
        $gtMd={{ fontSize: '$13' }}
        lineHeight="$5"
        color="$white"
      >
        REAL TIME
      </Text>
      <Sup super="TM" fontSize="$8" $gtMd={{ fontSize: '$13' }} color="$white" fontWeight={'bold'}>
        PAYMENTS
      </Sup>
      <Text
        fontSize="$2"
        $gtMd={{ fontSize: '$8', maw: '55%' }}
        fontWeight={'normal'}
        maw="70%"
        color="$green5Light"
      >
        INFRASTRUCTURE FOR MERCHANTS AND STABLECOIN TRANSACTIONS
      </Text>
    </>,
  ],
]

const SignInCarousel = () => {
  const [activeIndex, setActiveIndex] = useState(0)
  const media = useMedia()

  const incrementIndex = () => {
    setActiveIndex((i) => (i + 1) % carouselComponents.length)
  }

  const decrementIndex = () => {
    setActiveIndex((i) => (i - 1 + carouselComponents.length) % carouselComponents.length)
  }

  useEffect(() => {
    if (media.gtMd) {
      const interval = setInterval(() => {
        setActiveIndex((i) => (i + 1) % carouselComponents.length)
      }, 7500)
      return () => clearInterval(interval)
    }
  }, [media])

  return (
    <>
      <Stack pos="relative" h="100%" f={1} ai="center" jc="center">
        <View pos="absolute" top={0} left={0} mt="auto" mb="auto" zIndex={-1} w="100%" h="100%">
          <Stack mt="auto" mb="auto" w="100%" h="100%">
            <CornerTriangle corner="topLeft" pos="absolute" top={0} left={0} btw={273} brw={90} />
            <YStack pos="absolute" bottom={'5%'} left={'5%'}>
              {carouselComponents.at(activeIndex)?.at(1)}
            </YStack>
            <CornerTriangle
              corner="bottomRight"
              pos="absolute"
              bottom={0}
              right={0}
              btw={273}
              brw={90}
            />
            <View position="absolute" bottom={'$0'} right={'$0'} dsp="none" $gtMd={{ dsp: 'none' }}>
              <IconSLogo size={'$4'} />
            </View>
            {carouselComponents.at(activeIndex)?.at(0)}
          </Stack>
        </View>
      </Stack>
      <XStack f={1} w="100%" jc="center" $gtMd={{ dsp: 'none' }} py="$5" gap="$2">
        {activeIndex < carouselComponents.length - 1 ? (
          <Button f={1} onPress={incrementIndex}>
            <ButtonText fontWeight={'bold'}>Continue</ButtonText>
          </Button>
        ) : (
          <>
            <Button f={1} onPress={() => {}}>
              <ButtonText fontWeight={'bold'} col="$backgroundStrong">
                Login
              </ButtonText>
            </Button>
            <Button
              f={1}
              bc="background05"
              borderColor="$backgroundStrong"
              bw={'$1'}
              onPress={() => {}}
            >
              <ButtonText fontWeight={'bold'} col="$backgroundStrong">
                Sign up
              </ButtonText>
            </Button>
          </>
        )}
      </XStack>
    </>
  )
}
