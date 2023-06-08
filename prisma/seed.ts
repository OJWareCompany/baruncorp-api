import { PrismaClient, Prisma } from '@prisma/client'

const prisma = new PrismaClient()

const userData: Prisma.UsersCreateInput[] = [
  {
    firstName: 'Wilson',
    lastName: 'Emma',
    email: 'emma@barun.com',
    password: '$2b$10$RVet/L9xDhUHOfOWo3yeEO6WF7WbL7aJdFcJjcvaQ7Dt5hb3V5p/.',
  },
  {
    firstName: 'Anderson',
    lastName: 'James',
    email: 'james@barun.com',
    password: '$2b$10$RVet/L9xDhUHOfOWo3yeEO6WF7WbL7aJdFcJjcvaQ7Dt5hb3V5p/.',
  },
  {
    firstName: 'Roberts',
    lastName: 'Emily',
    email: 'emily@barun.com',
    password: '$2b$10$RVet/L9xDhUHOfOWo3yeEO6WF7WbL7aJdFcJjcvaQ7Dt5hb3V5p/.',
  },
]

async function main() {
  console.log(`Start seeding ...`)
  for (const u of userData) {
    const user = await prisma.users.create({
      data: u,
    })
    console.log(`Created user with id: ${user.id}`)
  }
  console.log(`Seeding finished.`)
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
