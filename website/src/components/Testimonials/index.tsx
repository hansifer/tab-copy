import { Masonry } from 'masonic'
import BrowserOnly from '@docusaurus/BrowserOnly'
import styles from './styles.module.css'

type TestimonialItem = {
  avatarSrc: string
  name: string
  rating: number
  date: string
  text: string
}

const testimonialItems: TestimonialItem[] = [
  {
    avatarSrc: '/img/testimonial-avatars/avatar-16.png',
    name: 'Evan Edwards',
    rating: 5,
    date: 'Sep 22, 2024',
    text: 'An excellent app that is a must install for me.  The 2024 rewrite is modernized and greatly improved in tiny ways.  Highly recommended.',
  },
  {
    avatarSrc: '/img/testimonial-avatars/avatar-18.jpeg',
    name: 'John McBride',
    rating: 5,
    date: 'Oct 3, 2024',
    text: 'This is probably the most used extension I have. An excellent tool. Donated. Thank you!',
  },
  {
    avatarSrc: '/img/testimonial-avatars/avatar-17.png',
    name: 'Samson Sun',
    rating: 5,
    date: 'Oct 3, 2024',
    text: "It's one of the best Chrome extensions I've ever installed. Use it multiple times every day. Well done!",
  },
  {
    avatarSrc: '/img/testimonial-avatars/avatar-15.jpeg',
    name: 'c smith',
    rating: 5,
    date: 'Oct 3, 2024',
    text: 'By far the most useful and often used of all of my installed extensions.  THANK YOU.',
  },
  {
    avatarSrc: '/img/testimonial-avatars/avatar-13.png',
    name: 'Gtin SGS',
    rating: 5,
    date: 'Oct 3, 2024',
    text: 'The no 1 extension I install on each Chromium Browser. Essential tool for everyday use.\nThank you!',
  },
  {
    avatarSrc: '/img/testimonial-avatars/avatar-19.png',
    name: 'Carolyn Valiquette',
    rating: 5,
    date: 'Nov 22, 2024',
    text: 'Love this extension. I use it dozens of times per day. Thanks!',
  },
  {
    avatarSrc: '/img/testimonial-avatars/avatar-20.png',
    name: 'S LT',
    rating: 5,
    date: 'Nov 20, 2024',
    text: "One of the best extensions I've ever come across, and continuously gets better",
  },
  {
    avatarSrc: '/img/testimonial-avatars/avatar-14.jpeg',
    name: 'Richard Bellemare',
    rating: 5,
    date: 'Oct 3, 2024',
    text: "... a versatile powerhouse ... If you're looking to boost productivity, streamline tab management, and simplify how you share links, Tab Copy is the perfect extension.",
  },
  {
    avatarSrc: '/img/testimonial-avatars/avatar-1.jpeg',
    name: 'loren polster',
    rating: 5,
    date: 'Oct 3, 2024',
    text: 'Essential tool I use everyday. Thank you!',
  },
  {
    avatarSrc: '/img/testimonial-avatars/avatar-12.png',
    name: 'Pamela Daniels (Padeda)',
    rating: 5,
    date: 'Oct 3, 2024',
    text: "I'm really happy that Tab Copy has been updated—it's such an essential tool for me!",
  },
  {
    avatarSrc: '/img/testimonial-avatars/avatar-9.png',
    name: 'Dade assets',
    rating: 5,
    date: 'Oct 6, 2024',
    text: 'Awesome App! Strongly suggested for those who have the need to have many windows opened at once!',
  },
  {
    avatarSrc: '/img/testimonial-avatars/avatar-10.png',
    name: 'Dana K Cassell',
    rating: 5,
    date: 'Sep 28, 2024',
    text: '... This is so handy ... so easy to copy a whole rack of tabs into Evernote, shut down, then restart next day without any lost time finding stuff.',
  },
  {
    avatarSrc: '/img/testimonial-avatars/avatar-11.jpeg',
    name: 'Seungyup Lee',
    rating: 5,
    date: 'Oct 4, 2024',
    text: 'This is exactly what I was looking for! \nThank you so much! \nHighly recommended!',
  },
  {
    avatarSrc: '/img/testimonial-avatars/avatar-2.jpeg',
    name: 'SailCast',
    rating: 5,
    date: 'Oct 3, 2024',
    text: 'Good extension, works very well. Very useful and unique. Highly recommend, new design also very nice.',
  },
  {
    avatarSrc: '/img/testimonial-avatars/avatar-7.jpeg',
    name: 'C. B. Lindeman',
    rating: 5,
    date: 'Oct 3, 2024',
    text: "Really love Tab Copy ... it's simple & very user-friendly. Highly recommend it.",
  },
  {
    avatarSrc: '/img/testimonial-avatars/avatar-8.jpeg',
    name: 'L Dty',
    rating: 5,
    date: 'Jul 2, 2024',
    text: "I can't say how many tabs I shared with this ... being able to copy as MD, HTML and formatted URL in one shortcut saves me a ridiculous amount of time.",
  },
  {
    avatarSrc: '/img/testimonial-avatars/avatar-3.jpeg',
    name: 'Greg Sheremeta',
    rating: 5,
    date: 'Oct 3, 2024',
    text: 'So simple yet so amazing! I use it all day every day!',
  },
  {
    avatarSrc: '/img/testimonial-avatars/avatar-6.jpeg',
    name: 'Julian Genkins',
    rating: 5,
    date: 'Oct 3, 2024',
    text: 'Use it every day. Extremely helpful!',
  },
  {
    avatarSrc: '/img/testimonial-avatars/avatar-5.jpeg',
    name: 'Erloel C. C.',
    rating: 5,
    date: 'Oct 3, 2024',
    text: "The best! I can't imagine working without Tab Copy. Thanks!",
  },
  {
    avatarSrc: '/img/testimonial-avatars/avatar-4.jpeg',
    name: 'Greg Sweats',
    rating: 5,
    date: 'Jul 2, 2024',
    text: "Use this thing daily, if not hourly, and it's always been AMAZING!",
  },
]

const TestimonialCard = ({
  // wrap
  data: { avatarSrc, name, date, text },
}: {
  data: TestimonialItem
}) => (
  <div className={styles.card}>
    <p>{text}</p>
    <div className={styles.user}>
      <img
        className={styles.avatar}
        src={avatarSrc}
      />
      <div>
        <div>{name}</div>
        <div>{date}</div>
      </div>
    </div>
  </div>
)

export default function Testimonials(): JSX.Element {
  return (
    // Only render this component in the browser to avoid "ReferenceError: ResizeObserver is not defined" during build
    <BrowserOnly>
      {() => (
        <div className={styles.Testimonials}>
          <Masonry
            items={testimonialItems}
            rowGutter={16}
            columnGutter={16}
            maxColumnCount={3}
            // minimum column width
            columnWidth={220}
            render={TestimonialCard}
          />
        </div>
      )}
    </BrowserOnly>
  )
}
