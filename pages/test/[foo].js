
import { useRouter } from 'next/router'

export default function({ query }) {
  const router = useRouter()
  return <div>Hello world: {router.query.foo}</div>
}
