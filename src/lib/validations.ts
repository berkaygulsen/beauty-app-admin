import { z } from "zod"

// Login validation schema
export const loginSchema = z.object({
  email: z.string().email("Geçerli bir email adresi giriniz"),
  password: z.string().min(6, "Şifre en az 6 karakter olmalıdır"),
})

export type LoginFormData = z.infer<typeof loginSchema>
