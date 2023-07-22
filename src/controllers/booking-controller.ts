import { AuthenticatedRequest } from "@/middlewares";
import { Response } from "express";
import httpStatus from "http-status";

export async function getBooking(req: AuthenticatedRequest, res: Response){
    try {

    } catch(err){
        if(err.name === 'NotFoundError') res.status(httpStatus.NOT_FOUND).send(err.message)
    }
}

export async function postBooking(req: AuthenticatedRequest, res: Response){
    try{

    } catch(err){

    }
}

export async function changeBooking(req: AuthenticatedRequest, res: Response){
    try{

    } catch(err){

    }
}