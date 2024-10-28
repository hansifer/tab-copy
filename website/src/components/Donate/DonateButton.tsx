import styles from './Donate.module.css'

export default function DonateButton({
  service,
  href,
  img,
  color,
  openInNewTab,
}: {
  service: string
  href: string
  img: string
  color: string
  openInNewTab?: boolean
}): JSX.Element {
  return (
    <a
      className={styles.DonateButton}
      href={href}
      target={openInNewTab ? '_blank' : '_self'}
      style={{
        backgroundColor: color,
      }}
    >
      <img
        alt={`Donate with ${service}`}
        src={img}
      />
    </a>
  )
}
