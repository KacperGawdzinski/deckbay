export const login = (username) => ({
  type: 'LOG_IN',
  payload: username,
});

export const logout = () => ({
  type: 'LOG_OUT',
});
