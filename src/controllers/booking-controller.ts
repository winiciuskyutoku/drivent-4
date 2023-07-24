import { AuthenticatedRequest } from "@/middlewares";
import { bookingServices } from "@/services/booking-serivce";
import { Response } from "express";
import httpStatus from "http-status";

export async function getBooking(req: AuthenticatedRequest, res: Response){
    const userId = req.userId

    try {
        const result = await bookingServices.getBooking(userId)

        return res.send(result)
    } catch(err){
        if(err.name === 'NotFoundError') return res.status(httpStatus.NOT_FOUND).send(err.message)
        return res.status(httpStatus.NOT_FOUND).send(err.message)
    }
}

export async function postBooking(req: AuthenticatedRequest, res: Response){
    const {roomId} = req.body
    const userId = req.userId
    const rId = Number(roomId)

    try{
        const result = await bookingServices.postBooking(rId, userId)

        return res.status(httpStatus.OK).send({bookingId: result.id})
    } catch(err){
        if(err.name === 'NotFoundError') return res.status(httpStatus.NOT_FOUND).send(err.message)
        if(err.name === 'ForbiddenError') return res.status(httpStatus.FORBIDDEN).send(err.message)
        if(err.name === 'RoomWithoutCapacity') return res.status(httpStatus.FORBIDDEN).send(err.message)
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).send(err.message)
    }
}

export async function changeBooking(req: AuthenticatedRequest, res: Response){
    const userId = req.userId
    const {roomId} = req.body
    const {bookingId} = req.params
    const bId = Number(bookingId)

    try{
        const result = await bookingServices.changeBooking(roomId, userId, bId)

        return res.send({bookingId: result.id})
    } catch(err){
        if(err.name === 'NotFoundError') return res.status(httpStatus.NOT_FOUND).send(err.message)
        return res.status(httpStatus.FORBIDDEN).send(err.message)
    }
}