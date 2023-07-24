import { bookingRepositories } from "@/repositories/booking-repository"
import enrollmentRepository from "@/repositories/enrollment-repository"
import { bookingServices } from "@/services/booking-serivce"
import { enrollmentFactory, fakeBooking, fakeBookingWithoutRoom, fakeRoom, fakeTicket } from "../factories"
import ticketsRepository from "@/repositories/tickets-repository"
import { roomRepositories } from "@/repositories/room-respository"

beforeEach(() => {
    jest.clearAllMocks()
})

describe('UNIT GET /booking', () => {
    it('Should respond with status 404 when user does not have a booking', async () => {
        jest.spyOn(bookingRepositories, 'getBooking').mockResolvedValue(null)

        const response = bookingServices.getBooking(1)
        expect(response).rejects.toEqual({
            name: 'NotFoundError',
            message: 'No result for this search!'
        })
    })
})

describe('UNIT POST /booking', () => {
    it('Should respond with status 404 when enrollmest is not found', async () => {
        jest.spyOn(enrollmentRepository, 'findWithAddressByUserId').mockResolvedValue(null)

        const response = bookingServices.postBooking(1, 1)
        expect(response).rejects.toEqual({
            name: 'NotFoundError',
            message: 'No result for this search!',
        })
    })

    it('Should response with status 404 when ticket does not exist', async () => {
        jest.spyOn(enrollmentRepository, 'findWithAddressByUserId').mockResolvedValue(enrollmentFactory())
        jest.spyOn(ticketsRepository, 'findTicketByEnrollmentId').mockResolvedValue(null)

        const response = bookingServices.postBooking(1, 1)
        expect(response).rejects.toEqual({
            name: 'NotFoundError',
            message: 'No result for this search!',
        })
    })

    it('Should respond with status 403 when ticket is not paid', async () => {
        jest.spyOn(enrollmentRepository, 'findWithAddressByUserId').mockResolvedValue(enrollmentFactory())
        jest.spyOn(ticketsRepository, 'findTicketByEnrollmentId').mockResolvedValue(fakeTicket(false, true, false))

        const response = bookingServices.postBooking(1, 1)
        expect(response).rejects.toEqual({
            name: 'ForbiddenError',
            message: 'Forbidden Error',
        })
    })

    it('Should respond with status 403 when ticket type is remote', async () => {
        jest.spyOn(enrollmentRepository, 'findWithAddressByUserId').mockResolvedValue(enrollmentFactory())
        jest.spyOn(ticketsRepository, 'findTicketByEnrollmentId').mockResolvedValue(fakeTicket(true, false, true))

        const response = bookingServices.postBooking(1, 1)
        expect(response).rejects.toEqual({
            name: 'ForbiddenError',
            message: 'Forbidden Error',
        })
    })

    it('Should respond with status 403 when ticket type does not includes hotel', async () => {
        jest.spyOn(enrollmentRepository, 'findWithAddressByUserId').mockResolvedValue(enrollmentFactory())
        jest.spyOn(ticketsRepository, 'findTicketByEnrollmentId').mockResolvedValue(fakeTicket(false, false, true))

        const response = bookingServices.postBooking(1, 1)
        expect(response).rejects.toEqual({
            name: 'ForbiddenError',
            message: 'Forbidden Error',
        })
    })

    it('Should respond with status 404 when room does not exist', async () => {
        jest.spyOn(enrollmentRepository, 'findWithAddressByUserId').mockResolvedValue(enrollmentFactory())
        jest.spyOn(ticketsRepository, 'findTicketByEnrollmentId').mockResolvedValue(fakeTicket(false, true, true))
        jest.spyOn(roomRepositories, 'getRoomById').mockResolvedValue(null)

        const response = bookingServices.postBooking(1, 1)
        expect(response).rejects.toEqual({
            name: 'NotFoundError',
            message: 'No result for this search!',
        })
    })

    it('Should respond with status 403 when room does not have enough capacity', async () => {
        jest.spyOn(enrollmentRepository, 'findWithAddressByUserId').mockResolvedValue(enrollmentFactory())
        jest.spyOn(ticketsRepository, 'findTicketByEnrollmentId').mockResolvedValue(fakeTicket(false, true, true))
        jest.spyOn(roomRepositories, 'getRoomById').mockResolvedValue(fakeRoom(false))
        jest.spyOn(bookingRepositories, 'getBookingByRoom').mockResolvedValue([])

        const response = bookingServices.postBooking(1, 1)
        expect(response).rejects.toEqual({
            name: 'RoomWithoutCapacity',
            message: 'There is no capacity for this room',
        })
    })
})

describe('UNIT PUT /booking/:bookingId', () => {
    it('Should respond with status 403 when user has no booking/reservation', async () => {
        jest.spyOn(bookingRepositories, 'getBookingByUser').mockResolvedValue(null)

        const response = bookingServices.changeBooking(1, 1, 1)
        expect(response).rejects.toEqual({
            name: 'ForbiddenError',
            message: 'Forbidden Error',
        })
    })

    it('Should respond with status 404 there is no room', async () => {
        jest.spyOn(bookingRepositories, 'getBookingByUser').mockResolvedValue(fakeBookingWithoutRoom())
        jest.spyOn(roomRepositories, 'getRoomById').mockResolvedValue(null)

        const response = bookingServices.changeBooking(1, 1, 1)
        expect(response).rejects.toEqual({
            name: 'NotFoundError',
            message: 'No result for this search!',
        })
    })

    it('Should respond with status 403 when room does not have capacity', async () => {
        jest.spyOn(bookingRepositories, 'getBookingByUser').mockResolvedValueOnce(fakeBookingWithoutRoom())
        jest.spyOn(roomRepositories, 'getRoomById').mockResolvedValue(fakeRoom(false))
        jest.spyOn(bookingRepositories, 'getBookingByRoom').mockResolvedValue([])

        const response = bookingServices.changeBooking(1, 1, 1)
        expect(response).rejects.toEqual({
            name: 'RoomWithoutCapacity',
            message: 'There is no capacity for this room',
        })
    })
})