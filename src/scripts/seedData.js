import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Student from '../models/Student.js';
import Instructor from '../models/Instructor.js';
import ClassType from '../models/ClassType.js';
import Registration from '../models/Registration.js';
import Config from '../models/Config.js'; // Added Config import

dotenv.config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB for seeding');

    // Clear existing data
    await Student.deleteMany({});
    await Instructor.deleteMany({});
    await ClassType.deleteMany({});
    await Registration.deleteMany({});
    await Config.deleteMany({}); // Added Config delete

    // Seed Students
    const students = [
      {
        studentId: '1001',
        name: 'Alex Johnson',
        email: 'alex.johnson@example.com',
      },
      {
        studentId: '1002',
        name: 'Sarah Williams',
        email: 'sarah.williams@example.com',
      },
      { studentId: '1003', name: 'Mike Chen', email: 'mike.chen@example.com' },
      {
        studentId: '1004',
        name: 'Emily Davis',
        email: 'emily.davis@example.com',
      },
      {
        studentId: '1005',
        name: 'James Wilson',
        email: 'james.wilson@example.com',
      },
    ];
    await Student.insertMany(students);
    console.log('✅ Students seeded:', students.length);

    // Seed Instructors
    const instructors = [
      {
        instructorId: '2001',
        name: 'Mr. Robert Anderson',
        email: 'robert.anderson@drivingschool.com',
        specialization: 'Beginner Training',
      },
      {
        instructorId: '2002',
        name: 'Ms. Maria Garcia',
        email: 'maria.garcia@drivingschool.com',
        specialization: 'Highway & Defensive Driving',
      },
      {
        instructorId: '2003',
        name: 'Mr. David Chen',
        email: 'david.chen@drivingschool.com',
        specialization: 'Parking & Maneuvering',
      },
      {
        instructorId: '2004',
        name: 'Mrs. Lisa Thompson',
        email: 'lisa.thompson@drivingschool.com',
        specialization: 'Night & Adverse Conditions',
      },
    ];
    await Instructor.insertMany(instructors);
    console.log('✅ Instructors seeded:', instructors.length);

    // Seed Class Types
    const classTypes = [
      {
        classId: 'DRV101',
        name: 'Beginner Driving Theory',
        description: 'Basic traffic rules, signs, and road safety fundamentals',
        duration: 60,
        maxCapacity: 20,
      },
      {
        classId: 'DRV102',
        name: 'Highway Driving',
        description: 'Highway safety, lane changing, and high-speed techniques',
        duration: 90,
        maxCapacity: 12,
      },
      {
        classId: 'DRV103',
        name: 'Parallel Parking',
        description: 'Master parallel parking and tight space maneuvering',
        duration: 45,
        maxCapacity: 8,
      },
      {
        classId: 'DRV104',
        name: 'Night Driving',
        description:
          'Driving in low-light conditions and using headlights properly',
        duration: 60,
        maxCapacity: 10,
      },
      {
        classId: 'DRV105',
        name: 'Defensive Driving',
        description: 'Advanced safety techniques and hazard anticipation',
        duration: 75,
        maxCapacity: 15,
      },
      {
        classId: 'DRV106',
        name: 'Emergency Maneuvers',
        description: 'Handling emergency situations and quick decision making',
        duration: 60,
        maxCapacity: 10,
      },
    ];
    await ClassType.insertMany(classTypes);
    console.log('✅ Class Types seeded:', classTypes.length);

    // Seed Configurations
    const defaultConfigs = [
      {
        key: 'UI_THEME',
        value: 'light',
        description: 'Interface color theme',
        dataType: 'string',
      },
      {
        key: 'UI_LANGUAGE',
        value: 'en',
        description: 'Interface language',
        dataType: 'string',
      },
      {
        key: 'NOTIFICATION_ENABLED',
        value: true,
        description: 'Enable email notifications',
        dataType: 'boolean',
      },
    ];
    await Config.insertMany(defaultConfigs);
    console.log('✅ Configurations seeded:', defaultConfigs.length);

    // Seed Registrations
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dayAfterTomorrow = new Date(today);
    dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 2);

    await Registration.create({
      registrationId: 'REG555001',
      studentId: '1001',
      instructorId: '2001',
      classType: 'DRV101',
      startTime: new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate(),
        9,
        0
      ),
      status: 'scheduled',
      action: 'new',
    });

    await Registration.create({
      registrationId: 'REG333001',
      studentId: '1002',
      instructorId: '2002',
      classType: 'DRV102',
      startTime: new Date(
        tomorrow.getFullYear(),
        tomorrow.getMonth(),
        tomorrow.getDate(),
        14,
        0
      ),
      status: 'scheduled',
      action: 'new',
    });

    await Registration.create({
      registrationId: 'REG777001',
      studentId: '1003',
      instructorId: '2003',
      classType: 'DRV103',
      startTime: new Date(
        dayAfterTomorrow.getFullYear(),
        dayAfterTomorrow.getMonth(),
        dayAfterTomorrow.getDate(),
        11,
        0
      ),
      status: 'scheduled',
      action: 'new',
    });

    const oneWeekAgo = new Date(today);
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    await Registration.create({
      registrationId: 'REG888001',
      studentId: '1004',
      instructorId: '2004',
      classType: 'DRV104',
      startTime: new Date(
        oneWeekAgo.getFullYear(),
        oneWeekAgo.getMonth(),
        oneWeekAgo.getDate(),
        16,
        0
      ),
      status: 'scheduled',
      action: 'new',
    });

    await Registration.create({
      registrationId: 'REG999001',
      studentId: '1005',
      instructorId: '2001',
      classType: 'DRV105',
      startTime: new Date(
        oneWeekAgo.getFullYear(),
        oneWeekAgo.getMonth(),
        oneWeekAgo.getDate(),
        10,
        0
      ),
      status: 'scheduled',
      action: 'new',
    });

    console.log('✅ Test registrations created');

    // Add 100 randomized registrations over the last 90 days
    // Add 25 registrations for last 7 days
    for (let i = 0; i < 25; i++) {
      const daysAgo = Math.floor(Math.random() * 7); // 0-6 days ago
      const randomHour = Math.floor(Math.random() * 12) + 8;
      await Registration.create({
        registrationId: `REG_7DAYS_${i}`,
        studentId: `100${(i % 5) + 1}`,
        instructorId: `200${(i % 4) + 1}`,
        classType: `DRV10${(i % 6) + 1}`,
        startTime: new Date(
          today.getFullYear(),
          today.getMonth(),
          today.getDate() - daysAgo,
          randomHour,
          0
        ),
        status: 'scheduled',
        action: 'new',
      });
    }

    // Add 150 registrations for past 30 days (excluding last 7)
    for (let i = 0; i < 150; i++) {
      const daysAgo = Math.floor(Math.random() * 23) + 7; // 7-29 days ago
      const randomHour = Math.floor(Math.random() * 12) + 8;
      await Registration.create({
        registrationId: `REG_30DAYS_${i}`,
        studentId: `100${((i + 2) % 5) + 1}`,
        instructorId: `200${((i + 1) % 4) + 1}`,
        classType: `DRV10${((i + 3) % 6) + 1}`,
        startTime: new Date(
          today.getFullYear(),
          today.getMonth(),
          today.getDate() - daysAgo,
          randomHour,
          0
        ),
        status: 'scheduled',
        action: 'new',
      });
    }

    // Add 300 registrations for past 90 days (excluding last 30)
    for (let i = 0; i < 300; i++) {
      const daysAgo = Math.floor(Math.random() * 60) + 30; // 30-89 days ago
      const randomHour = Math.floor(Math.random() * 12) + 8;
      await Registration.create({
        registrationId: `REG_90DAYS_${i}`,
        studentId: `100${((i + 3) % 5) + 1}`,
        instructorId: `200${((i + 2) % 4) + 1}`,
        classType: `DRV10${((i + 4) % 6) + 1}`,
        startTime: new Date(
          today.getFullYear(),
          today.getMonth(),
          today.getDate() - daysAgo,
          randomHour,
          0
        ),
        status: 'scheduled',
        action: 'new',
      });
    }

    // Add 300 registrations for last 7 days
    for (let i = 0; i < 300; i++) {
      const daysAgo = Math.floor(Math.random() * 7); // 0-6 days ago
      const randomHour = Math.floor(Math.random() * 12) + 8;
      await Registration.create({
        registrationId: `REG_7DAYS_${i}`,
        studentId: `100${(i % 5) + 1}`,
        instructorId: `200${(i % 4) + 1}`,
        classType: `DRV10${(i % 6) + 1}`,
        startTime: new Date(
          today.getFullYear(),
          today.getMonth(),
          today.getDate() - daysAgo,
          randomHour,
          0
        ),
        status: 'scheduled',
        action: 'new',
      });
    }

    // Add 300 registrations for past 30 days (excluding last 7)
    for (let i = 0; i < 300; i++) {
      const daysAgo = Math.floor(Math.random() * 23) + 7; // 7-29 days ago
      const randomHour = Math.floor(Math.random() * 12) + 8;
      await Registration.create({
        registrationId: `REG_30DAYS_${i}`,
        studentId: `100${((i + 2) % 5) + 1}`,
        instructorId: `200${((i + 1) % 4) + 1}`,
        classType: `DRV10${((i + 3) % 6) + 1}`,
        startTime: new Date(
          today.getFullYear(),
          today.getMonth(),
          today.getDate() - daysAgo,
          randomHour,
          0
        ),
        status: 'scheduled',
        action: 'new',
      });
    }

    // Add 300 registrations for past 90 days (excluding last 30)
    for (let i = 0; i < 300; i++) {
      const daysAgo = Math.floor(Math.random() * 60) + 30; // 30-89 days ago
      const randomHour = Math.floor(Math.random() * 12) + 8;
      await Registration.create({
        registrationId: `REG_90DAYS_${i}`,
        studentId: `100${((i + 3) % 5) + 1}`,
        instructorId: `200${((i + 2) % 4) + 1}`,
        classType: `DRV10${((i + 4) % 6) + 1}`,
        startTime: new Date(
          today.getFullYear(),
          today.getMonth(),
          today.getDate() - daysAgo,
          randomHour,
          0
        ),
        status: 'scheduled',
        action: 'new',
      });
    }

    console.log('🎉 Database seeding completed successfully!');
    console.log('🚗 DRIVING SCHOOL DATA CREATED:');
    console.log('   - Students: 1001, 1002, 1003, 1004, 1005');
    console.log('   - Instructors: 2001, 2002, 2003, 2004');
    console.log(
      '   - Class Types: DRV101, DRV102, DRV103, DRV104, DRV105, DRV106'
    );
    console.log(
      '   - Registrations: 5 total (today, tomorrow, day after, and past dates)'
    );
    console.log(
      '   - Configurations: 3 settings (UI theme, language, notifications)'
    );
    console.log('');
    console.log('📊 Stats API will now show data for:');
    console.log('   - Today, Tomorrow, Day after tomorrow, and 1 week ago');
    console.log('');
    console.log('📝 Sample CSV for testing:');
    console.log(
      'Registration ID,Student ID,Instructor ID,Class ID,Class Start Time,Action'
    );
    console.log(
      'null,1004,2001,DRV101,' + formatDateForCSV(tomorrow) + ' 10:00,new'
    );
    console.log(
      'REG555001,1001,2002,DRV102,' +
        formatDateForCSV(dayAfterTomorrow) +
        ' 13:00,update'
    );
    console.log('REG333001,null,null,null,null,delete');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding error:', error);
    process.exit(1);
  }
};

function formatDateForCSV(date) {
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const year = date.getFullYear();
  return `${month}/${day}/${year}`;
}

seedData();
