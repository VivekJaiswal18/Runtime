"use client"

export default function Logout(){
const handleSubmit = async (e: React.FormEvent) =>{
    e.preventDefault()
    try{
        const response = await fetch("http://runtime-backend-lb-396229780.ap-southeast-2.elb.amazonaws.com/logout", {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
            "credentails": "include"
        }
    })
    const data = await response.json()
    if(response.ok){
        alert(data)
        console.log("user logged out", data)
    }
    else{

        alert(`not logged out ${data}`)
        console.log("user not logged out", data)
    }
}
catch(error){
    alert(`user not logger out ${error}`)
}
}
return(
    <div>
        <form onSubmit={handleSubmit}>
    <button type="submit">Logout</button>
    </form>
    </div>
)
}