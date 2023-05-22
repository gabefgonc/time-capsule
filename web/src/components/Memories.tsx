import Link from 'next/link'
import { Memory } from '../types/memory'
import { ArrowRight } from 'lucide-react'
import dayjs from 'dayjs'
import ptBr from 'dayjs/locale/pt-br'

dayjs.locale(ptBr)

export function Memories({ memories }: { memories: Memory[] }) {
  return (
    <div className="flex flex-1 flex-col items-center space-y-4 px-4">
      {memories.map((memory) => {
        return (
          <div className="flex flex-col space-y-4" key={memory.id}>
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
            <p className="text-md w-full">{memory.excerpt}</p>
            <Link
              href={`/memories/${memory.id}`}
              className="flex flex-row items-center gap-2 text-lg hover:underline"
            >
              <ArrowRight className="h-4 w-4" />
              Ler mais
            </Link>
          </div>
        )
      })}
    </div>
  )
}
