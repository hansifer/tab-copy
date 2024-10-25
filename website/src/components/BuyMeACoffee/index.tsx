import styles from './styles.module.css'

export default function BuyMeACoffee({
  username,
  className,
}: {
  username: string
  className?: string
}): JSX.Element {
  return (
    <div className={className}>
      <div className={styles.BuyMeACoffee}>
        <a
          href={`https://www.buymeacoffee.com/${username}`}
          target="_blank"
        >
          <img
            alt="Buy Me A Coffee"
            src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png"
          />
        </a>
      </div>
    </div>
  )
}
