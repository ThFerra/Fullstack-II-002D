type ButtonProps = {
  children: React.ReactNode
  variant?: 'primary' | 'secondary' | 'outline-secondary' | 'danger'
  type?: 'button' | 'submit' | 'reset'
  onClick?: () => void
  className?: string
  disabled?: boolean
}

export function Button({ children, variant = 'primary', type = 'button', onClick, className = '', disabled = false }: ButtonProps) {
  return (
    <button type={type} className={`btn btn-${variant} ${className}`.trim()} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  )
}
