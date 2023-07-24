import { prisma } from "@/config";

async function getRoomById(roomId: number){
    return await prisma.room.findFirst({
        where: {
            id: roomId
        }
    })
}

export const roomRepositories = {
    getRoomById
}