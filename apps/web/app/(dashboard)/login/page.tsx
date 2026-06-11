"use client"
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
import React, {useState} from "react"

export default function LoginCard() {

  const [formData, setformData] = useState({
    "email": "",
    "password": ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>{
    setformData({
      ...formData,
      [e.target.name]: e.target.value
    })
  };

const handleSubmit = async (e: React.FormEvent) =>{
  e.preventDefault()

  try{
    const response = await fetch("http://runtime-backend-lb-396229780.ap-southeast-2.elb.amazonaws.com/login", {
      method: "POST",
      credentials: "include",
      headers:{
      "Content-Type": "application/json"
      },
      body: JSON.stringify(formData)
    })

    const data = await response.json()
    if(response.ok){
      alert("User logged in successfully")
      console.log("user logged in", data)
    }
    else{
      alert("Error Logging user in")
      console.log(data.message)
    }
  }
  catch(error){
    alert("User not successfully logged in")
    console.log(`Error loggin user in ${error}`)
  }
}

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Login to your account</CardTitle>
        <CardDescription>
          Enter your email below to login to your account
        </CardDescription>
        <CardAction>
          <Button asChild variant="link">
            <Link href="/signup">
            Sign Up
            </Link>
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col gap-6">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                type="email"
                placeholder="m@example.com"
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
        <Button type="submit" className="w-full">
          Login
        </Button>
        </form>
      </CardContent>
      <CardFooter className="flex-col gap-2">
        {/* <Button variant="outline" className="w-full">
          Login with Google
        </Button> */}
      </CardFooter>
    </Card>
  )
}
