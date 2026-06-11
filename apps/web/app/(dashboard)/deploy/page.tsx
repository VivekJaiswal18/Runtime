'use client'
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardAction, CardContent, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Link } from "lucide-react"
import { Label } from "radix-ui"
import React from "react"
import {useState} from "react"

export default function Deploy(){

    const [formData, setformData] = useState({
        repoUrl: "",
        name: "",
        branch: ""
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>{
        setformData({
            ...formData,
            [e.target.name]: e.target.value
    })
    }

    const handleSubmit = async (e: React.FormEvent) =>{
        e.preventDefault()
        const response = await fetch("http://runtime-backend-lb-396229780.ap-southeast-2.elb.amazonaws.com/delpoy", {
            method: "POST",
            headers: {
                "Content-type": "application/json"
            },
            credentials: "include",
            body: JSON.stringify(formData)
        })
    } 
    return(
        <div>
            <Card className="w-full max-w-sm flex">
      <CardHeader>
        <CardTitle>Create a new Project</CardTitle>
        <CardDescription>
          Enter your details about the project
        </CardDescription>
        <CardAction>
          {/* <Button asChild variant="link">
            <Link href="/signup">
            Sign Up
            </Link>
          </Button> */}
        </CardAction>
      </CardHeader>
      <CardContent>
            <form onSubmit={handleSubmit}>
          <div className="grid gap-4">
              <div className="flex items-center">
                {/* <Label>Project Name</Label> */}
              </div>
              <Input 
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              type="name"
              required
              />
          </div>
            <div className="grid gap-4">
              <div className="flex items-center">
                {/* <Label>Password</Label> */}
              </div>
              <Input 
              id="repoUrl"
              name="repoUrl"
              value={formData.repoUrl}
              onChange={handleChange}
              type="repoUrl"
              required
              />
            </div>
          <div className="flex flex-col gap-6">
            <div className="grid gap-2">
              {/* <Label>branch</Label> */}
              <Input
                id="branch"
                name="branch"
                value={formData.branch}
                onChange={handleChange}
                type="branch"
                placeholder="m@example.com"
                required
              />
            </div>
          </div>
        <Button type="submit" className="w-full">
          Login
        </Button>
        </form>
        </CardContent>
      <CardFooter className="flex-col gap-4">
        {/* <Button variant="outline" className="w-full">
          Login with Google
        </Button> */}
      </CardFooter>
    </Card>
        </div>
    )
}