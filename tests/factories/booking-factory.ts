import { prisma } from "@/config";
import faker from "@faker-js/faker";
import { fakeRoom } from "./room-factory";

export async function createFakeBooking(roomId: number, userId:number){
    return await prisma.booking.create({
        data: {
            userId,
            roomId
        }
    })
}

export function fakeBooking(hasCapacity: boolean){
    const room = fakeRoom(hasCapacity)

    return {
        id: faker.datatype.number(),
        Room: {
            ...room
        }
    }
}

export function fakeBookingWithoutRoom(){
    return {
        id: faker.datatype.number(),
        userId: faker.datatype.number(),
        roomId: faker.datatype.number(),
        createdAt: new Date(),
        updatedAt: new Date()
    }
}
