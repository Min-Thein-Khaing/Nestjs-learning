import { faker } from '@faker-js/faker';

export const validFullUser = {
  firstName: faker.person.firstName(),
  lastName: faker.person.lastName(),
  email: faker.internet.email(),
  // password: faker.internet.password({ length: 10, memorable: true, pattern: /[A-Za-z0-9]/ }),
  password: 'HelloWorld@1234', // Use a valid password that meets the criteria
};

export const missingFirstName = {
  lastName: faker.person.lastName(),
  email: faker.internet.email(),
  // password: faker.internet.password({ length: 10, memorable: true, pattern: /[A-Za-z0-9]/ }),
  password: 'HelloWorld@1234', // Use a valid password that meets the criteria
};

export const missingEmail = {
  firstName: faker.person.firstName(),
  lastName: faker.person.lastName(),
  // password: faker.internet.password({ length: 10, memorable: true, pattern: /[A-Za-z0-9]/ }),
  password: 'HelloWorld@1234', // Use a valid password that meets the criteria
};

export const missingPassword = {
  firstName: faker.person.firstName(),
  lastName: faker.person.lastName(),
  email: faker.internet.email(),
  // password: faker.internet.password({ length: 10, memorable: true, pattern: /[A-Za-z0-9]/ }),
};
