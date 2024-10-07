import { useColorMode } from '@docusaurus/theme-common'
import styles from './styles.module.css'

export default function Screenshot(): JSX.Element {
  const { colorMode } = useColorMode()

  return (
    <div className={styles.screenshotContainer}>
      <img
        className={styles.screenshot}
        src={colorMode === 'dark' ? '/img/popup-dark.png' : '/img/popup-light.png'}
        alt="Popup"
      />
    </div>
  )
}
