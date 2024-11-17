import { Header } from '@/notification-tab/Header/Header'
import { TextBlock } from '@/notification-tab/TextBlock/TextBlock'
import { Directions } from '@/notification-tab/images/Directions'
import { Options } from '@/notification-tab/images/Options'

import classes from './InstallNotification.module.css'

// todo: localize

export const InstallNotification = () => {
  return (
    <div className={classes.main}>
      <Header text="Welcome to Tab Copy" />
      <div
        className={classes.section}
        // adjust for image's negative space
        style={{ marginTop: '62px' }}
      >
        <Directions />
        <TextBlock
          content={[
            'Get the most out of Tab Copy by taking a moment to explore the ',
            ['user guide', 'https://tabcopy.com/docs'],
            '.',
          ]}
        />
      </div>
      <div className={classes.section}>
        <Options />
        <TextBlock
          content={[
            'Personalize Tab Copy to suit your needs with a comprehensive set of ',
            ['options', 'options.html'],
            '.',
          ]}
        />
      </div>
    </div>
  )
}
