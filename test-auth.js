const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function test() {
  try {
    console.log('Testing database connection...');
    await prisma.$connect();
    console.log('✓ Database connected');

    console.log('\nTesting bcrypt...');
    const hash = await bcrypt.hash('test123', 10);
    console.log('✓ Bcrypt hash created:', hash.substring(0, 20) + '...');

    console.log('\nTesting user query...');
    const users = await prisma.user.findMany({ take: 1 });
    console.log('✓ User query successful, found', users.length, 'users');

    console.log('\n✓ All tests passed!');
  } catch (error) {
    console.error('✗ Test failed:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

test();
