'use client'
import { ThemeProvider } from '@emotion/react'
import React, { useEffect, useState } from 'react'

export default function Providers({ children }) {
    const [mounted, setMounted] = useState(false)
    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) return null
    return (
        <>
            <ThemeProvider
                defaultTheme="system"
                disableTransitionOnChange="false"
                enableSystem>
                {children}
            </ThemeProvider>
        </>
    )
}
