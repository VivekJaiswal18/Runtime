import jwt from "jsonwebtoken";

interface userPayload{
    id: number,
    email: string,
    username: string
}

export function generateRefreshToken(user: userPayload){
    return jwt.sign(
        {
            username: user.username,
            email: user.email,
            id: user.id
        },
        process.env.JWT_REFRESH_SECRET!,
        {
            expiresIn: '10d'
        }
    )
}

export async function generateAccessToken(user: userPayload){
    return jwt.sign(
        {
            username: user.username,
            email: user.email,
        },
        process.env.JWT_ACCESS_SECRET!,
        {
            expiresIn: "6h"
        }
)
}

