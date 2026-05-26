import React from "react"
import { ReactNode } from "react";

export default function SignupLayout({children}: Readonly<{children: ReactNode}>): React.JSX.Element {
    return(
        <div className="flex min-h-screen justify-center items-center">
            {children}
        </div>
    );
}