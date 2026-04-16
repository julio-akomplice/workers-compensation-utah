import Link from 'next/link'
import Image from 'next/image'
import React from 'react'

import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="container py-28">
      <Image src="/wcu_logo.png" alt="Workers Compensation Utah" width={180} height={60} className="mb-8" />
      <div className="prose max-w-none">
        <h1 style={{ marginBottom: 0 }}>404</h1>
        <p className="mb-4">
          This page could not be found. If you were looking for help with a workers&apos;
          compensation claim, we&apos;re here for you.
        </p>
      </div>
      <div className="flex gap-4">
        <Button asChild variant="default">
          <Link href="/">Go home</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/contact">Free consultation</Link>
        </Button>
      </div>
    </div>
  )
}
