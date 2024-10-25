import { Masonry } from 'masonic'
import BrowserOnly from '@docusaurus/BrowserOnly'
import styles from './styles.module.css'

type TestimonialItem = {
  avatarSrc: string
  avatarSrcSet: string
  name: string
  rating: number
  date: string
  text: string
}

const testimonialItems: TestimonialItem[] = [
  {
    avatarSrc:
      'https://lh3.googleusercontent.com/a-/ALV-UjU1Ebe70HwlxYrCVLqfTratZa0GxUDbLu2QD6tUf0qfThAbmawLqA=s48-w48-h48',
    avatarSrcSet:
      'https://lh3.googleusercontent.com/a-/ALV-UjU1Ebe70HwlxYrCVLqfTratZa0GxUDbLu2QD6tUf0qfThAbmawLqA=s96-w96-h96 2x',
    name: 'Evan Edwards',
    rating: 5,
    date: 'Sep 22, 2024',
    text: 'An excellent app that is a must install for me.  The 2024 rewrite is modernized and greatly improved in tiny ways.  Highly recommended.',
  },
  {
    avatarSrc:
      'https://lh3.googleusercontent.com/a-/ALV-UjW1pWwJhHHHprzWy_AH6KBoDNlgaCs0TU6m3T8QZpCu8Ef0xQhn=s48-w48-h48',
    avatarSrcSet:
      'https://lh3.googleusercontent.com/a-/ALV-UjW1pWwJhHHHprzWy_AH6KBoDNlgaCs0TU6m3T8QZpCu8Ef0xQhn=s96-w96-h96 2x',
    name: 'John McBride',
    rating: 5,
    date: 'Oct 3, 2024',
    text: 'This is probably the most used extension I have. An excellent tool. Donated. Thank you!',
  },
  {
    avatarSrc:
      'https://lh3.googleusercontent.com/a-/ALV-UjWBUUyxxT1qk6SYZG2OBdTGKgbTb9hvDlEX_UH3j7Lx7CCPuaCQJA=s48-w48-h48',
    avatarSrcSet:
      'https://lh3.googleusercontent.com/a-/ALV-UjWBUUyxxT1qk6SYZG2OBdTGKgbTb9hvDlEX_UH3j7Lx7CCPuaCQJA=s96-w96-h96 2x',
    name: 'Samson Sun',
    rating: 5,
    date: 'Oct 3, 2024',
    text: "It's one of the best Chrome extensions I've ever installed. Use it multiple times every day. Well done!",
  },
  {
    avatarSrc:
      'https://lh3.googleusercontent.com/a-/ALV-UjX-9gWfMlwUD3vbGckoX6KiLf84aZ6hSWcONeiQzeMYaeiKC-I=s48-w48-h48',
    avatarSrcSet:
      'https://lh3.googleusercontent.com/a-/ALV-UjX-9gWfMlwUD3vbGckoX6KiLf84aZ6hSWcONeiQzeMYaeiKC-I=s96-w96-h96 2x',
    name: 'c smith',
    rating: 5,
    date: 'Oct 3, 2024',
    text: 'By far the most useful and often used of all of my installed extensions.  THANK YOU.',
  },
  {
    avatarSrc:
      'https://lh3.googleusercontent.com/a/ACg8ocJp2sdlTOTKvrfXLBor-dSBua1he5UAD3rMpr4jKK7XvQqfZA=s48-w48-h48',
    avatarSrcSet:
      'https://lh3.googleusercontent.com/a/ACg8ocJp2sdlTOTKvrfXLBor-dSBua1he5UAD3rMpr4jKK7XvQqfZA=s96-w96-h96 2x',
    name: 'Gtin SGS',
    rating: 5,
    date: 'Oct 3, 2024',
    text: 'The no 1 extension I install on each Chromium Browser. Essential tool for everyday use.\nThank you!',
  },
  {
    avatarSrc:
      'https://lh3.googleusercontent.com/a-/ALV-UjUTXaSiN9B1Rdojk8qupnCy2cMJ19jwFWl0MFfisgtJc0g4_tE=s48-w48-h48',
    avatarSrcSet:
      'https://lh3.googleusercontent.com/a-/ALV-UjUTXaSiN9B1Rdojk8qupnCy2cMJ19jwFWl0MFfisgtJc0g4_tE=s96-w96-h96 2x',
    name: 'Richard Bellemare',
    rating: 5,
    date: 'Oct 3, 2024',
    text: "... a versatile powerhouse ... If you're looking to boost productivity, streamline tab management, and simplify how you share links, Tab Copy is the perfect extension.",
  },
  {
    avatarSrc:
      'https://lh3.googleusercontent.com/a-/ALV-UjXXufFWpPdROU5ZarKi0UYLIrvT1HaExP9tROZX-ZofsWL8Y40N=s48-w48-h48',
    avatarSrcSet:
      'https://lh3.googleusercontent.com/a-/ALV-UjXXufFWpPdROU5ZarKi0UYLIrvT1HaExP9tROZX-ZofsWL8Y40N=s96-w96-h96 2x',
    name: 'loren polster',
    rating: 5,
    date: 'Oct 3, 2024',
    text: 'Essential tool I use everyday. Thank you!',
  },
  {
    avatarSrc:
      'https://lh3.googleusercontent.com/a-/ALV-UjVcmSf_JFSWUsN3ahj_P0Iut3flr1cGq5QmGsnpwRJqL3-feVj_FQ=s48-w48-h48',
    avatarSrcSet:
      'https://lh3.googleusercontent.com/a-/ALV-UjVcmSf_JFSWUsN3ahj_P0Iut3flr1cGq5QmGsnpwRJqL3-feVj_FQ=s96-w96-h96 2x',
    name: 'Pamela Daniels (Padeda)',
    rating: 5,
    date: 'Oct 3, 2024',
    text: "I'm really happy that Tab Copy has been updated—it's such an essential tool for me!",
  },
  {
    avatarSrc:
      'https://lh3.googleusercontent.com/a/ACg8ocJs0ytkhS9L7WRt7Els-RYluCQox5WPP7JnChDWuBJmQZcOHQ=s48-w48-h48',
    avatarSrcSet:
      'https://lh3.googleusercontent.com/a/ACg8ocJs0ytkhS9L7WRt7Els-RYluCQox5WPP7JnChDWuBJmQZcOHQ=s96-w96-h96 2x',
    name: 'Dade assets',
    rating: 5,
    date: 'Oct 6, 2024',
    text: 'Awesome App! Strongly suggested for those who have the need to have many windows opened at once!',
  },
  {
    avatarSrc:
      'https://lh3.googleusercontent.com/a-/ALV-UjWOBRjmolFNH_1cFMVIW81vVmx2oldKYW8gnWRTyHOaMfZxi6kJ=s48-w48-h48',
    avatarSrcSet:
      'https://lh3.googleusercontent.com/a-/ALV-UjWOBRjmolFNH_1cFMVIW81vVmx2oldKYW8gnWRTyHOaMfZxi6kJ=s96-w96-h96 2x',
    name: 'Dana K Cassell',
    rating: 5,
    date: 'Sep 28, 2024',
    text: '... This is so handy ... so easy to copy a whole rack of tabs into Evernote, shut down, then restart next day without any lost time finding stuff.',
  },
  {
    avatarSrc:
      'https://lh3.googleusercontent.com/a-/ALV-UjX1C-9cepg_soZSF5Q6epGxZKLpAMREAC3Vo7S4gXIpJ-ZPH_V5_w=s48-w48-h48',
    avatarSrcSet:
      'https://lh3.googleusercontent.com/a-/ALV-UjX1C-9cepg_soZSF5Q6epGxZKLpAMREAC3Vo7S4gXIpJ-ZPH_V5_w=s96-w96-h96 2x',
    name: 'Seungyup Lee',
    rating: 5,
    date: 'Oct 4, 2024',
    text: 'This is exactly what I was looking for! \nThank you so much! \nHighly recommended!',
  },
  {
    avatarSrc:
      'https://lh3.googleusercontent.com/a-/ALV-UjU5OU8G6ZE2y1_PgZYEYyAVvU4qC47DQzSsl1-tutw5T1JQr6E=s48-w48-h48',
    avatarSrcSet:
      'https://lh3.googleusercontent.com/a-/ALV-UjU5OU8G6ZE2y1_PgZYEYyAVvU4qC47DQzSsl1-tutw5T1JQr6E=s96-w96-h96 2x',
    name: 'SailCast',
    rating: 5,
    date: 'Oct 3, 2024',
    text: 'Good extension, works very well. Very useful and unique. Highly recommend, new design also very nice.',
  },
  {
    avatarSrc:
      'https://lh3.googleusercontent.com/a-/ALV-UjXmAEiZpnOXHgnsDH_IrB6R-XHhCozop8XPsIh4WGZYgwcRqa3Q=s48-w48-h48',
    avatarSrcSet:
      'https://lh3.googleusercontent.com/a-/ALV-UjXmAEiZpnOXHgnsDH_IrB6R-XHhCozop8XPsIh4WGZYgwcRqa3Q=s96-w96-h96 2x',
    name: 'C. B. Lindeman',
    rating: 5,
    date: 'Oct 3, 2024',
    text: "Really love Tab Copy ... it's simple & very user-friendly. Highly recommend it.",
  },
  {
    avatarSrc:
      'https://lh3.googleusercontent.com/a-/ALV-UjUZ75EDaKjl7UDNiN5p7Ahvzr--0Aw_iUZNC5EzonTlbnXlKsZN-w=s48-w48-h48',
    avatarSrcSet:
      'https://lh3.googleusercontent.com/a-/ALV-UjUZ75EDaKjl7UDNiN5p7Ahvzr--0Aw_iUZNC5EzonTlbnXlKsZN-w=s96-w96-h96 2x',
    name: 'L Dty',
    rating: 5,
    date: 'Jul 2, 2024',
    text: "I can't say how many tabs I shared with this ... being able to copy as MD, HTML and formatted URL in one shortcut saves me a ridiculous amount of time.",
  },
  {
    avatarSrc:
      'https://lh3.googleusercontent.com/a-/ALV-UjXOYOTtHp4GdGxofdcVqPUcMKD-ZKnCMJ79MhvmlzZWr7ZvUpBwxQ=s48-w48-h48',
    avatarSrcSet:
      'https://lh3.googleusercontent.com/a-/ALV-UjXOYOTtHp4GdGxofdcVqPUcMKD-ZKnCMJ79MhvmlzZWr7ZvUpBwxQ=s96-w96-h96 2x',
    name: 'Greg Sheremeta',
    rating: 5,
    date: 'Oct 3, 2024',
    text: 'So simple yet so amazing! I use it all day every day!',
  },
  {
    avatarSrc:
      'https://lh3.googleusercontent.com/a-/ALV-UjWrtwvOx4zVIvyrcCtd2ZMHg0mRmOENHoi4GtkK8pb4VLAa1FKE=s48-w48-h48',
    avatarSrcSet:
      'https://lh3.googleusercontent.com/a-/ALV-UjWrtwvOx4zVIvyrcCtd2ZMHg0mRmOENHoi4GtkK8pb4VLAa1FKE=s96-w96-h96 2x',
    name: 'Julian Genkins',
    rating: 5,
    date: 'Oct 3, 2024',
    text: 'Use it every day. Extremely helpful!',
  },
  {
    avatarSrc:
      'https://lh3.googleusercontent.com/a-/ALV-UjXaLXV4PCQs5yYBZ8_g7W8F84AqcIcMzso5SyVtsJOqyvD9_Frm=s48-w48-h48',
    avatarSrcSet:
      'https://lh3.googleusercontent.com/a-/ALV-UjXaLXV4PCQs5yYBZ8_g7W8F84AqcIcMzso5SyVtsJOqyvD9_Frm=s96-w96-h96 2x',
    name: 'Erloel C. C.',
    rating: 5,
    date: 'Oct 3, 2024',
    text: "The best! I can't imagine working without Tab Copy. Thanks!",
  },
  {
    avatarSrc:
      'https://lh3.googleusercontent.com/a-/ALV-UjXmCOqKbAUjqyWMRV5zpnJkxNHALas5S0MiOmurvqJn8A-m-mp-=s48-w48-h48',
    avatarSrcSet:
      'https://lh3.googleusercontent.com/a-/ALV-UjXmCOqKbAUjqyWMRV5zpnJkxNHALas5S0MiOmurvqJn8A-m-mp-=s96-w96-h96 2x',
    name: 'Greg Sweats',
    rating: 5,
    date: 'Jul 2, 2024',
    text: "Use this thing daily, if not hourly, and it's always been AMAZING!",
  },
]

const TestimonialCard = ({
  data: { avatarSrc, avatarSrcSet, name, date, text },
}: {
  data: TestimonialItem
}) => (
  <div className={styles.card}>
    <p>{text}</p>
    <div className={styles.user}>
      <img
        className={styles.avatar}
        src={avatarSrc}
        srcSet={avatarSrcSet}
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
