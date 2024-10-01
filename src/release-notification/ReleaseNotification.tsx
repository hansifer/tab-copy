import { Logo } from '@/Logo'
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
                url: 'https://tabcopy.com/contribute/',
              })
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
            </svg>
            {sentenceCase('donate')}
          </button>
        </div>
      </div>
    </main>
  )
}
