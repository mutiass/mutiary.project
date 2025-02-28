import React, { useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { getById, register as registerUser, updateUser } from '../../services/userService'; // Ganti nama register
import { useParams } from 'react-router-dom';
import classes from './userEdit.module.css';
import Title from '../../components/Title/Title';
import Input from '../../components/Input/Input';
import { EMAIL } from '../../constants/patterns';
import Button from '../../components/Button/Button';

export default function UserEditPage() {
  const {
    register, // register dari useForm
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const { userId } = useParams();
  const isEditMode = !!userId; // Pastikan boolean

  const loadUser = useCallback(async () => {
    try {
      const user = await getById(userId);
      if (user) reset(user);
    } catch (error) {
      console.error("Error loading user:", error);
    }
  }, [userId, reset]);

  useEffect(() => {
    if (isEditMode) {
      loadUser();
    }
  }, [isEditMode, loadUser]);

  const submit = async (userData) => {
    try {
      if (isEditMode) {
        await updateUser(userId, userData);
      } else {
        await registerUser(userData); // Gunakan registerUser agar tidak bentrok
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <div className={classes.container}>
      <div className={classes.content}>
        <Title title={isEditMode ? 'Edit User' : 'Add User'} />
        <form onSubmit={handleSubmit(submit)} noValidate>
          <Input
            label="Name"
            {...register('name', { required: "Name is required", minLength: { value: 3, message: "Name must be at least 3 characters" } })}
            error={errors.name}
          />
          <Input
            label="Email"
            {...register('email', { required: "Email is required", pattern: { value: EMAIL, message: "Invalid email format" } })}
            error={errors.email}
          />
          <Input
            label="Address"
            {...register('address', { required: "Address is required", minLength: { value: 5, message: "Address must be at least 5 characters" } })}
            error={errors.address}
          />
          <Input label="Is Admin" type="checkbox" {...register('isAdmin')} />
          <Button type="submit">{isEditMode ? 'Update' : 'Register'}</Button>
        </form>
      </div>
    </div>
  );
}
