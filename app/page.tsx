import { AccessGate } from '@/components/gate/access-gate'

export default function Page() {
  return <AccessGate year={new Date().getFullYear()} />
}
