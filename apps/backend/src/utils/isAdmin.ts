export const isAdmin = (role: string) => {
  return role === 'admin' || role === 'super_admin';
};

export const isSeller = (role: string) => {
  return role === 'seller';
};

export const isCustomer = (role: string) => {
  return role === 'customer';
};
