import { Logo } from '@/Logo'
import { HeartIcon } from '@/icons/HeartIcon'
import { sentenceCase } from '@/util/string'

import classes from './ReleaseNotification.module.css'

// todo: localize

export const ReleaseNotification = () => {
  return (
    <main>
      <Logo size={48} />
      <h1>{'Tab Copy has been upgraded'}</h1>
      <div className={classes.section}>
        <div>{"We've been busy cooking up more features and a fresh design."}</div>
        <div>
          <div>
            <span>{'Check out '}</span>
            <a
              href="https://tabcopy.com/docs"
              target="_blank"
            >
              {'the docs'}
            </a>
            <span>{' and '}</span>
            <a
              href="https://tabcopy.com/releases/4-0-0"
              target="_blank"
            >
              {'release notes'}
            </a>
          </div>
          <div>
            <span> {'and explore the new '}</span>
            <a
              href="javascript:void(0);"
              onClick={() => {
                chrome.tabs.create({
                  url: chrome.runtime.getURL('options.html'),
                })
              }}
            >
              {'options'}
            </a>
            .
          </div>
        </div>
      </div>
      <div
        className={classes.section}
        style={{
          maxWidth: 460,
        }}
      >
        <div>
          <span>{"If you've been enjoying "}</span>
          <a
            href="https://tabcopy.com"
            target="_blank"
          >
            {'Tab Copy'}
          </a>
          <span>
            {
              " and finding it useful, we'd be grateful if you'd consider supporting our efforts with a donation to help us keep improving and maintaining this project."
            }
          </span>
        </div>
        <div className={classes.italic}>{'Thank you for your support!'}</div>
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
