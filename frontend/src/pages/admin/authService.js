// authService.js
export const getToken = () => {
    return localStorage.getItem('token'); // or your token storage method
  };
  
  // Other auth-related functions...
  export const setToken = (token) => {
    localStorage.setItem('token', token);
  };
  
  export const removeToken = () => {
    localStorage.removeItem('token');
  };
