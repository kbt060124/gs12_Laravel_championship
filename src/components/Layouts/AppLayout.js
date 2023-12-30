import Navigation from '@/components/Layouts/Navigation'
import { useAuth } from '@/hooks/auth'
import { ThemeProvider } from 'next-themes'

const AppLayout = ({ header, children }) => {
    const { user } = useAuth({ middleware: 'auth' })

    return (
        <ThemeProvider attribute="class" defaultTheme="dark">
            <div className="min-h-screen bg-black">
                <Navigation user={user} />

                {/* Page Heading */}
                <header className="bg-white shadow">

                </header>

                {/* Page Content */}
                <main>{children}</main>
            </div>
        </ThemeProvider>
    )
}

export default AppLayout
