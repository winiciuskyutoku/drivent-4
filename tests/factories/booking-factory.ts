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
