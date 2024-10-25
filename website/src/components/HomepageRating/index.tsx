import Heading from '@theme/Heading'
import Stars from '@site/src/components/Stars'
import styles from './styles.module.css'

export default function HomepageRating({
  rating,
  text,
}: {
  rating: number
  text: string
}): JSX.Element {
  return (
    <section className={styles.HomepageRating}>
      <Stars rating={rating} />
      <Heading
        as="h2"
        className={styles.text}
      >
        {text}
      </Heading>
    </section>
  )
}
