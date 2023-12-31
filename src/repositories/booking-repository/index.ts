import { prisma } from "@/config";

async function getBooking(userId: number){
    const result =  await prisma.booking.findFirst({
        include: {
            Room: true
        },
        where: {
            userId
        }
    })

    return {
        id: result.id,
        Room: {
            ...result.Room
        }
    }
}

async function getBookingByUser(userId: number){
    return await prisma.booking.findFirst({
        where: {
            userId
        }
    })
}

async function getBookingByRoom(roomId: number){
    return await prisma.booking.findMany({
        where: {
            roomId
        }
    })
}

async function postBooking(roomId: number, userId: number){
    return await prisma.booking.create({
        data: {
            userId,
            roomId
        }
    })
}

async function changeBooking(roomId: number, userId: number, bookingId: number){
    return await prisma.booking.update({
        data: {
            userId,
            roomId
        },
        where: {
            id: bookingId
        }
    })
}

export const bookingRepositories = {
    getBooking,
    postBooking,
    changeBooking,
    getBookingByRoom,
    getBookingByUser
}