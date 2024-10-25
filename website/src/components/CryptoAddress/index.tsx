import useBaseUrl from '@docusaurus/useBaseUrl'
import styles from './styles.module.css'

export default function CryptoAddress({
  currency,
  address,
  qrCode,
  className,
}: {
  currency: string
  address?: string
  qrCode?: string
  className?: string
}): JSX.Element {
  return (
    <div className={className}>
      <div className={styles.CryptoAddress}>
        <h3>{currency}</h3>
        {qrCode ? (
          <img
            alt={`${currency} QR code`}
            src={useBaseUrl(qrCode)}
          />
        ) : null}
        {address ? <code>{address}</code> : null}
      </div>
    </div>
  )
}
