import parse from 'html-react-parser'
import { twMerge } from 'tailwind-merge'
import style from './unreset.module.css'

export const ensureEmptyParagraphsHaveHeight = (htmlString: string): string => {
  return htmlString.replace(/<p([^>]*)>\s*<\/p>/g, '<p$1>&nbsp;</p>')
}

export const applyTableStylesToHtml = (htmlString: string): string => {
  const parser = new DOMParser()
  const doc = parser.parseFromString(htmlString, 'text/html')

  // Cari semua elemen <table>
  const tables = doc.querySelectorAll('table')

  tables.forEach(table => {
    // 1. Ambil atribut 'data-table-width' dari elemen <table>
    const tableWidth = table.getAttribute('data-table-width')

    // 2. Jika atribut ada, terapkan sebagai inline style 'width'
    if (tableWidth) {
      table.style.width = tableWidth
    }

    // 3. Pastikan table dibungkus oleh .tableWrapper
    if (!table.parentElement?.classList.contains('tableWrapper')) {
      const wrapper = document.createElement('div')
      wrapper.className = 'tableWrapper'

      // Pindahkan table ke dalam wrapper
      table.parentNode?.insertBefore(wrapper, table)
      wrapper.appendChild(table)
    }
  })

  return doc.body.innerHTML
}

export const applyImageStylesToHtml = (htmlString: string): string => {
  const parser = new DOMParser()
  const doc = parser.parseFromString(htmlString, 'text/html')

  // Cari semua elemen <img>
  const images = doc.querySelectorAll('img')

  images.forEach(img => {
    const align = img.getAttribute('data-align')
    const wrap = img.getAttribute('data-wrap')
    const mode = img.getAttribute('data-mode')

    // Hanya proses gambar dalam mode 'inline' (bukan 'freeMove')
    if (mode === 'inline' || !mode) {
      if (mode) img.style.display = mode
      if (wrap) {
        // Handle Text Wrapping menggunakan float
        img.style.float = wrap
        // Tambahkan margin agar teks tidak menempel
        if (wrap === 'left') {
          img.style.marginRight = '1em'
          img.style.marginBottom = '0.5em'
        } else if (wrap === 'right') {
          img.style.marginLeft = '1em'
          img.style.marginBottom = '0.5em'
        }
      } else if (align) {
        // Handle Alignment (memerlukan wrapper block-level)
        const parent = img.parentElement
        if (parent && parent.tagName.toLowerCase() === 'p') {
          // Jika sudah di dalam <p>, terapkan text-align ke parent
          parent.style.textAlign = align
        } else {
          // Jika tidak, bungkus dengan <p> dan terapkan text-align
          const wrapper = document.createElement('p')
          wrapper.style.textAlign = align
          img.parentNode?.insertBefore(wrapper, img)
          wrapper.appendChild(img)
        }
      }
    }
  })

  return doc.body.innerHTML
}

export interface PerseComponentProps {
  data: string
  unresetTailwind?: boolean
  className?: string
  for_tiptap?: boolean
  component?: any
}
function PerseComponent(props: PerseComponentProps) {
  const { data, unresetTailwind, className, component: Component = 'div', for_tiptap } = props
  if (for_tiptap) {
    const withEmptyParagraphs = ensureEmptyParagraphsHaveHeight(data)
    const withTableStyles = applyTableStylesToHtml(withEmptyParagraphs)
    const finalMainContent = applyImageStylesToHtml(withTableStyles)

    return (
      <Component className={twMerge(unresetTailwind && style.unreset, className)} data-tiptap-element='true'>
        {parse(finalMainContent)}
      </Component>
    )
  }

  return <Component className={twMerge(unresetTailwind && style.unreset, className)}>{parse(data)}</Component>
}

export default PerseComponent
