import { useMutation } from '@tanstack/react-query';
import { auth } from '../api/endpoints';

export function useAuth() {
  const loginMutation = useMutation({
    mutationFn: auth.login,
    onSuccess: (response) => {
      localStorage.setItem('token', response.data.token);
    },
  });

  const signupMutation = useMutation({
    mutationFn: auth.signup,
    onSuccess: (response) => {
      localStorage.setItem('token', response.data.token);
    },
  });

  const logout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  return { loginMutation, signupMutation, logout };
}