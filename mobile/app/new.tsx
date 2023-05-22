import {
  Image,
  ScrollView,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native'
import NLWLogo from '../src/assets/nlw-logo.svg'
import { Link, useRouter } from 'expo-router'
import Icon from '@expo/vector-icons/Feather'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useState } from 'react'
import * as ImagePicker from 'expo-image-picker'
import * as SecureStore from 'expo-secure-store'
import { api } from '../src/lib/api'

export default function NewMemories() {
  const router = useRouter()

  const { bottom, top } = useSafeAreaInsets()

  const [isPublic, setPublic] = useState(false)
  const [content, setContent] = useState('')
  const [preview, setPreview] = useState<ImagePicker.ImagePickerAsset | null>(
    null,
  )

  const openImagePicker = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        quality: 1,
        selectionLimit: 1,
      })

      if (result.assets[0]) {
        setPreview(result.assets[0])
      }
    } catch (err) {
      // deu erro xd
    }
  }

  const handleCreateMemory = async () => {
    const token = await SecureStore.getItemAsync('token')

    let coverUrl = ''

    if (preview) {
      const uploadFormData = new FormData()

      uploadFormData.append('file', {
        uri: preview.uri,
        name: preview.type === 'image' ? 'image.jpg' : 'video.mp4',
        type: preview.type === 'image' ? 'image/jpeg' : 'video/mp4',
      } as any)

      const uploadResponse = await api.post('/upload', uploadFormData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      coverUrl = uploadResponse.data.fileURL
    }

    await api.post(
      '/memories',
      {
        content,
        isPublic,
        coverUrl,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    )
    router.push('/memories')
  }

  return (
    <ScrollView
      className="flex-1 px-8"
      contentContainerStyle={{ paddingBottom: bottom + 16, paddingTop: top }}
    >
      <View className="mt-4 flex-row items-center justify-between">
        <NLWLogo />

        <Link href="/memories" asChild>
          <TouchableOpacity className="h-10 w-10 items-center justify-center rounded-full bg-purple-500">
            <Icon name="arrow-left" color="#fff" />
          </TouchableOpacity>
        </Link>
      </View>

      <View className="mt-6 space-y-6">
        <View className="flex-row items-center gap-2">
          <Switch
            value={isPublic}
            onValueChange={setPublic}
            trackColor={{ false: '#767577', true: '#372560' }}
            thumbColor={isPublic ? '#9b79ea' : '#9e9ea0'}
          />
          <Text className="font-body text-base text-gray-200">
            Tornar memória pública
          </Text>
        </View>

        <TouchableOpacity
          onPress={openImagePicker}
          activeOpacity={0.6}
          className="h-32 items-center justify-center rounded-xl border border-dashed border-gray-500 bg-black/20"
        >
          {preview ? (
            <Image
              alt="preview"
              source={{ uri: preview.uri }}
              className="h-full w-full rounded-lg object-cover"
            />
          ) : (
            <View className="flex-row items-center gap-2">
              <Icon name="image" color="#fff" />
              <Text className="font-body text-sm text-gray-200">
                Adicionar foto ou vídeo de capa
              </Text>
            </View>
          )}
        </TouchableOpacity>

        <TextInput
          multiline
          className="p-0 font-body text-lg text-gray-50"
          value={content}
          onChangeText={setContent}
          style={{ textAlignVertical: 'top' }}
          placeholderTextColor="#56565a"
          cursorColor={'#5c3ea3'}
          placeholder="Sinta-se livre para adicionar fotos, vídeos e relatos sobre essa experiência que você quer lembrar para sempre"
        ></TextInput>
        <TouchableOpacity
          onPress={handleCreateMemory}
          activeOpacity={0.7}
          className="mt-6 items-center self-end rounded-full bg-green-500 px-5 py-2"
        >
          <Text className="font-alt text-sm uppercase text-black">Salvar</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  )
}
