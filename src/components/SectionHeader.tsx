type SectionHeaderProps = {
  eyebrow: string
  title: string
}

export function SectionHeader({ eyebrow, title }: SectionHeaderProps) {
  return (
    <div className="section-heading">
      <p className="eyebrow">{eyebrow}</p>
      <h2>{title}</h2>
    </div>
  )
}
