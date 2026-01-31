import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { loginSchema, type LoginFormData } from "@/lib/validations"
import { useAuth } from "../hooks/useAuth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Form, FormField, FormLabel, FormMessage } from "@/components/ui/form"

export function LoginForm() {
  const { login, isLoading } = useAuth()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = (data: LoginFormData) => {
    login(data)
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Admin Girişi</CardTitle>
        <CardDescription>
          Beauty App Admin paneline giriş yapmak için bilgilerinizi giriniz
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <FormField>
            <FormLabel htmlFor="email">Email</FormLabel>
            <Input
              id="email"
              type="email"
              placeholder="admin@example.com"
              {...register("email")}
              disabled={isLoading}
            />
            {errors.email && (
              <FormMessage>{errors.email.message}</FormMessage>
            )}
          </FormField>

          <FormField>
            <FormLabel htmlFor="password">Şifre</FormLabel>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              {...register("password")}
              disabled={isLoading}
            />
            {errors.password && (
              <FormMessage>{errors.password.message}</FormMessage>
            )}
          </FormField>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Giriş yapılıyor..." : "Giriş Yap"}
          </Button>
        </Form>
      </CardContent>
    </Card>
  )
}
