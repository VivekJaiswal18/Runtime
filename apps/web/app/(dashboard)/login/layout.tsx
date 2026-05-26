import { ReactNode } from "react"

export default function Loginlayout({ children }: Readonly<{children: ReactNode }>): React.JSX.Element {
    return(
        <div className="flex min-h-screen items-center justify-center">
        {children}
        </div>
    );
}