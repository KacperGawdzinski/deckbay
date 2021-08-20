export const login = (username: string) => ({
  type: 'LOG_IN',
  payload: username,
});

export const logout = () => ({
  type: 'LOG_OUT',
});
