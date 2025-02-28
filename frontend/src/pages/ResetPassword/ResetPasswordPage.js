import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import classes from './resetPasswordPage.module.css';
import Input from '../../components/Input/Input';
import Button from '../../components/Button/Button';

export default function ResetPasswordPage() {
  const { token } = useParams(); // Ambil token dari URL
  const navigate = useNavigate();
  const { handleSubmit, register, formState: { errors } } = useForm();
  const [message, setMessage] = useState('');

  const submit = async ({ newPassword }) => {
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/api/users/resetPassword/${token}`, {
        newPassword,
      });

      setMessage('Password has been reset successfully! Redirecting to login...');
      setTimeout(() => navigate('/login'), 3000);
    } catch (error) {
      setMessage('Failed to reset password. Try again!');
    }
  };

  return (
    <div className={classes.container}>
      <div className={classes.details}>
        <h2>Reset Password</h2>
        <form onSubmit={handleSubmit(submit)} noValidate>
          <Input
            type="password"
            label="New Password"
            {...register('newPassword', { required: 'Password is required' })}
            error={errors.newPassword}
          />
          <Button type="submit" text="Reset Password" />
          {message && <p className={classes.message}>{message}</p>}
        </form>
      </div>
    </div>
  );
}
