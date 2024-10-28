import useBaseUrl from '@docusaurus/useBaseUrl'
import DonateButton from './DonateButton'
import styles from './Donate.module.css'

export default function DonateButtons(): JSX.Element {
  return (
    <div className={styles.DonateButtons}>
      <DonateButton
        service="PayPal"
        href="https://www.paypal.com/donate/?hosted_button_id=PCA9AWGFEW7KU"
        img={useBaseUrl('/img/paypal.png')}
        color={'#009cde'}
        openInNewTab
      />
      <DonateButton
        service="Bitcoin"
        href={useBaseUrl('/donate/bitcoin')}
        img={useBaseUrl('/img/bitcoin.png')}
        color={'#f6931a'}
      />
      <DonateButton
        service="Buy Me A Coffee"
        href="https://www.buymeacoffee.com/hansifer"
        img={useBaseUrl('/img/buymeacoffee.png')}
        color={'#8b4513'}
        openInNewTab
      />
    </div>
  )
}
