'use client'

import { ChangeEvent, useCallback, useState } from 'react'

interface Preview {
  url: string
  type: string
}

export function MediaPicker() {
  const [preview, setPreview] = useState<Preview | null>(null)

  const onFileSelected = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    const { files } = event.target

    if (!files) {
      return
    }

    const previewURL = URL.createObjectURL(files[0])

    setPreview({ url: previewURL, type: files[0].type.split('/')[0] })
  }, [])

  return (
    <>
      <input
        name="coverMedia"
        onChange={onFileSelected}
        type="file"
        id="media"
        className="invisible h-0 w-0"
        accept="image/*,video/*"
      />

      {preview &&
        (preview.type === 'image' ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={preview.url}
            alt="preview"
            className="aspect-video w-full rounded-lg object-cover"
          />
        ) : (
          <video
            autoPlay
            src={preview.url}
            className="aspect-video w-full rounded-lg object-cover"
            controls={false}
            muted
          />
        ))}
    </>
  )
}
