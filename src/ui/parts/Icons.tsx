// Small stroke icons, drawn inline so they take the text colour.
type IconProps = { size?: number; className?: string }

const base = (size: number) => ({
  width: size,
  height: size,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.6,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true,
})

export function FlameIcon({ size = 18, className }: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <path d="M12 3c1 3.5 5 5.5 5 10a5 5 0 0 1-10 0c0-2.4 1.2-3.8 2.4-5 .2 1.6.9 2.7 2 3.2C11 9 11.3 6 12 3z" />
    </svg>
  )
}

export function SkullIcon({ size = 18, className }: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <path d="M5 11a7 7 0 1 1 14 0v3l-2 1v3H7v-3l-2-1z" />
      <circle cx="9.5" cy="11.5" r="1.4" />
      <circle cx="14.5" cy="11.5" r="1.4" />
      <path d="M11 18v-2M13 18v-2" />
    </svg>
  )
}

export function SoulIcon({ size = 18, className }: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <path d="M12 21c-3.5 0-6-2.4-6-5.6 0-3 2.2-4.4 3.4-6.9.4 1.4 1.2 2.2 2.1 2.6-.3-2.8.7-5.4 2.6-8.1.6 3.6 3.9 6 3.9 10.6 0 4.6-2.5 7.4-6 7.4z" />
    </svg>
  )
}

export function BackIcon({ size = 18, className }: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <path d="M15 5l-7 7 7 7" />
    </svg>
  )
}

export function CheckIcon({ size = 16, className }: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <path d="M5 12.5l4.5 4.5L19 7.5" />
    </svg>
  )
}

export function CrossIcon({ size = 16, className }: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  )
}

export function UpIcon({ size = 16, className }: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <path d="M6 15l6-6 6 6" />
    </svg>
  )
}

export function DownIcon({ size = 16, className }: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <path d="M6 9l6 6 6-6" />
    </svg>
  )
}

export function SwordIcon({ size = 18, className }: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <path d="M14.5 4H20v5.5L10 19.5 4.5 14z" />
      <path d="M7 12l5 5M4 20l2.5-2.5" />
    </svg>
  )
}
