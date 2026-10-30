import IconDoc from '@/components/ui/Icon/IconDoc'
import IconExcel from '@/components/ui/Icon/IconExcel'
import IconOds from '@/components/ui/Icon/IconOds'
import IconOdt from '@/components/ui/Icon/IconOdt'
import IconPDF from '@/components/ui/Icon/IconPDF'
import IconPowerPoint from '@/components/ui/Icon/IconPowerPoint'
import IconPpt from '@/components/ui/Icon/IconPpt'
import IconRtf from '@/components/ui/Icon/IconRtf'
import IconTxt from '@/components/ui/Icon/IconTxt'
import IconWord from '@/components/ui/Icon/IconWord'
import IconXls from '@/components/ui/Icon/IconXls'

export const commonMimeTypes = [
  // Dokumen
  { type: 'PDF', extensions: ['.pdf'], mime: 'application/pdf', icon: <IconPDF fontSize={56} color='error' /> },
  {
    type: 'Microsoft Word',
    extensions: ['.doc'],
    mime: 'application/msword',
    icon: <IconDoc fontSize={56} color='primary' />
  },
  {
    type: 'Microsoft Word (modern)',
    extensions: ['.docx'],
    mime: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    icon: <IconWord fontSize={56} color='primary' />
  },
  {
    type: 'Microsoft Excel',
    extensions: ['.xls'],
    mime: 'application/vnd.ms-excel',
    icon: <IconXls fontSize={56} color='primary' />
  },
  {
    type: 'Microsoft Excel (modern)',
    extensions: ['.xlsx'],
    mime: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    icon: <IconExcel fontSize={56} color='success' />
  },
  {
    type: 'Microsoft PowerPoint',
    extensions: ['.ppt'],
    mime: 'application/vnd.ms-powerpoint',
    icon: <IconPpt fontSize={56} color='error' />
  },
  {
    type: 'Microsoft PowerPoint (modern)',
    extensions: ['.pptx'],
    mime: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    icon: <IconPowerPoint fontSize={56} color='error' />
  },
  { type: 'Text File', extensions: ['.txt'], mime: 'text/plain', icon: <IconTxt fontSize={56} /> },
  { type: 'Rich Text Format', extensions: ['.rtf'], mime: 'application/rtf', icon: <IconRtf fontSize={56} /> },
  {
    type: 'OpenDocument Text',
    extensions: ['.odt'],
    mime: 'application/vnd.oasis.opendocument.text',
    icon: <IconOdt fontSize={56} />
  },
  {
    type: 'OpenDocument Spreadsheet',
    extensions: ['.ods'],
    mime: 'application/vnd.oasis.opendocument.spreadsheet',
    icon: <IconOds fontSize={56} />
  },

  // Gambar
  { type: 'JPEG Image', extensions: ['.jpeg', '.jpg'], mime: 'image/jpeg', icon: 'image' },
  { type: 'PNG Image', extensions: ['.png'], mime: 'image/png', icon: 'image' },
  { type: 'GIF Image', extensions: ['.gif'], mime: 'image/gif', icon: 'image' },
  { type: 'BMP Image', extensions: ['.bmp'], mime: 'image/bmp', icon: 'image' },
  { type: 'TIFF Image', extensions: ['.tiff', '.tif'], mime: 'image/tiff', icon: 'image' },
  { type: 'WebP Image', extensions: ['.webp'], mime: 'image/webp', icon: 'image' },
  { type: 'SVG Image', extensions: ['.svg'], mime: 'image/svg+xml', icon: 'image' },

  // Video
  { type: 'MP4 Video', extensions: ['.mp4'], mime: 'video/mp4', icon: '🎥' },
  { type: 'AVI Video', extensions: ['.avi'], mime: 'video/x-msvideo', icon: '🎥' },
  { type: 'WMV Video', extensions: ['.wmv'], mime: 'video/x-ms-wmv', icon: '🎥' },
  { type: 'MOV Video', extensions: ['.mov'], mime: 'video/quicktime', icon: '🎥' },
  { type: 'FLV Video', extensions: ['.flv'], mime: 'video/x-flv', icon: '🎥' },
  { type: 'MKV Video', extensions: ['.mkv'], mime: 'video/x-matroska', icon: '🎥' },
  { type: 'WebM Video', extensions: ['.webm'], mime: 'video/webm', icon: '🎥' },

  // Audio
  { type: 'MP3 Audio', extensions: ['.mp3'], mime: 'audio/mpeg', icon: '🎵' },
  { type: 'WAV Audio', extensions: ['.wav'], mime: 'audio/wav', icon: '🎵' },
  { type: 'OGG Audio', extensions: ['.ogg'], mime: 'audio/ogg', icon: '🎵' },
  { type: 'AAC Audio', extensions: ['.aac'], mime: 'audio/aac', icon: '🎵' },
  { type: 'MIDI Audio', extensions: ['.midi', '.mid'], mime: 'audio/midi', icon: '🎵' },

  // Arsip dan Kompresi
  { type: 'ZIP Archive', extensions: ['.zip'], mime: 'application/zip', icon: '📦' },
  { type: 'RAR Archive', extensions: ['.rar'], mime: 'application/vnd.rar', icon: '📦' },
  { type: '7-Zip Archive', extensions: ['.7z'], mime: 'application/x-7z-compressed', icon: '📦' },
  { type: 'TAR Archive', extensions: ['.tar'], mime: 'application/x-tar', icon: '📦' },
  { type: 'GZ (Gzip)', extensions: ['.gz'], mime: 'application/gzip', icon: '📦' },

  // Lainnya
  { type: 'JSON', extensions: ['.json'], mime: 'application/json', icon: '💾' },
  { type: 'CSV', extensions: ['.csv'], mime: 'text/csv', icon: '📈' },
  { type: 'XML', extensions: ['.xml'], mime: 'application/xml', icon: '💾' },
  { type: 'HTML', extensions: ['.html', '.htm'], mime: 'text/html', icon: '🌐' },
  { type: 'Markdown', extensions: ['.md'], mime: 'text/markdown', icon: '📝' }
]
