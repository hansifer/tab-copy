import ThemedImage from '@theme/ThemedImage'
import useBaseUrl from '@docusaurus/useBaseUrl'
import styles from './styles.module.css'

export default function Screenshot(): JSX.Element {
  return (
    <div className={styles.screenshotContainer}>
      <ThemedImage
        className={styles.screenshot}
        sources={{
          light: useBaseUrl('/img/popup-light.png'),
          dark: useBaseUrl('/img/popup-dark.png'),
        }}
        alt="Popup"
      />
    </div>
  )
}
