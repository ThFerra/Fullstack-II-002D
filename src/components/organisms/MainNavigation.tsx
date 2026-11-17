type NavItem = {
  label: string
  onClick: () => void
}

type MainNavigationProps = {
  items: NavItem[]
}

export function MainNavigation({ items }: MainNavigationProps) {
  return (
    <nav className="main-nav navbar-nav flex-row flex-wrap" aria-label="Navegación principal">
      {items.map((item) => (
        <button type="button" key={item.label} className="nav-link" onClick={item.onClick}>
          {item.label}
        </button>
      ))}
    </nav>
  )
}
