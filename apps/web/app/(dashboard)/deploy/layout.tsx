import React, { ReactNode } from "react";
export default function DeployLoayout({ children }: Readonly<{children: ReactNode }>): React.JSX.Element{
    return(
        <div className="flex justify-center items-center min-h-screen">
            {children}
        </div>
    )
}