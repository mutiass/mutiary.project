import { connect, set } from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import { UserModel } from '../models/user.model.js';
import { FoodModel } from '../models/food.model.js';
import { sample_users, sample_foods } from '../data.js';

dotenv.config();
set('strictQuery', true);
const PASSWORD_HASH_SALT_ROUNDS = 10;

export const dbconnect = async () => {
  try {
    await connect(process.env.MONGO_URI, {
      dbName: 'mutiary',
    });
    console.log('Connected to MongoDB successfully');
    await seedUsers();
    await seedFoods();
  } catch (error) {
    console.error('Database connection error:', error.message);
  }
};

async function seedUsers() {
  const usersCount = await UserModel.countDocuments();
  if (usersCount > 0) {
    console.log('Users seed is already done!');
    return;
  }

  for (let user of sample_users) {
    user.password = await bcrypt.hash(user.password, PASSWORD_HASH_SALT_ROUNDS);
    await UserModel.create(user);
  }

  console.log('Users seed is done!');
}

async function seedFoods() {
  const foodsCount = await FoodModel.countDocuments();
  if (foodsCount > 0) {
    console.log('Foods seed is already done!');
    return;
  }

  for (const food of sample_foods) {
    food.imageUrl = `/foods/${food.imageUrl}`;
    await FoodModel.create(food);
  }

  console.log('Foods seed is done!');
}
