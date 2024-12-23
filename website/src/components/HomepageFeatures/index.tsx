import clsx from 'clsx'
import Heading from '@theme/Heading'
import styles from './styles.module.css'

type FeatureItem = {
  title: string
  Svg: React.ComponentType<React.ComponentProps<'svg'>>
  description: JSX.Element
}

const FeatureList: FeatureItem[] = [
  {
    title: 'Easy',
    Svg: require('@site/static/img/undraw_done.svg').default,
    description: (
      <>
        Enjoy the simplicity of a thoughtfully-crafted user experience designed to be optimally
        intuitive without compromising on power.
      </>
    ),
  },
  {
    title: 'Fast',
    Svg: require('@site/static/img/undraw_super_woman.svg').default,
    description: (
      <>
        Supercharge your workflow with assignable keyboard shortcuts, modifier keys for secondary
        formats, and one-click copy.
      </>
    ),
  },
  {
    title: 'Customizable',
    Svg: require('@site/static/img/undraw_options.svg').default,
    description: (
      <>
        Fine-tune your experience by choosing which buttons and formats are shown, configuring
        formats, and creating your own formats.
      </>
    ),
  },
]

function Feature({ title, Svg, description }: FeatureItem) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <Svg
          className={styles.featureSvg}
          role="img"
        />
      </div>
      <div className="text--center padding-horiz--md">
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </div>
    </div>
  )
}

export default function HomepageFeatures(): JSX.Element {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature
              key={idx}
              {...props}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
