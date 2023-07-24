import faker from "@faker-js/faker";

export function fakeRoom(hasCapacity: boolean) {
    return {
        id: faker.datatype.number(),
        name: faker.name.firstName(),
        capacity: hasCapacity ? 10 : 0,
        hotelId: faker.datatype.number(),
        createdAt: new Date(),
        updatedAt: new Date()
    }
}
