// You can use @snaplet/copycat to generate fake data for a field, for example:
// ```
// await seed.users([{ email: ({ seed }) => copycat.email(seed) }])
// ```
// More on this in our docs: https://docs.snaplet.dev/core-concepts/seed#inside-the-snapletseed-workflow
import { copycat, faker } from '@snaplet/copycat'
import { createSeedClient } from '@snaplet/seed'
import { models } from '../src'
import * as pg from 'pg'
import { pravatar } from '../src/utils'
import { leaderboardReferralsAllTimes, userOnboarded } from '../src/models'

// @ts-expect-error typescript is confused
const { Client: PgClient } = pg.default as unknown as typeof pg

const dryRun = process.env.DRY !== '0'

const pgClient = new PgClient({
  connectionString: process.env.SUPABASE_DB_URL,
  application_name: 'snaplet',
})

// This is a basic example generated by Snaplet to start you off, check out the docs for where to go from here
// * For more on getting started with @snaplet/seed: https://docs.snaplet.dev/getting-started/quick-start/seed
// * For a more detailed reference: https://docs.snaplet.dev/core-concepts/seed
;(async () => {
  await pgClient.connect()
  await pgClient.query('SET session_replication_role = replica;') // do not run any triggers

  const seed = await createSeedClient({
    dryRun,
    models,
    client: pgClient,
  })

  console.log('Snaplet resetting database.', `dryRun=${dryRun}`)

  // Clears all existing data in the database, but keep the structure
  await seed.$resetDatabase()

  console.log('Snaplet seeding database.')

  await seed.users([
    {
      phone: '17777777777',
      profiles: [
        {
          name: 'Alice',
          avatarUrl: pravatar('Alice'),
        },
      ],
      tags: [
        {
          name: 'alice',
          status: 'confirmed',
        },
        {
          name: '0xalice',
          status: 'confirmed',
        },
      ],
      sendAccounts: [{}],
      chainAddresses: [{}],
      leaderboardReferralsAllTimes: [leaderboardReferralsAllTimes],
    },
    {
      phone: '1234567890',
      profiles: [
        {
          name: 'Jane',
          avatarUrl: pravatar('Jane'),
        },
      ],
      tags: [
        {
          name: 'jane',
          status: 'confirmed',
        },
        {
          name: '0xjane',
          status: 'confirmed',
        },
      ],
      sendAccounts: [{}],
      chainAddresses: [{}],
      leaderboardReferralsAllTimes: [leaderboardReferralsAllTimes],
    },
    {
      phone: '15555555555',
      profiles: [
        {
          name: 'John',
          avatarUrl: pravatar('John'),
        },
      ],
      tags: [
        {
          name: 'john',
          status: 'confirmed',
        },
        {
          name: '0xjohn',
          status: 'confirmed',
        },
      ],
      sendAccounts: [{}],
      chainAddresses: [{}],
      leaderboardReferralsAllTimes: [leaderboardReferralsAllTimes],
    },
    ...Array(100).fill({
      ...userOnboarded,
      leaderboardReferralsAllTimes: [leaderboardReferralsAllTimes],
    }),
  ])
  await pgClient.end()
  console.log('Snaplet seed done!')
})().catch((err) => {
  console.error('Snaplet seed failed:', err)
  process.exit(1)
})
