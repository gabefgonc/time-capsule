import { cookies } from 'next/headers'
import { NoMemories } from '../components/NoMemories'
import { api } from '../lib/api'
import { Memories } from '../components/Memories'
import { Memory } from '../types/memory'

export default async function Home() {
  const token = cookies().get('token')?.value

  if (!token) {
    return <NoMemories />
  }

  const memoriesResponse = await api.get('/memories', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  const memories = memoriesResponse.data as Memory[]

  return memories.length > 0 ? <Memories memories={memories} /> : <NoMemories />
}
