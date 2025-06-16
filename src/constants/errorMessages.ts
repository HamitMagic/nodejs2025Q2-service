export const ERRORS = {
  notFound: (str: string) => `${str} not found`,
  notProvided: (str: string) => `${str} not provided`,
  existingUser: 'User with this login already exists',
  notCorrectPassword: 'Password is not correct',
  alreadyExists: (str: string) => `${str} is already in favorites`,
  unknownError: 'oops something was wrong, try again later'
};
