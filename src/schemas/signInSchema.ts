import {z} from "zod"

export const signInSchema= z.object({
    identifier:z.string(),
    password:z.string().length(6,"password must be at least 6 characters")
})