import { Extension } from '@tiptap/core'

// --- TAMBAHKAN BLOK INI ---
// Ini memberitahu TypeScript tentang perintah baru Anda.
declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    tabIndent: {
      /**
       * Indent the current selection
       */
      indent: () => ReturnType
      /**
       * Outdent the current selection
       */
      outdent: () => ReturnType
    }
  }
}
// --- AKHIR BLOK TAMBAHAN ---

export interface TabIndentOptions {
  indentSize: string
  maxIndentLevel: number
}

export const TabIndentExtension = Extension.create<TabIndentOptions>({
  name: 'tabIndent',

  addOptions() {
    return {
      indentSize: '2.5cm', // Ukuran indentasi per level
      maxIndentLevel: 10 // Maksimal level indentasi
    }
  },

  addGlobalAttributes() {
    return [
      {
        types: ['paragraph', 'heading', 'listItem'],
        attributes: {
          indentLevel: {
            default: 0,
            parseHTML: element => {
              const indentLevel = element.getAttribute('data-indent-level')
              return indentLevel ? parseInt(indentLevel, 10) : 0
            },
            renderHTML: attributes => {
              if (!attributes.indentLevel || attributes.indentLevel === 0) {
                return {}
              }
              return {
                'data-indent-level': attributes.indentLevel,
                style: `margin-left: calc(${attributes.indentLevel} * ${this.options.indentSize})`
              }
            }
          }
        }
      }
    ]
  },

  addCommands() {
    return {
      indent:
        () =>
        ({ tr, state, dispatch }) => {
          const { selection } = state
          const { $from, $to } = selection

          // Dapatkan semua block nodes dalam selection
          const blockNodes: Array<{ node: any; pos: number }> = []

          state.doc.nodesBetween($from.pos, $to.pos, (node, pos) => {
            if (node.isBlock && ['paragraph', 'heading', 'listItem'].includes(node.type.name)) {
              blockNodes.push({ node, pos })
            }
          })

          if (blockNodes.length === 0) return false

          if (dispatch) {
            blockNodes.forEach(({ node, pos }) => {
              const currentLevel = node.attrs.indentLevel || 0
              if (currentLevel < this.options.maxIndentLevel) {
                tr.setNodeMarkup(pos, undefined, {
                  ...node.attrs,
                  indentLevel: currentLevel + 1
                })
              }
            })
          }

          return true
        },

      outdent:
        () =>
        ({ tr, state, dispatch }) => {
          const { selection } = state
          const { $from, $to } = selection

          // Dapatkan semua block nodes dalam selection
          const blockNodes: Array<{ node: any; pos: number }> = []

          state.doc.nodesBetween($from.pos, $to.pos, (node, pos) => {
            if (node.isBlock && ['paragraph', 'heading', 'listItem'].includes(node.type.name)) {
              blockNodes.push({ node, pos })
            }
          })

          if (blockNodes.length === 0) return false

          if (dispatch) {
            blockNodes.forEach(({ node, pos }) => {
              const currentLevel = node.attrs.indentLevel || 0
              if (currentLevel > 0) {
                tr.setNodeMarkup(pos, undefined, {
                  ...node.attrs,
                  indentLevel: currentLevel - 1
                })
              }
            })
          }

          return true
        }
    }
  },

  addKeyboardShortcuts() {
    return {
      Tab: () => {
        // Hanya jalankan indent jika tidak di dalam list
        const { state } = this.editor
        const { $from } = state.selection

        // Cek apakah cursor berada di dalam list
        const inList =
          $from.node(-1)?.type.name === 'listItem' ||
          $from.node(-2)?.type.name === 'bulletList' ||
          $from.node(-2)?.type.name === 'orderedList'

        if (inList) {
          // Biarkan TipTap menangani tab di dalam list (untuk nested list)
          return false
        }

        return this.editor.commands.indent()
      },
      'Shift-Tab': () => {
        // Sama seperti Tab, hanya jalankan outdent jika tidak di dalam list
        const { state } = this.editor
        const { $from } = state.selection

        const inList =
          $from.node(-1)?.type.name === 'listItem' ||
          $from.node(-2)?.type.name === 'bulletList' ||
          $from.node(-2)?.type.name === 'orderedList'

        if (inList) {
          return false
        }

        return this.editor.commands.outdent()
      }
    }
  }
})
