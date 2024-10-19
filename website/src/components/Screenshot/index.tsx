import { useEffect } from 'react'
import ThemedImage from '@theme/ThemedImage'
import useBaseUrl from '@docusaurus/useBaseUrl'
import styles from './styles.module.css'

// popup screenshot with rotating format selection

export default function Screenshot({ className }: { className: string }): JSX.Element {
  useEffect(() => {
    const interval = setInterval(() => {
      const selectedFormatOverlays = Array.from(
        document.querySelectorAll(`.${styles.selectedFormat}`),
      ) as HTMLImageElement[]

      // get idx of currently-visible image and reset all to hidden

      let visibleIdx = 0
      for (let i = 0; i < selectedFormatOverlays.length; i++) {
        const img = selectedFormatOverlays[i]

        if (img.style.opacity === '1') {
          visibleIdx = i
        }

        img.style.opacity = '0'
      }

      // make next image visible

      const nextVisibleIdx =
        visibleIdx === selectedFormatOverlays.length - 1 // wrap
          ? 0
          : visibleIdx + 1

      selectedFormatOverlays[nextVisibleIdx].style.opacity = '1'
    }, 2_200)

    return () => clearInterval(interval)
  }, [])

  const selectedFormatClasses = `${styles.formatOverlay} ${styles.selectedFormat}`

  return (
    <div className={className}>
      <div className={styles.images}>
        <ThemedImage
          className={styles.screenshotImage}
          sources={{
            light: useBaseUrl('/img/popup-light.png'),
            dark: useBaseUrl('/img/popup-dark-lightened.png'),
          }}
          alt="Popup"
        />
        {/* backdrop overlay for cross-fade */}
        <ThemedImage
          className={styles.formatOverlay}
          sources={{
            light: useBaseUrl('/img/format-selected-blank-light.png'),
            dark: useBaseUrl('/img/format-selected-blank-dark.png'),
          }}
          alt="Selected format backdrop"
        />
        {/* selected format overlays */}
        <ThemedImage
          className={selectedFormatClasses}
          style={{ opacity: 1 }}
          sources={{
            light: useBaseUrl('/img/format-selected-link-light.png'),
            dark: useBaseUrl('/img/format-selected-link-dark.png'),
          }}
          alt="Selected format link"
        />
        <ThemedImage
          className={selectedFormatClasses}
          sources={{
            light: useBaseUrl('/img/format-selected-url-light.png'),
            dark: useBaseUrl('/img/format-selected-url-dark.png'),
          }}
          alt="Selected format url"
        />
        <ThemedImage
          className={selectedFormatClasses}
          sources={{
            light: useBaseUrl('/img/format-selected-title-url-light.png'),
            dark: useBaseUrl('/img/format-selected-title-url-dark.png'),
          }}
          alt="Selected format title & url"
        />
        <ThemedImage
          className={selectedFormatClasses}
          sources={{
            light: useBaseUrl('/img/format-selected-custom-format-light.png'),
            dark: useBaseUrl('/img/format-selected-custom-format-dark.png'),
          }}
          alt="Selected format custom format"
        />
        <ThemedImage
          className={selectedFormatClasses}
          sources={{
            light: useBaseUrl('/img/format-selected-title-light.png'),
            dark: useBaseUrl('/img/format-selected-title-dark.png'),
          }}
          alt="Selected format title"
        />
        <ThemedImage
          className={selectedFormatClasses}
          sources={{
            light: useBaseUrl('/img/format-selected-markdown-light.png'),
            dark: useBaseUrl('/img/format-selected-markdown-dark.png'),
          }}
          alt="Selected format markdown"
        />
        <ThemedImage
          className={selectedFormatClasses}
          sources={{
            light: useBaseUrl('/img/format-selected-bbcode-light.png'),
            dark: useBaseUrl('/img/format-selected-bbcode-dark.png'),
          }}
          alt="Selected format bbcode"
        />
        <ThemedImage
          className={selectedFormatClasses}
          sources={{
            light: useBaseUrl('/img/format-selected-csv-light.png'),
            dark: useBaseUrl('/img/format-selected-csv-dark.png'),
          }}
          alt="Selected format csv"
        />
        <ThemedImage
          className={selectedFormatClasses}
          sources={{
            light: useBaseUrl('/img/format-selected-json-light.png'),
            dark: useBaseUrl('/img/format-selected-json-dark.png'),
          }}
          alt="Selected format json"
        />
        <ThemedImage
          className={selectedFormatClasses}
          sources={{
            light: useBaseUrl('/img/format-selected-html-light.png'),
            dark: useBaseUrl('/img/format-selected-html-dark.png'),
          }}
          alt="Selected format html"
        />
        <ThemedImage
          className={selectedFormatClasses}
          sources={{
            light: useBaseUrl('/img/format-selected-html-table-light.png'),
            dark: useBaseUrl('/img/format-selected-html-table-dark.png'),
          }}
          alt="Selected format html table"
        />
      </div>
    </div>
  )
}
