'use client'

import { Camera } from 'lucide-react'
import { MediaPicker } from './MediaPicker'
import { FormEvent, useCallback } from 'react'
import { api } from '../lib/api'
import Cookie from 'js-cookie'
import { useRouter } from 'next/navigation'

export function NewMemoryForm() {
  const router = useRouter()

  const handleCreateMemory = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault()

      const formData = new FormData(event.currentTarget)

      const fileToUpload = formData.get('coverMedia')

      let coverUrl = ''

      if (fileToUpload) {
        const uploadFormData = new FormData()
        uploadFormData.set('file', fileToUpload)

        const uploadResponse = await api.post('/upload', uploadFormData)

        coverUrl = uploadResponse.data.fileURL
      }

      const token = Cookie.get('token')

      await api.post(
        '/memories',
        {
          coverUrl,
          content: formData.get('content'),
          isPublic: formData.get('isPublic'),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )

      router.push('/')
    },
    [router],
  )

  return (
    <form onSubmit={handleCreateMemory} className="flex flex-1 flex-col gap-2">
      <div className="flex items-center gap-4">
        <label
          htmlFor="media"
          className="flex cursor-pointer items-center gap-1.5 text-sm text-gray-200 hover:text-gray-100"
        >
          <Camera className="h-4 w-4" />
          Anexar mídia
        </label>
        <label
          htmlFor="isPublic"
          className="flex items-center gap-1.5 text-sm text-gray-200 hover:text-gray-100"
        ></label>
        <input
          type="checkbox"
          name="isPublic"
          id="isPublic"
          value="true"
          className="h-4 w-4 rounded border-gray-400 border-transparent bg-gray-700 text-purple-500 outline-none focus:border-transparent focus:ring-0"
        />
        Tornar memória pública
      </div>
      <MediaPicker />
      <textarea
        spellCheck={false}
        name="content"
        className="w-full flex-1 resize-none rounded border-0 bg-transparent p-0 text-lg leading-relaxed text-gray-100 placeholder:text-gray-400 focus:ring-0"
        placeholder="Sinta-se livre para adicionar fotos, vídeos e relatos sobre essa experiência que você quer lembrar para sempre."
      />

      <button
        type="submit"
        className="inline-block cursor-pointer self-end rounded-full bg-green-500 px-5 py-3 font-alt text-sm uppercase leading-none text-black hover:bg-green-600"
      >
        salvar
      </button>
    </form>
  )
}
