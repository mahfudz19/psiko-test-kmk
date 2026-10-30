import { Node } from '@tiptap/core'
import { mergeAttributes } from '@tiptap/core'
import { ReactNodeViewRenderer } from '@tiptap/react'
import { ImageNodeView } from '../EditorWithFloatingToolbar/Image/ImageNodeView'

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    image: {
      insertImage: (attrs: { src: string; alt?: string; title?: string }) => ReturnType
      setImageMode: (mode: 'inline' | 'freeMove') => ReturnType
      setImagePosition: (position: { x: number; y: number }) => ReturnType
      setImageZPosition: (zPosition: 'behind' | 'front') => ReturnType
      setImageAlign: (align: 'left' | 'center' | 'right' | null) => ReturnType
      setImageWrap: (wrap: 'left' | 'right' | null) => ReturnType
    }
  }
}

export const ImageExtension = Node.create({
  name: 'image',
  group: 'block',
  inline: false,
  atom: true,
  draggable: true,
  addAttributes() {
    return {
      src: {
        default: null,
        parseHTML: element => element.getAttribute('src'),
        renderHTML: attributes => (!attributes.src ? {} : { src: attributes.src })
      },
      alt: {
        default: null,
        parseHTML: element => element.getAttribute('alt'),
        renderHTML: attributes => (!attributes.alt ? {} : { alt: attributes.alt })
      },
      title: {
        default: null,
        parseHTML: element => element.getAttribute('title'),
        renderHTML: attributes => (!attributes.title ? {} : { title: attributes.title })
      },
      width: {
        default: 'auto',
        parseHTML: element => element.style.width || 'auto',
        renderHTML: attributes =>
          !attributes.width || attributes.width === 'auto' ? {} : { style: `width: ${attributes.width}` }
      },
      height: {
        default: 'auto',
        parseHTML: element => element.style.height || 'auto',
        renderHTML: attributes =>
          !attributes.height || attributes.height === 'auto' ? {} : { style: `height: ${attributes.height}` }
      },
      mode: {
        default: 'inline',
        parseHTML: element => element.getAttribute('data-mode') || 'inline',
        renderHTML: attributes => ({ 'data-mode': attributes.mode })
      },
      positionX: {
        default: null,
        parseHTML: element => {
          const x = element.getAttribute('data-position-x')
          return x ? parseFloat(x) : null
        },
        renderHTML: attributes => (!attributes.positionX ? {} : { 'data-position-x': attributes.positionX })
      },
      positionY: {
        default: null,
        parseHTML: element => {
          const y = element.getAttribute('data-position-y')
          return y ? parseFloat(y) : null
        },
        renderHTML: attributes => {
          if (!attributes.positionY) return {}
          return { 'data-position-y': attributes.positionY }
        }
      },
      zPosition: {
        default: 'front',
        parseHTML: element => element.getAttribute('data-z-position') || 'front',
        renderHTML: attributes => ({ 'data-z-position': attributes.zPosition })
      },
      align: {
        default: null,
        parseHTML: element => element.getAttribute('data-align') || null,
        renderHTML: attributes => (!attributes.align ? {} : { 'data-align': attributes.align })
      },
      wrap: {
        default: null,
        parseHTML: element => element.getAttribute('data-wrap') || null,
        renderHTML: attributes => (!attributes.wrap ? {} : { 'data-wrap': attributes.wrap })
      }
    }
  },

  parseHTML() {
    return [{ tag: 'img[src]' }]
  },

  renderHTML({ HTMLAttributes, node }) {
    const { mode, positionX, positionY, zPosition } = node.attrs

    if (mode !== 'freeMove' || positionX == null || positionY == null) {
      return ['img', mergeAttributes(HTMLAttributes, { draggable: false })]
    }

    const existingStyle = HTMLAttributes.style || ''
    const zIndex = zPosition === 'behind' ? 0 : 10
    const freeMoveStyle = `position: absolute; left: ${positionX}px; top: ${positionY}px; z-index: ${zIndex};`

    return [
      'div',
      { style: 'position: relative; line-height: 0; vertical-align: top;' },
      ['img', mergeAttributes(HTMLAttributes, { style: `${existingStyle} ${freeMoveStyle}`.trim(), draggable: false })]
    ]
  },

  addNodeView() {
    return ReactNodeViewRenderer(ImageNodeView)
  },

  addCommands() {
    return {
      insertImage:
        attrs =>
        ({ commands }) =>
          commands.insertContent({ type: this.name, attrs }),
      setImageMode:
        mode =>
        ({ commands, state }) => {
          const { selection } = state
          const node = state.doc.nodeAt(selection.from)
          if (node?.type.name === this.name) return commands.updateAttributes(this.name, { mode })

          return false
        },
      setImagePosition:
        position =>
        ({ commands, state }) => {
          const { selection } = state
          const node = state.doc.nodeAt(selection.from)
          if (node?.type.name === this.name)
            return commands.updateAttributes(this.name, { positionX: position.x, positionY: position.y })
          return false
        },
      setImageZPosition:
        zPosition =>
        ({ commands, state }) => {
          const { selection } = state
          const node = state.doc.nodeAt(selection.from)
          if (node?.type.name === this.name) return commands.updateAttributes(this.name, { zPosition })

          return false
        },
      setImageAlign:
        align =>
        ({ commands, state }) => {
          const { selection } = state
          const node = state.doc.nodeAt(selection.from)
          if (node?.type.name === this.name) return commands.updateAttributes(this.name, { align })

          return false
        },
      setImageWrap:
        wrap =>
        ({ commands, state }) => {
          const { selection } = state
          const node = state.doc.nodeAt(selection.from)
          if (node?.type.name === this.name) return commands.updateAttributes(this.name, { wrap })

          return false
        }
    }
  }
})
