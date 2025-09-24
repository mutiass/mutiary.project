import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import classes from './forgotPasswordPage.module.css';
import Title from '../../components/Title/Title';
import Input from '../../components/Input/Input';
import Button from '../../components/Button/Button';
import { EMAIL } from '../../constants/patterns';

export default function ForgotPasswordPage() {
  const { handleSubmit, register, formState: { errors } } = useForm();
  const [message, setMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const submit = async ({ email }) => {
    setMessage('');
    setErrorMessage('');

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/users/forgotPassword`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to send reset link');
      }

      setMessage(
  'A password reset link has been sent to your email. ' +
  'Please wait up to 10 minutes. If you don’t see it in your inbox, ' +
  'please check your Spam or Junk folder.'
);

    } catch (error) {
      console.error('Error sending reset email:', error);
      setErrorMessage(error.message || 'Something went wrong. Please try again.');
    }
  };

  return (
    <div className={classes.container}>
      <div className={classes.details}>
        <Title title="Forgot Password" />
        <form onSubmit={handleSubmit(submit)} noValidate>
          <Input
            type="email"
            label="Enter your email"
            {...register('email', { required: 'Email is required', pattern: EMAIL })}
            error={errors.email}
          />

          {errors.email && <p className={classes.error}>{errors.email.message}</p>}
          {errorMessage && <p className={classes.error}>{errorMessage}</p>}
          {message && <p className={classes.message}>{message}</p>}

          <Button type="submit" text="Send Reset Link" />

          <div className={classes.backToLogin}>
            <Link to="/login">
              <b>Back to Login</b>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
