import jwt from "jsonwebtoken";

interface userPayload{
    id: number,
    username: string
    email: string,
}

export function generateRefreshToken(user: userPayload){
    return jwt.sign(
        {
            id: user.id,
            username: user.username,
            email: user.email
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

