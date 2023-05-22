import { cookies } from 'next/headers'
import { api } from '../../../lib/api'
import dayjs from 'dayjs'
import { ChevronLeft } from 'lucide-react'
import Link from 'next/link'

interface SingleMemory {
  coverUrl: string
  createdAt: string
  id: string
  content: string
}

export default async function ViewSingleMemory({
  params,
}: {
  params: { id: string }
}) {
  const token = cookies().get('token')?.value

  const memoryResponse = await api.get(`/memories/${params.id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  const memory = memoryResponse.data as SingleMemory

  if (!memory) {
    return (
      <div className="flex items-center justify-center">
        Memória não encontrada :(
      </div>
    )
  }

  return (
    <div className="flex flex-col space-y-4" key={memory.id}>
      <Link
        href="/"
        className="flex items-center gap-1 text-sm text-gray-200 hover:text-gray-100"
      >
        <ChevronLeft className="h-4 w-4" />
        voltar à timeline
      </Link>
      <div className="flex flex-row">
        <div
          className="absolute flex w-max flex-row items-center justify-center gap-2"
          style={{ right: '100%' }}
        >
          <p className="text-sm">
            {dayjs(memory.createdAt).format('D[ de ]MMMM[, ]YYYY')}
          </p>
          <div className="h-px w-4 bg-gray-50"></div>
        </div>

        {/* eslint-disable-next-line */}
              <img
          src={memory.coverUrl}
          alt="memory cover"
          className="aspect-video w-full rounded-lg object-cover"
        />
      </div>
      <p className="text-md w-full">{memory.content}</p>
    </div>
  )
}
