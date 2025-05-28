export const ENCRYPTION_METHODS = {
  NONE: 'none',
  AES: 'aes',
  TRIPLE_DES: '3des',
  RSA: 'rsa'
} as const;

export type EncryptionMethod = typeof ENCRYPTION_METHODS[keyof typeof ENCRYPTION_METHODS];

export const ENCRYPTION_COLORS = {
  [ENCRYPTION_METHODS.NONE]: 'text-gray-400',
  [ENCRYPTION_METHODS.AES]: 'text-blue-500',
  [ENCRYPTION_METHODS.TRIPLE_DES]: 'text-green-500',
  [ENCRYPTION_METHODS.RSA]: 'text-purple-500'
};

export const ENCRYPTION_BACKGROUNDS = {
  [ENCRYPTION_METHODS.NONE]: 'bg-gray-100 dark:bg-gray-800',
  [ENCRYPTION_METHODS.AES]: 'bg-blue-100 dark:bg-blue-900',
  [ENCRYPTION_METHODS.TRIPLE_DES]: 'bg-green-100 dark:bg-green-900',
  [ENCRYPTION_METHODS.RSA]: 'bg-purple-100 dark:bg-purple-900'
};

export const USER_ROLES = {
  USER: 'user',
  ADMIN: 'admin'
} as const;

export type UserRole = typeof USER_ROLES[keyof typeof USER_ROLES];