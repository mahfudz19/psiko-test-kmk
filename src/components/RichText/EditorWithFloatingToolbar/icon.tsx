const AlignLeftIcon: React.FC<React.SVGProps<SVGSVGElement>> = props => (
  <svg
    width={20}
    height={20}
    viewBox='0 0 24 24'
    fill='none'
    stroke='currentColor'
    strokeWidth={2}
    strokeLinecap='round'
    strokeLinejoin='round'
    aria-hidden='true'
    {...props}
  >
    <line x1='3' x2='17' y1='6' y2='6' />
    <line x1='3' x2='21' y1='11' y2='11' />
    <line x1='3' x2='17' y1='16' y2='16' />
    <line x1='3' x2='13' y1='21' y2='21' />
  </svg>
)

const AlignCenterIcon: React.FC<React.SVGProps<SVGSVGElement>> = props => (
  <svg
    width={20}
    height={20}
    viewBox='0 0 24 24'
    fill='none'
    stroke='currentColor'
    strokeWidth={2}
    strokeLinecap='round'
    strokeLinejoin='round'
    aria-hidden='true'
    {...props}
  >
    <line x1='7' x2='17' y1='6' y2='6' />
    <line x1='3' x2='21' y1='11' y2='11' />
    <line x1='7' x2='17' y1='16' y2='16' />
    <line x1='8' x2='16' y1='21' y2='21' />
  </svg>
)

const AlignRightIcon: React.FC<React.SVGProps<SVGSVGElement>> = props => (
  <svg
    width={20}
    height={20}
    viewBox='0 0 24 24'
    fill='none'
    stroke='currentColor'
    strokeWidth={2}
    strokeLinecap='round'
    strokeLinejoin='round'
    aria-hidden='true'
    {...props}
  >
    <line x1='11' x2='21' y1='6' y2='6' />
    <line x1='3' x2='21' y1='11' y2='11' />
    <line x1='11' x2='21' y1='16' y2='16' />
    <line x1='15' x2='21' y1='21' y2='21' />
  </svg>
)

const AlignJustifyIcon: React.FC<React.SVGProps<SVGSVGElement>> = props => (
  <svg
    width={20}
    height={20}
    viewBox='0 0 24 24'
    fill='none'
    stroke='currentColor'
    strokeWidth={2}
    strokeLinecap='round'
    strokeLinejoin='round'
    aria-hidden='true'
    {...props}
  >
    <line x1='3' x2='21' y1='6' y2='6' />
    <line x1='3' x2='21' y1='11' y2='11' />
    <line x1='3' x2='21' y1='16' y2='16' />
    <line x1='3' x2='21' y1='21' y2='21' />
  </svg>
)

const BoldIcon: React.FC<React.SVGProps<SVGSVGElement>> = props => (
  <svg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 24 24' {...props}>
    <path
      fill='none'
      stroke='currentColor'
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth='2'
      d='M7 5h6a3.5 3.5 0 0 1 0 7H7zm6 7h1a3.5 3.5 0 0 1 0 7H7v-7'
    />
  </svg>
)

const ItalicIcon: React.FC<React.SVGProps<SVGSVGElement>> = props => (
  <svg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 24 24' {...props}>
    <path
      fill='none'
      stroke='currentColor'
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth='2'
      d='M11 5h6M7 19h6m1-14l-4 14'
    />
  </svg>
)

const UnderlineIcon: React.FC<React.SVGProps<SVGSVGElement>> = props => (
  <svg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 24 24' {...props}>
    <g fill='none'>
      <path d='m12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035q-.016-.005-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093q.019.005.029-.008l.004-.014l-.034-.614q-.005-.018-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z' />
      <path
        fill='currentColor'
        d='M18 19a1 1 0 0 1 .117 1.993L18 21H6a1 1 0 0 1-.117-1.993L6 19zM17 3a1 1 0 0 1 .993.883L18 4v8a6 6 0 0 1-11.996.225L6 12V4a1 1 0 0 1 1.993-.117L8 4v8a4 4 0 0 0 7.995.2L16 12V4a1 1 0 0 1 1-1'
      />
    </g>
  </svg>
)

const LinkIcon: React.FC<React.SVGProps<SVGSVGElement>> = props => (
  <svg xmlns='http://www.w3.org/2000/svg' width='23' height='23' viewBox='0 0 24 24' {...props}>
    <path
      fill='currentColor'
      d='M11 17H7q-2.075 0-3.537-1.463T2 12t1.463-3.537T7 7h4v2H7q-1.25 0-2.125.875T4 12t.875 2.125T7 15h4zm-3-4v-2h8v2zm5 4v-2h4q1.25 0 2.125-.875T20 12t-.875-2.125T17 9h-4V7h4q2.075 0 3.538 1.463T22 12t-1.463 3.538T17 17z'
    />
  </svg>
)

const UnlinkIcon: React.FC<React.SVGProps<SVGSVGElement>> = props => (
  <svg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 512 512' {...props}>
    <path
      fill='none'
      stroke='currentColor'
      strokeLinecap='square'
      strokeLinejoin='round'
      strokeWidth='48'
      d='M200.66 352H144a96 96 0 0 1 0-192h55.41m113.18 0H368a96 96 0 0 1 0 192h-56.66'
    />
  </svg>
)

const ClearIcon: React.FC<React.SVGProps<SVGSVGElement>> = props => (
  <svg xmlns='http://www.w3.org/2000/svg' width='18' height='18' viewBox='0 0 24 24' {...props}>
    <path
      fill='none'
      stroke='currentColor'
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth='2.5'
      d='m17 15l4 4m0-4l-4 4M7 6V5h11v1M7 19h4m2-14L9 19'
    />
  </svg>
)

const IconImage: React.FC<React.SVGProps<SVGSVGElement>> = props => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width='20'
    height='20'
    viewBox='0 0 24 24'
    fill='none'
    stroke='currentColor'
    strokeWidth='2'
    strokeLinecap='round'
    strokeLinejoin='round'
    aria-hidden='true'
    {...props}
  >
    <rect x='3' y='3' width='18' height='18' rx='2' ry='2' />
    <circle cx='8.5' cy='8.5' r='1.5' />
    <polyline points='21 15 16 10 5 21' />
  </svg>
)

export {
  AlignLeftIcon,
  AlignCenterIcon,
  AlignRightIcon,
  AlignJustifyIcon,
  BoldIcon,
  ItalicIcon,
  UnderlineIcon,
  LinkIcon,
  UnlinkIcon,
  ClearIcon,
  IconImage
}
