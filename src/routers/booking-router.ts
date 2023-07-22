import { changeBooking, getBooking, postBooking } from "@/controllers/booking-controller";
import { authenticateToken } from "@/middlewares";
import { Router } from "express";

const bookingRouter = Router()

bookingRouter
    .all('/*', authenticateToken)
    .get('/', getBooking)
    .post('/', postBooking)
    .put('/:bookingId', changeBooking)

export {bookingRouter}