import { notFoundError } from "@/errors";
import { bookingRepositories } from "@/repositories/booking-repository";
import { roomRepositories } from "@/repositories/room-respository";
import { roomWithourCapacity } from "./error";
import enrollmentRepository from "@/repositories/enrollment-repository";
import ticketsRepository from "@/repositories/tickets-repository";
import { forbiddenError } from "@/errors/forbidden-error";

async function getBooking(userId: number){
    const result = await bookingRepositories.getBooking(userId)
    if(!result) throw notFoundError()

    return result
}

async function postBooking(roomId: number, userId: number){
    const getEnrollment = await enrollmentRepository.findWithAddressByUserId(userId)
    if(!getEnrollment) throw notFoundError()

    const getTicket = await ticketsRepository.findTicketByEnrollmentId(getEnrollment.id)
    if(!getTicket) throw notFoundError()
    if(getTicket.status === 'RESERVED') throw forbiddenError()
    if(getTicket.TicketType.isRemote === true) throw forbiddenError()
    if(getTicket.TicketType.includesHotel === false) throw forbiddenError()
    
    const checkRoom = await roomRepositories.getRoomById(roomId)
    if(!checkRoom) throw notFoundError()

    const getBookings = await bookingRepositories.getBookingByRoom(roomId)
    if(checkRoom.capacity === getBookings.length) throw roomWithourCapacity()

    const result =  await bookingRepositories.postBooking(roomId, userId)

    return result
}

async function changeBooking(roomId: number, userId: number, bookingId: number){
    const checkBooking = await bookingRepositories.getBookingByUser(userId)
    if(!checkBooking) throw forbiddenError()

    const checkRoom = await roomRepositories.getRoomById(roomId)
    if(!checkRoom) throw notFoundError()

    const getBookings = await bookingRepositories.getBookingByRoom(roomId)
    if(checkRoom.capacity === getBookings.length) throw roomWithourCapacity()

    return await bookingRepositories.changeBooking(roomId, userId, bookingId)
}

export const bookingServices = {
    getBooking,
    postBooking,
    changeBooking
}