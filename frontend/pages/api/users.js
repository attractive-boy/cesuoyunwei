import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const users = await prisma.user.findMany();
    return res.status(200).json(users);
  }
  return res.status(405).json({ error: 'Method not allowed' });
}
