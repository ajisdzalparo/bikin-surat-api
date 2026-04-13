require('dotenv/config');
const bcrypt = require('bcrypt');
const { PrismaPg } = require('@prisma/adapter-pg');
const { PrismaClient, UserRole } = require('../src/generated/prisma');

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
	throw new Error('DATABASE_URL is not defined');
}

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
	const adminEmail = process.env.SEED_ADMIN_EMAIL || 'admin@bikinsurat.local';
	const adminPassword = process.env.SEED_ADMIN_PASSWORD || 'admin12345';
	const hashed = await bcrypt.hash(adminPassword, 10);

	await prisma.user.upsert({
		where: { email: adminEmail },
		update: {
			full_name: 'System Admin',
			role: UserRole.ADMIN,
			password: hashed,
			is_suspended: false,
		},
		create: {
			full_name: 'System Admin',
			email: adminEmail,
			password: hashed,
			role: UserRole.ADMIN,
		},
	});
}

main()
	.then(async () => {
		await prisma.$disconnect();
	})
	.catch(async (error) => {
		console.error(error);
		await prisma.$disconnect();
		process.exit(1);
	});
