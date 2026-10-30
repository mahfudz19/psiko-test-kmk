import { Extension } from '@tiptap/core'

/**
 * Ekstensi ini menerapkan style `position: relative` dan `z-index: 1`
 * ke semua node blok teks. Ini menciptakan "stacking context" baru untuk setiap
 * elemen, memungkinkan gambar dengan `z-index: 0` muncul di belakang teks
 * tanpa menjadi tidak terlihat.
 */
export const StackingContextExtension = Extension.create({
  name: 'stackingContext',

  addOptions() {
    return {
      // Terapkan ke semua node yang bisa berisi teks atau gambar
      types: ['paragraph', 'heading', 'listItem', 'tableCell', 'tableHeader', 'blockquote']
    }
  },

  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          // Atribut ini tidak disimpan, hanya digunakan untuk menerapkan style saat render
          'data-stacking-context': {
            default: null,
            // Tidak perlu parse, karena kita hanya ingin menerapkan style
            parseHTML: () => null,
            // Terapkan style secara paksa saat render HTML
            renderHTML: attributes => {
              // Gabungkan dengan style yang sudah ada jika ada
              const existingStyle = attributes.style || ''
              return {
                style: `position: relative; z-index: 1; ${existingStyle}`.trim()
              }
            }
          }
        }
      }
    ]
  }
})
