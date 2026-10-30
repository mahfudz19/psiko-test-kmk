import { Extension } from '@tiptap/core'

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    setLineHeight: (attributes: { lineHeight?: string; marginTop?: string; marginBottom?: string }) => ReturnType
    unsetLineHeight: () => ReturnType
  }
}

export const LineHeightExtension = Extension.create({
  name: 'lineHeight',

  addOptions() {
    return {
      types: ['heading', 'paragraph']
    }
  },

  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          lineHeight: {
            default: null,
            parseHTML: element => element.style.lineHeight,
            renderHTML: attributes => {
              if (!attributes.lineHeight) return {}
              return { style: `line-height: ${attributes.lineHeight}` }
            }
          },
          marginTop: {
            default: null,
            parseHTML: element => element.style.marginTop,
            renderHTML: attributes => {
              if (!attributes.marginTop) return {}
              return { style: `margin-top: ${attributes.marginTop}` }
            }
          },
          marginBottom: {
            default: null,
            parseHTML: element => element.style.marginBottom,
            renderHTML: attributes => {
              if (!attributes.marginBottom) return {}
              return { style: `margin-bottom: ${attributes.marginBottom}` }
            }
          }
        }
      }
    ]
  },

  addCommands() {
    return {
      setLineHeight:
        attributes =>
        ({ chain }) => {
          return this.options.types.reduce((chain, type) => chain.updateAttributes(type, attributes), chain()).run()
        },
      unsetLineHeight:
        () =>
        ({ chain }) => {
          return this.options.types
            .reduce(
              (chain, type) =>
                chain.updateAttributes(type, {
                  lineHeight: null,
                  marginTop: null,
                  marginBottom: null
                }),
              chain()
            )
            .run()
        }
    }
  }
})
