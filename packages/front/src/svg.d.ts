declare module '*.svg' {
  import { FC } from 'react'
  const content: FC<React.SVGProps<SVGElement>>
  export default content
}
