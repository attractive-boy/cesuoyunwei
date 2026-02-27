if (process.env.JEST_WORKER_ID || process.env.NODE_ENV === 'test') {
	// During tests, export a plain object that tests can stub.
	module.exports = {};
} else {
	const { PrismaClient } = require('@prisma/client');
	const prisma = global.prisma || new PrismaClient();
	if (process.env.NODE_ENV !== 'production') global.prisma = prisma;
	module.exports = prisma;
}
