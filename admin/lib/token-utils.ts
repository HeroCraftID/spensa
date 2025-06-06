// Generate a random token based on role
export const generateToken = (role: string): string => {
  const prefix = role.substring(0, 3).toUpperCase();
  const randomPart = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `${prefix}-${randomPart}`;
};

// Validate a token
export const validateToken = (token: string): { valid: boolean; role?: string } => {
  // In a real application, this would check against a database
  // For demo purposes, we'll validate based on the token format
  
  const tokenRegex = /^([A-Z]{3})-([A-Z0-9]{6})$/;
  const match = token.match(tokenRegex);
  
  if (!match) {
    return { valid: false };
  }
  
  const prefix = match[1];
  
  // Map prefix to role
  let role;
  switch (prefix) {
    case 'ADM':
      role = 'Admin';
      break;
    case 'BK':
      role = 'BK';
      break;
    default:
      return { valid: false };
  }
  
  // In a real app, we would check if the token exists and hasn't been used
  // For demo, we'll assume it's valid if it matches the format
  return { valid: true, role };
};
