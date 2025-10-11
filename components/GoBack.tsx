import { SvgIcon } from "@/components/SvgIcon"

interface Props {
  className?: string
  onClick?: () => void
}

export function GoBack ({ className, onClick }: Props) {
  return (
    <button 
      className={`flex gap-2 text-sm items-center text-[var(--kx-text-2)] cursor-pointer ${className || ''}`}
      onClick={onClick}
    >
      <SvgIcon className="h-4 w-4" icon="icon-left" /> 返回
    </button>
  )
}