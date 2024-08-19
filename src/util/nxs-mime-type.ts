import { Satisfies } from '@/util/typescript'

export const NXS_MIME_TYPE = 'application/vnd.nxs'
export const WEB_NXS_MIME_TYPE = `web ${NXS_MIME_TYPE}`

const CONTENT_TYPES = ['windows', 'folders'] as const

export type NxsMimeContent = NxsMimeContentWindows | NxsMimeContentFolders

type NxsMimeContentWindows = Satisfies<
  NxsMimeContentTemplate,
  {
    type: 'windows'
    value: {
      windows: nxs.client.Window[]
    }
  }
>

type NxsMimeContentFolders = Satisfies<
  NxsMimeContentTemplate,
  {
    type: 'folders'
    value: {
      folders: nxs.collection.Folder[]
    }
  }
>

type NxsMimeContentTemplate = {
  type: (typeof CONTENT_TYPES)[number]
  value: unknown
}

// todo: consider Zod
export function isNxsMimeContent(content: unknown): content is NxsMimeContent {
  return (
    !!content &&
    typeof content === 'object' &&
    'type' in content &&
    typeof content.type === 'string' &&
    (CONTENT_TYPES as ReadonlyArray<string>).includes(content.type) && // https://stackoverflow.com/a/56745484/384062
    'value' in content
  )
}
