import { Header } from '@/notification-tab/Header/Header'
import { TextBlock } from '@/notification-tab/TextBlock/TextBlock'
import { Developer } from '@/notification-tab/images/Developer'
import { HeartIcon } from '@/icons/HeartIcon'
import { sentenceCase } from '@/util/string'

import classes from './ReleaseNotification.module.css'

// todo: localize

export const ReleaseNotification = () => {
  const params = new URLSearchParams(window.location.search)
  const previousVersion = params.get('previousVersion')

  const summary =
    previousVersion === '4.0.0' ? (
      <TextBlock
        content={[
          'This release adds a ',
          ['one-click copy', 'https://tabcopy.com/docs/one-click-copy'],
          ' feature,',
          <br />,
          'an option to ',
          ['show tab counts', 'https://tabcopy.com/docs/options#show-tab-counts'],
          ', and ',
          ['more', 'https://tabcopy.com/releases/4-1-0'],
          '.',
        ]}
      />
    ) : (
      <TextBlock
        content={[
          "We've been busy cooking up ",
          <br />,
          ['new features and a fresh design', 'https://tabcopy.com/releases'],
          '.',
          <br />,
          <br />,
          'Check out the ',
          ['new docs', 'https://tabcopy.com/docs'],
          ' and  ',
          <br />,
          ['customize your experience', 'options.html'],
          '.',
        ]}
      />
    )

  return (
    <main>
      <Header text="Tab Copy has been upgraded" />
      <Developer />
      {summary}
      <div>
        <div>
          {
            "If you find Tab Copy useful, we'd be grateful if you'd consider supporting our ability to keep maintaining and improving it."
          }
        </div>
        <br />
        <div className={classes.italic}>{'Thank you!'}</div>
        <br />
        <div className={classes.buttons}>
          <button
            className={classes.primaryAction}
            onClick={() => {
              chrome.tabs.create({
                url: 'https://tabcopy.com/donate',
              })
            }}
          >
            <HeartIcon size={18} />
            {sentenceCase('donate')}
          </button>
        </div>
      </div>
    </main>
  )
}
