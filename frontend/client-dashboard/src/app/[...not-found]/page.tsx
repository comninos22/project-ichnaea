'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@project-ichnaea/ui-components'
import { ArrowLeft } from 'lucide-react'

export default function NotFound() {
  const router = useRouter()

  useEffect(() => {
    const redirectTimer = setTimeout(() => {
      router.push('/')
    }, 5000)

    return () => clearTimeout(redirectTimer)
  }, [router])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-purple-600 to-blue-600 text-white">
      <div className="text-center space-y-6 p-8 bg-white/10 backdrop-blur-lg rounded-lg shadow-xl">
        <h1 className="text-6xl font-bold">404</h1>
        <h2 className="text-3xl font-semibold">Page Not Found</h2>
        <p className="text-xl">
          Oops! The page you re looking for doesn t exist or has been moved.
        </p>
        <p className="text-lg">
          You will be redirected to the home page in 5 seconds...
        </p>
        <Button asChild variant="secondary" className="mt-4 bg-white hover:bg-gray-100">
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Go back home
          </Link>
        </Button>
      </div>
    </div>
  )
}

