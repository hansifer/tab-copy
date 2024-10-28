import useBaseUrl from '@docusaurus/useBaseUrl'
import styles from './styles.module.css'

// todo: click to copy address to clipboard

export default function CryptoAddress({
  currency,
  address,
  qrCode,
  showHeader,
  className,
}: {
  currency: string
  address?: string
  qrCode?: string
  showHeader?: boolean
  className?: string
}): JSX.Element {
  return (
    <div className={className}>
      <div className={styles.CryptoAddress}>
        {showHeader ? <h3>{currency}</h3> : null}
        {qrCode ? (
          <img
            alt={`${currency} QR code`}
            src={useBaseUrl(qrCode)}
          />
        ) : null}
        {address ? (
          <div className={styles.address}>
            <strong>Address:</strong>
            <code>{address}</code>
          </div>
        ) : null}
      </div>
    </div>
  )
}
