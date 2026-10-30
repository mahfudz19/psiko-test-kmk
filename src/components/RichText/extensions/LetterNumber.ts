import { Mark } from '@tiptap/core'

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    letterNumber: {
      setLetterNumber: (attrs: { id?: string }) => ReturnType
      unsetLetterNumber: () => ReturnType
    }
  }
}

export const LetterNumber = Mark.create({
  name: 'letterNumber',

  addAttributes() {
    return {
      id: { default: null }
    }
  },

  parseHTML() {
    return [{ tag: 'span[data-letter-number]' }, { tag: 'span[id]' }]
  },

  renderHTML({ HTMLAttributes }) {
    const attrs = { ...HTMLAttributes, 'data-letter-number': 'true' }
    return ['span', attrs, 0]
  },

  addCommands() {
    return {
      setLetterNumber:
        attrs =>
        ({ chain }) => {
          // jalankan chain dan kembalikan boolean
          return chain().setMark(this.name, attrs).run()
        },
      unsetLetterNumber:
        () =>
        ({ chain }) => {
          return chain().setMark(this.name, { id: null }).run()
        }
    }
  }
})
