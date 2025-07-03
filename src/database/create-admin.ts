import * as bcrypt from 'bcryptjs';
import { DataSource } from 'typeorm';
import { User } from '../auth/entities';
import { UserRole } from '../shared/enums';
import { AppDataSource } from './data-source';

async function createAdminUser() {
  let dataSource: DataSource | undefined;

  try {
    dataSource = await AppDataSource.initialize();
    console.log('Database connected successfully');

    const userRepository = dataSource.getRepository(User);

    // Check if admin user already exists
    const existingAdmin = await userRepository.findOne({
      where: { email: 'admin@gestcard.com' },
    });

    if (existingAdmin) {
      console.log('Admin user already exists');
      return;
    }

    // Create admin user
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash('Admin123!', saltRounds);

    const adminUser = userRepository.create({
      email: 'admin@gestcard.com',
      password: hashedPassword,
      firstName: 'Admin',
      lastName: 'User',
      role: UserRole.ADMIN,
      isActive: true,
    });

    await userRepository.save(adminUser);
    console.log('Admin user created successfully');
    console.log('Email: admin@gestcard.com');
    console.log('Password: Admin123!');
  } catch (error) {
    console.error('Error creating admin user:', error);
  } finally {
    if (dataSource) {
      await dataSource.destroy();
    }
  }
}

void createAdminUser();
