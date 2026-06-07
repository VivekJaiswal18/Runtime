'use client'
import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import React, {useState} from "react";

export default function SignupCard() {

  const [formData, setFormData] = useState({
    "username": "",
    "email":"",
    "password":""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>)=>{
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
      try{
        const response = await fetch("http://localhost:8080/signup", {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(formData)
        })

        const data = await response.json()

        if(response.ok){
          alert("User signed Up successfully")
          console.log("User signed Up successfully", data)
        }
        else{
          alert(`User not successfully signed in ${data.message}`)
        }
      }
      catch(error){ 
        console.log(`Error singing in user ${error}`)
      }
  }

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Sign Up your account</CardTitle>
        <CardDescription>
          Enter your email below to signup your account
        </CardDescription>
        <CardAction>
          <Button asChild variant="link">
            <Link href="/login">
            Login
            </Link>
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col gap-6">
            <div className="grid gap-2">
              <Label htmlFor="email">Username</Label>
              <Input
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                type="username"
                placeholder="John Dough"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                type="email"
                placeholder="john@example.com"
                required
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
                {/* <a
                  href="#"
                  className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                >
                  Forgot your password?
                </a> */}
              </div>
              <Input 
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              type="password"
              required 
              />
            </div>
          </div>
        <Button type="submit" className="mt-8 w-full">
          Sign Up
        </Button>
        </form>
        {/* <Button variant="outline" className="w-full">
          Signup with Google
        </Button> */}
      </CardContent>
      <CardFooter className="flex-col gap-2">
      </CardFooter>
    </Card>
  )
}
