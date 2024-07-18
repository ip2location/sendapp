import type { PropsWithChildren } from 'react'
import {
  AnimatePresence,
  Avatar,
  Container,
  H4,
  Paragraph,
  ScrollView,
  Separator,
  Spinner,
  Text,
  XStack,
  YStack,
} from '@my/ui'
import { TagSearchProvider, useTagSearch } from 'app/provider/tag-search'
import Search from '../../components/SearchBar'
import { RecentActivity } from './RecentActivity'

const suggestions = [
  { username: '0xUser', avatar: 'https://i.pravatar.cc/150?u=0xUser' },
  { username: '0xUser1', avatar: 'https://i.pravatar.cc/150?u=0xUser1' },
  { username: '0xUser2', avatar: 'https://i.pravatar.cc/150?u=0xUser2' },
  { username: '0xUser3', avatar: 'https://i.pravatar.cc/150?u=0xUser3' },
  { username: '0xUser4', avatar: 'https://i.pravatar.cc/150?u=0xUser4' },
  { username: '0xUser5', avatar: 'https://i.pravatar.cc/150?u=0xUser5' },
  // ... more suggestions
]

export function ActivityScreen() {
  return (
    <TagSearchProvider>
      <YStack f={1} width={'100%'} py="$6">
        <YStack width={'100%'} gap="$size.1.5" $gtSm={{ gap: '$size.2.5' }}>
          <Search label="SEARCH BY" />
        </YStack>
        <ActivityBody />
      </YStack>
    </TagSearchProvider>
  )
}

function ActivityBody() {
  const { isLoading, results, error } = useTagSearch()

  return (
    <AnimatePresence>
      {error && (
        <YStack key="red" gap="$4" mb="$4">
          <H4 theme={'alt2'}>Error</H4>
          <Text>{error.message.split('.').at(0)}</Text>
        </YStack>
      )}

      <Search.Results />

      {results === null && !isLoading && !error && (
        <YStack
          key="suggestions"
          animation="quick"
          gap="$size.1.5"
          mb="$4"
          mt="$6"
          $gtSm={{ gap: '$size.2.5' }}
          exitStyle={{
            opacity: 0,
            y: 10,
          }}
        >
          {/*
            <Separator $gtMd={{ display: 'none' }} />
            <Suggestions />
          */}

          <Separator $gtMd={{ display: 'none' }} />
          <RecentActivity />
        </YStack>
      )}
    </AnimatePresence>
  )
}

// TODO: Replace with dynamic list

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function Suggestions() {
  return (
    <YStack gap="$size.1" display="flex" $gtMd={{ display: 'none' }}>
      <Container>
        <MobileSectionLabel>SUGGESTIONS</MobileSectionLabel>
      </Container>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          maxWidth: 768,
          marginHorizontal: 'auto',
          paddingLeft: '$6',
        }}
      >
        {suggestions.map((user) => (
          <XStack
            key={user.username}
            ai="center"
            mr="$4"
            borderColor="$decay"
            borderWidth={1}
            pr="$3.5"
            gap="$3.5"
            borderRadius={'$11'}
            ml="$1.5"
          >
            <Avatar size="$4.5" br="$4" gap="$2" circular ml="$-1.5">
              <Avatar.Image src={user.avatar} />
              <Avatar.Fallback jc="center">
                <Spinner size="small" color="$send1" />
              </Avatar.Fallback>
            </Avatar>
            <Paragraph color="$color12" fontFamily="$mono" fontSize="$2">
              /{user.username}
            </Paragraph>
          </XStack>
        ))}
      </ScrollView>
    </YStack>
  )
}

export function TableLabel({
  textAlign = 'left',
  children,
}: { textAlign?: 'left' | 'right' } & PropsWithChildren) {
  return (
    <H4
      color={'$olive'}
      theme={'alt2'}
      fontWeight={'300'}
      size={'$8'}
      minWidth={'$14'}
      textAlign={textAlign}
    >
      {children}
    </H4>
  )
}

export function RowLabel({ children }: PropsWithChildren) {
  return (
    <H4
      // @TODO: Update with theme color variable
      color="hsl(0, 0%, 42.5%)"
      fontFamily={'$mono'}
      fontWeight={'500'}
      size={'$5'}
      mt="$3"
      display="none"
      $gtMd={{ display: 'inline' }}
    >
      {children}
    </H4>
  )
}

export function MobileSectionLabel({ children }: PropsWithChildren) {
  return (
    <H4
      color="$olive"
      fontFamily={'$mono'}
      fontWeight={'500'}
      size={'$5'}
      $gtMd={{ display: 'none' }}
    >
      {children}
    </H4>
  )
}
