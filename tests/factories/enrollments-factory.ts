import faker from '@faker-js/faker';
import { generateCPF, getStates } from '@brazilian-utils/brazilian-utils';
import { User } from '@prisma/client';

import { createUser } from './users-factory';
import { prisma } from '@/config';

export async function createEnrollmentWithAddress(user?: User) {
  const incomingUser = user || (await createUser());

  return prisma.enrollment.create({
    data: {
      name: faker.name.findName(),
      cpf: generateCPF(),
      birthday: faker.date.past(),
      phone: faker.phone.phoneNumber('(##) 9####-####'),
      userId: incomingUser.id,
      Address: {
        create: {
          street: faker.address.streetName(),
          cep: faker.address.zipCode(),
          city: faker.address.city(),
          neighborhood: faker.address.city(),
          number: faker.datatype.number().toString(),
          state: faker.helpers.arrayElement(getStates()).name,
        },
      },
    },
    include: {
      Address: true,
    },
  });
}

export function enrollmentFactory() {
  return {
    id: 1,
    name: faker.name.firstName(),
    cpf: faker.datatype.number().toString(),
    birthday: new Date(),
    phone: faker.datatype.number().toString(),
    userId: faker.datatype.number(),
    createdAt: new Date(),
    updatedAt: new Date(),
    Address: [
      {
        id: 1,
        cep: faker.address.zipCode(),
        street: faker.address.streetName(),
        city: faker.address.cityName(),
        state: faker.address.state(),
        number: faker.datatype.number().toString(),
        neighborhood: faker.name.findName(),
        addressDetail: faker.address.secondaryAddress(),
        enrollmentId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ],
  };
}

export function createhAddressWithCEP() {
  return {
    logradouro: 'Avenida Brigadeiro Faria Lima',
    complemento: 'de 3252 ao fim - lado par',
    bairro: 'Itaim Bibi',
    cidade: 'São Paulo',
    uf: 'SP',
  };
}
