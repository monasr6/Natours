const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

const Tour = require('../../models/Tour');

dotenv.config({ path: '../../config.env' });

const connectToDB = async () => {
  try {
    await mongoose.connect(process.env.DATABASE, {
      // await mongoose.connect(process.env.DATABASE_LOCAL, {
      useNewUrlParser: true,
    });
    console.log('DB connection successful!');
  } catch (error) {
    console.log(error);
  }
};

// READ JSON FILE
const getTours = async () => {
  try {
    return JSON.parse(
      fs.readFileSync(`${__dirname}/tours-simple.json`, 'utf-8'),
    );
  } catch (error) {
    console.log(error);
  }
};

// IMPORT DATA INTO DB
const importData = async () => {
  try {
    const [, tours] = await Promise.all([connectToDB(), getTours()]);
    await Tour.create(tours);
    console.log('Data successfully loaded!');
  } catch (error) {
    console.log(error);
  }
  process.exit();
};

// DELETE ALL DATA FROM DB
const deleteData = async () => {
  try {
    await connectToDB();
    await Tour.deleteMany();
    console.log('Data successfully deleted!');
  } catch (error) {
    console.log(error);
  }
  process.exit();
};

if (process.argv[2] === '--import') {
  importData();
}
if (process.argv[2] === '--delete') {
  deleteData();
}
