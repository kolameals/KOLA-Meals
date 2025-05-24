import { Role } from '@prisma/client';
import { AppError } from '../types/error.types';
import prisma from '../lib/prisma';
import bcrypt from 'bcryptjs';

interface CreateUserData {
  email?: string;
  phoneNumber?: string;
  password?: string;
  name: string;
  role?: Role;
}

interface UpdateUserData {
  email?: string;
  phoneNumber?: string;
  password?: string;
  name?: string;
  role?: Role;
}

export const createUser = async (data: CreateUserData) => {
  const { email, phoneNumber, password, name, role } = data;

  const userData: any = {
    name,
    role: role || Role.CUSTOMER
  };

  if (email) userData.email = email;
  if (phoneNumber) userData.phoneNumber = phoneNumber;
  if (password) {
    userData.password = await bcrypt.hash(password, 10);
  }

  return prisma.user.create({
    data: userData,
    select: {
      id: true,
      email: true,
      phoneNumber: true,
      name: true,
      role: true,
      createdAt: true,
      updatedAt: true
    }
  });
};

export const getUser = async (userId: string) => {
  return prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      phoneNumber: true,
      name: true,
      role: true,
      createdAt: true,
      updatedAt: true,
      addresses: true,
      subscription: true
    }
  });
};

export const updateUser = async (userId: string, data: UpdateUserData) => {
  const { email, phoneNumber, password, name, role } = data;

  const userData: any = {};
  if (email) userData.email = email;
  if (phoneNumber) userData.phoneNumber = phoneNumber;
  if (name) userData.name = name;
  if (role) userData.role = role;
  if (password) {
    userData.password = await bcrypt.hash(password, 10);
  }

  return prisma.user.update({
    where: { id: userId },
    data: userData,
    select: {
      id: true,
      email: true,
      phoneNumber: true,
      name: true,
      role: true,
      createdAt: true,
      updatedAt: true
    }
  });
};

export const deleteUser = async (userId: string) => {
  return prisma.user.delete({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      phoneNumber: true,
      name: true,
      role: true
    }
  });
};

export const getAllUsers = async (page = 1, limit = 10) => {
  const skip = (page - 1) * limit;

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      skip,
      take: limit,
      select: {
        id: true,
        email: true,
        phoneNumber: true,
        name: true,
        role: true,
        createdAt: true,
        updatedAt: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    }),
    prisma.user.count()
  ]);

  return {
    users,
    total,
    page,
    totalPages: Math.ceil(total / limit)
  };
};

export const getUserByEmail = async (email: string) => {
  return prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      email: true,
      phoneNumber: true,
      name: true,
      role: true,
      password: true
    }
  });
};

export const getUserByPhone = async (phoneNumber: string) => {
  return prisma.user.findUnique({
    where: { phoneNumber },
    select: {
      id: true,
      email: true,
      phoneNumber: true,
      name: true,
      role: true,
      password: true
    }
  });
}; 