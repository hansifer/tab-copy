import Heading from '@theme/Heading'
import Testimonials from '@site/src/components/Testimonials'
import styles from './styles.module.css'

export default function HomepageTestimonials({ text }: { text: string }): JSX.Element {
  return (
    <section className={styles.HomepageTestimonials}>
      <Heading
        as="h2"
        className={styles.heading}
      >
        {text}
      </Heading>
      <Testimonials />
    </section>
  )
}
