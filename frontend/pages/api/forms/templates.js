import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const templates = await prisma.formTemplate.findMany();
    return res.status(200).json(templates);
  }
  return res.status(405).json({ error: 'Method not allowed' });
}
