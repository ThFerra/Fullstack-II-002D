type ButtonProps = {
  children: React.ReactNode
  variant?: 'primary' | 'secondary' | 'outline-secondary'
  type?: 'button' | 'submit' | 'reset'
  onClick?: () => void
  className?: string
}

export function Button({ children, variant = 'primary', type = 'button', onClick, className = '' }: ButtonProps) {
  return (
    <button type={type} className={`btn btn-${variant} ${className}`.trim()} onClick={onClick}>
      {children}
    </button>
  )
}
