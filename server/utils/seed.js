const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '..', '.env') });

const User = require('../models/User');
const Subject = require('../models/Subject');

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB...');

    // Clear existing data
    await User.deleteMany({});
    await Subject.deleteMany({});

    // Hash passwords manually (pre-save hook doesn't run on insertMany)
    const password1 = await bcrypt.hash('password123', 10);
    const password2 = await bcrypt.hash('password123', 10);

    const users = await User.collection.insertMany([
      { email: 'user1@example.com', password: password1, name: 'Student 1', createdAt: new Date(), updatedAt: new Date() },
      { email: 'user2@example.com', password: password2, name: 'Student 2', createdAt: new Date(), updatedAt: new Date() },
    ]);

    console.log('✅ Users seeded');

    // CA Inter Group 1 Subjects (Old Scheme - 4 papers)
    await Subject.insertMany([
      {
        name: 'Accounting',
        description: 'Financial accounting, AS, IFRS, company accounts, partnership, and financial statements.',
      },
      {
        name: 'Corporate & Other Laws',
        description: 'Company Law, LLP Act, Insolvency & Bankruptcy Code, and other business legislation.',
      },
      {
        name: 'Cost & Management Accounting',
        description: 'Cost accounting, budgeting, standard costing, marginal costing, and management decisions.',
      },
      {
        name: 'Taxation',
        description: 'Income Tax Law (Part A - 60%) and Indirect Taxes - GST & Customs (Part B - 40%).',
      },
    ]);

    console.log('✅ CA Group 1 Subjects seeded');
    console.log('\n==============================');
    console.log('   Database seeded successfully!');
    console.log('==============================');
    console.log('Login credentials:');
    console.log('  Student 1: user1@example.com  | password123');
    console.log('  Student 2: user2@example.com  | password123');
    console.log('==============================\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding error:', error);
    process.exit(1);
  }
};

seedDB();
