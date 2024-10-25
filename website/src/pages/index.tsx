import clsx from 'clsx'
// import Link from '@docusaurus/Link'
import useDocusaurusContext from '@docusaurus/useDocusaurusContext'
import Layout from '@theme/Layout'
import Screenshot from '@site/src/components/Screenshot'
import HomepageFeatures from '@site/src/components/HomepageFeatures'
import HomepageRating from '@site/src/components/HomepageRating'
import HomepageTestimonials from '@site/src/components/HomepageTestimonials'
import Heading from '@theme/Heading'

import styles from './index.module.css'

function HomepageHeader() {
  const { siteConfig } = useDocusaurusContext()

  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <Heading
          as="h1"
          className="hero__title"
        >
          {siteConfig.title}
        </Heading>
        <p className="hero__subtitle">{siteConfig.tagline}</p>
        {/* <div className={styles.buttons}>
          <Link
            className="button button--secondary button--lg"
            to="/docs/intro"
          >
            Docusaurus Tutorial - 5min ⏱️
          </Link>
        </div> */}
      </div>
    </header>
  )
}

export default function Home(): JSX.Element {
  const { siteConfig } = useDocusaurusContext()

  return (
    <Layout
      // title={`Hello from ${siteConfig.title}`}
      description={siteConfig.tagline}
    >
      <HomepageHeader />
      <Screenshot className={styles.screenshotContainer} />
      <main>
        <HomepageFeatures />
        {/* 4.7 rating adjusted to visually match CWS */}
        <HomepageRating
          rating={4.56}
          text={'4.7 stars on the Chrome Web Store'}
        />
        <HomepageTestimonials
          text={'Boosting daily productivity for over 93,000 users worldwide'}
        />
      </main>
    </Layout>
  )
}
