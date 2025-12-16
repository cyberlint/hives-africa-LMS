import React, { ReactNode } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface NavlinkProps {
    children: ReactNode
}

const navlink = ({children}:NavlinkProps) => {
    const pathname = usePathname()
    
  return (
    <Link href={""}
    // {...children}
    ></Link>
  )
}

export default navlink