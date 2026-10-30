'use client'

import '@tiptap/extension-text-style'
import BulletList from '@tiptap/extension-bullet-list'
import { Heading } from '@tiptap/extension-heading'
import ListItem from '@tiptap/extension-list-item'
import OrderedList from '@tiptap/extension-ordered-list'
import Placeholder from '@tiptap/extension-placeholder'
import { Table } from '@tiptap/extension-table'
import TableCell from '@tiptap/extension-table-cell'
import TableHeader from '@tiptap/extension-table-header'
import TableRow from '@tiptap/extension-table-row'
import TextAlign from '@tiptap/extension-text-align'
import { TextStyle } from '@tiptap/extension-text-style'
import Underline from '@tiptap/extension-underline'
import { useEditor, type Editor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import React, { useEffect } from 'react'
import { twMerge } from 'tailwind-merge'
import EditorWithFloatingToolbar, { ItemButton } from './EditorWithFloatingToolbar'
import { FontSizeExtension } from './extensions/FontSizeExtension'
import { ImageExtension } from './extensions/ImageExtension'
import { LetterNumber } from './extensions/LetterNumber'
import { LineHeightExtension } from './extensions/LineHeightExtension'
import { StackingContextExtension } from './extensions/StackingContextExtension' // <-- 1. Impor ekstensi baru
import { TabIndentExtension } from './extensions/TabIndentExtension'
import PerseComponent from '@/components/ui/PerseComponent'
import { FontFamilyExtension } from './extensions/FontFamilyExtension'

export const processImagesInHTML = async (
  htmlString: string,
  uploadFunction?: (formData: FormData) => Promise<{ url: string }>
): Promise<string> => {
  const imgRegex = /<img([^>]+)src="(data:image\/(png|jpeg|jpg|webp);base64,([^">]+)|blob:[^">]+)"([^>]*)>/g
  const matches = Array.from(htmlString.matchAll(imgRegex))

  if (!matches.length) return htmlString

  const uploadedUrls = await Promise.all(
    matches.map(async match => {
      const src = match[2]
      const base64Type = match[3]
      const isBase64 = !!base64Type
      const isBlob = src.startsWith('blob:')

      try {
        let file: File

        if (isBase64) {
          const byteArray = Uint8Array.from(atob(match[4]), c => c.charCodeAt(0))
          file = new File([byteArray], `image.${base64Type}`, { type: `image/${base64Type}` })
        } else if (isBlob) {
          const blobResponse = await fetch(src)
          const blobData = await blobResponse.blob()
          const mimeType = blobData.type.split('/')[1] || 'png'
          file = new File([blobData], `image.${mimeType}`, { type: blobData.type })
        } else {
          return src
        }

        const formData = new FormData()
        formData.append('image', file)

        if (uploadFunction) {
          const response = await uploadFunction(formData)
          return response.url
        } else {
          const res = await fetch('/admin/upload-editor-image', {
            method: 'POST',
            body: formData
          })
          const data = await res.json()
          return data.url
        }
      } catch {
        return src
      }
    })
  )

  let updatedHtml = htmlString
  matches.forEach((match, index) => {
    updatedHtml = updatedHtml.replace(match[0], `<img${match[1]}src="${uploadedUrls[index]}"${match[5]}>`)
  })

  return updatedHtml
}
interface CustomAction {
  id: string
  label: string
  icon: React.ReactNode
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info'
  onClick: (editor: Editor) => void
}

interface CustomContextMenuItem {
  id: string
  label: string
  icon?: React.ReactNode
  action: (editor: Editor) => void
}

interface RichTextProps {
  id?: string
  value?: string
  onChange?: (value: string) => void
  error?: string
  onBlur?: () => void
  readOnly?: boolean
  placeholder?: string
  className?: string
  customActions?: CustomAction[]
  customContextMenuItems?: CustomContextMenuItem[]
}

export type { CustomAction, CustomContextMenuItem, Editor, RichTextProps }

// Re-export ItemButton for convenience
export { ItemButton } from './EditorWithFloatingToolbar'

export default function RichText(props: RichTextProps) {
  const {
    id,
    value,
    onChange,
    error,
    onBlur,
    readOnly,
    placeholder = 'Tulis di sini...',
    className,
    customActions,
    customContextMenuItems
  } = props

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({ bulletList: false, orderedList: false, listItem: false }),
      TextStyle,
      FontFamilyExtension,
      FontSizeExtension,
      LineHeightExtension,
      LetterNumber,
      ImageExtension,
      StackingContextExtension,
      Placeholder.configure({ placeholder: placeholder }),
      Underline,
      TextAlign.configure({ types: ['heading', 'paragraph'], alignments: ['left', 'center', 'right', 'justify'] }),
      TabIndentExtension,
      ListItem.extend({
        addAttributes() {
          return {
            ...this.parent?.(),
            fontSize: {
              default: null,
              parseHTML: element => element.style.fontSize,
              renderHTML: attributes => {
                if (!attributes.fontSize) return {}
                return { style: `font-size: ${attributes.fontSize}` }
              }
            },
            // 🔥 TAMBAHKAN ATRIBUT BARU INI
            fontFamily: {
              default: null,
              parseHTML: element => element.style.fontFamily,
              renderHTML: attributes => {
                if (!attributes.fontFamily) return {}
                return { style: `font-family: ${attributes.fontFamily}` }
              }
            }
          }
        }
      }),
      BulletList.extend({
        addAttributes() {
          return {
            ...this.parent?.(),
            listType: {
              default: 'disc',
              parseHTML: element => element.getAttribute('data-list-type'),
              renderHTML: attributes => ({ 'data-list-type': attributes.listType })
            }
          }
        }
      }),
      OrderedList.extend({
        addAttributes() {
          return {
            ...this.parent?.(),
            orderStyle: {
              default: 'decimal',
              parseHTML: element => element.getAttribute('data-order-style'),
              renderHTML: attributes => ({ 'data-order-style': attributes.orderStyle })
            }
          }
        }
      }),

      Table.configure({ resizable: true, allowTableNodeSelection: true }).extend({
        addAttributes() {
          return {
            ...this.parent?.(),
            tableWidth: {
              default: null,
              parseHTML: element => {
                const table = element.querySelector('table')
                return table?.style.width || element.getAttribute('data-table-width') || null
              },
              renderHTML: attributes => {
                if (attributes.tableWidth) return { 'data-table-width': attributes.tableWidth }
                return {}
              }
            },
            borderColor: {
              default: null,
              parseHTML: element => element.getAttribute('data-border-color') || null,
              renderHTML: attributes => {
                if (attributes.borderColor) return { 'data-border-color': attributes.borderColor }
                return {}
              }
            },
            borderWidth: {
              default: null,
              parseHTML: element => element.getAttribute('data-border-width') || null,
              renderHTML: attributes => {
                if (attributes.borderWidth) return { 'data-border-width': attributes.borderWidth }
                return {}
              }
            }
          }
        }
      }),
      TableRow.extend({
        addAttributes() {
          return {
            ...this.parent?.(),
            backgroundColor: { default: null },
            borderColor: { default: null },
            borderWidth: { default: null }
          }
        },
        renderHTML({ HTMLAttributes }) {
          const styles: { [key: string]: string | null } = {}
          if (HTMLAttributes.backgroundColor) styles['background-color'] = HTMLAttributes.backgroundColor
          if (HTMLAttributes.borderColor) styles['border-color'] = HTMLAttributes.borderColor
          if (HTMLAttributes.borderWidth) styles['border-width'] = HTMLAttributes.borderWidth

          const existingStyle = HTMLAttributes.style || ''
          const newStyle = Object.entries(styles)
            .filter(([, value]) => value)
            .map(([key, value]) => `${key}: ${value};`)
            .join(' ')

          return ['tr', { ...HTMLAttributes, style: `${existingStyle} ${newStyle}`.trim() }, 0]
        }
      }),
      TableHeader.extend({
        addAttributes() {
          return {
            ...this.parent?.(),
            backgroundColor: {
              default: null,
              parseHTML: element => element.style.backgroundColor || null
            },
            borderColor: {
              default: '#e5e7eb',
              parseHTML: element => element.style.borderColor || null
            },
            borderWidth: {
              default: '1px',
              parseHTML: element => element.style.borderWidth || null
            },
            padding: {
              default: '8px',
              parseHTML: element => element.style.padding || null
            },
            textAlign: { default: null, parseHTML: element => element.style.textAlign || null },
            verticalAlign: { default: null, parseHTML: element => element.style.verticalAlign || null }
          }
        },
        renderHTML({ HTMLAttributes }) {
          const styles: { [key: string]: string | null } = {}
          if (HTMLAttributes.backgroundColor) styles['background-color'] = HTMLAttributes.backgroundColor
          if (HTMLAttributes.borderColor) styles['border-color'] = HTMLAttributes.borderColor
          if (HTMLAttributes.borderWidth) styles['border-width'] = HTMLAttributes.borderWidth
          if (HTMLAttributes.padding) styles['padding'] = HTMLAttributes.padding
          if (HTMLAttributes.textAlign) styles['text-align'] = HTMLAttributes.textAlign
          if (HTMLAttributes.verticalAlign) styles['vertical-align'] = HTMLAttributes.verticalAlign

          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { backgroundColor, borderColor, borderWidth, padding, textAlign, verticalAlign, ...restAttributes } =
            HTMLAttributes

          const existingStyle = restAttributes.style || ''
          const newStyle = Object.entries(styles)
            .filter(([, value]) => value)
            .map(([key, value]) => `${key}: ${value};`)
            .join(' ')

          return ['th', { ...restAttributes, style: `${existingStyle} ${newStyle}`.trim() }, 0]
        }
      }),
      TableCell.extend({
        addAttributes() {
          return {
            ...this.parent?.(),
            backgroundColor: {
              default: null,
              parseHTML: element => element.style.backgroundColor || null
            },
            borderColor: {
              default: '#e5e7eb',
              parseHTML: element => element.style.borderColor || null
            },
            borderWidth: {
              default: '1px',
              parseHTML: element => element.style.borderWidth || null
            },
            padding: {
              default: '8px',
              parseHTML: element => element.style.padding || null
            },
            textAlign: { default: null, parseHTML: element => element.style.textAlign || null },
            verticalAlign: { default: null, parseHTML: element => element.style.verticalAlign || null }
          }
        },
        renderHTML({ HTMLAttributes }) {
          const styles: { [key: string]: string | null } = {}
          if (HTMLAttributes.backgroundColor) styles['background-color'] = HTMLAttributes.backgroundColor
          if (HTMLAttributes.borderColor) styles['border-color'] = HTMLAttributes.borderColor
          if (HTMLAttributes.borderWidth) styles['border-width'] = HTMLAttributes.borderWidth
          if (HTMLAttributes.padding) styles['padding'] = HTMLAttributes.padding
          if (HTMLAttributes.textAlign) styles['text-align'] = HTMLAttributes.textAlign
          if (HTMLAttributes.verticalAlign) styles['vertical-align'] = HTMLAttributes.verticalAlign

          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { backgroundColor, borderColor, borderWidth, padding, textAlign, verticalAlign, ...restAttributes } =
            HTMLAttributes

          const existingStyle = restAttributes.style || ''
          const newStyle = Object.entries(styles)
            .filter(([, value]) => value)
            .map(([key, value]) => `${key}: ${value};`)
            .join(' ')

          return ['td', { ...restAttributes, style: `${existingStyle} ${newStyle}`.trim() }, 0]
        }
      }),
      Heading.configure({ levels: [1, 2, 3, 4, 5, 6] }),
      TextAlign.configure({ types: ['heading', 'paragraph'] })
    ],
    editable: !readOnly,
    content: value,
    onUpdate: ({ editor }) => {
      if (readOnly) return

      const html = editor.getHTML()
      const output = html === '<p></p>' ? '' : html
      if (output !== value) onChange?.(output)
    },
    onFocus: () => {},
    onBlur,
    editorProps: {
      attributes: {
        class: twMerge(
          'prose prose-slate max-w-none focus:outline-none min-h-[280px] p-4 text-slate-800 text-sm leading-relaxed',
          className
        )
      }
    }
  })

  useEffect(() => {
    if (!editor) return

    const editorContent = editor.getHTML()
    const isSame = value === editorContent || (value === '' && editorContent === '<p></p>')

    if (!isSame) editor.commands.setContent(value || '', { emitUpdate: false })
  }, [value, editor])

  if (!editor) return <div>Loading editor…</div>

  return (
    <div id={id} className='relative'>
      {readOnly ? (
        <PerseComponent data={value || ''} for_tiptap />
      ) : (
        <div
          className={twMerge(
            'w-full border border-slate-200 rounded-2xl bg-white shadow-xs focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100/80 transition flex flex-col overflow-hidden',
            error ? 'border-red-500 focus-within:border-red-500 focus-within:ring-red-100' : ''
          )}
        >
          <EditorWithFloatingToolbar
            editor={editor}
            customActions={customActions}
            customContextMenuItems={customContextMenuItems}
          >
            {(onClick, label, active) => (
              <ItemButton active={active} onMouseDown={e => e.preventDefault()} onClick={onClick}>
                {label}
              </ItemButton>
            )}
          </EditorWithFloatingToolbar>
        </div>
      )}
      {error && <p className='mt-1 text-xs ml-3 text-red-500'>{error}</p>}
    </div>
  )
}
