const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@cesuoyunwei';
  const adminName = process.env.ADMIN_NAME || '管理员';

  const existing = await prisma.user.findUnique({ where: { email: adminEmail } });
  if (existing) {
    console.log('Admin user already exists:', adminEmail);
    return;
  }

  const user = await prisma.user.create({
    data: {
      email: adminEmail,
      name: adminName,
      role: 'admin'
    }
  });
  console.log('Created admin user:', user.email);
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
