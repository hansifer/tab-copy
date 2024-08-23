import { intl } from '@/intl'
import { sentenceCase } from '@/util/string'
import { classy } from '@/util/css'

import { TextOption } from '@/options/TextOption/TextOption'

import { ContentProps } from './interface'
import { tokens } from './tokens'

import classes from './Custom.module.css'
import optionsClasses from '../../Options.module.css'

// content components receive up-to-date opts and are responsible for reporting opts changes

// todo: add more validation

const TEMPLATE_FIELD_WIDTH = '265px'

export const Custom = ({ opts, onChange, onConfirmDelete }: ContentProps<'custom-*'>) => {
  const previewText = ''

  //   const previewText = `[8:46:18 AM]

  // My format

  // 1) Title: Example 1
  //     URL:   https://www.example.com/

  // 2) Title: Example 2
  //     URL:   http://example.com/search?q=kittens

  // 3) Title: Example 3
  //     URL:   http://examsdfsdfsdfsdfsdfsfple.com/folder/doc.html#fragment
  // `

  return (
    <>
      <TextOption
        label={intl.name()}
        value={opts.name}
        maxLength={30}
        width="200px"
        autoFocus
        onChange={(name) => {
          onChange({
            ...opts,
            name,
          })
        }}
      />
      <div className={classes.template}>
        <TextOption
          label={intl.header()}
          value={opts.template.header}
          width={TEMPLATE_FIELD_WIDTH}
          tokens={[
            tokens.tabCount,
            tokens.date,
            tokens.time,
            tokens.dateTime,
            tokens.formatName,
            tokens.newline,
            tokens.tab,
          ]}
          onChange={(header) => {
            onChange({
              ...opts,
              template: {
                ...opts.template,
                header,
              },
            })
          }}
        />
        <TextOption
          label={intl.tab()}
          value={opts.template.tab}
          width={TEMPLATE_FIELD_WIDTH}
          tokens={[
            tokens.tabTitle,
            tokens.tabUrl,
            tokens.tabLink,
            tokens.tabUrlSchema,
            tokens.tabUrlHost,
            tokens.tabUrlPath,
            tokens.tabUrlQuery,
            tokens.tabUrlHash,
            tokens.tabNumber,
            tokens.date,
            tokens.time,
            tokens.dateTime,
            tokens.newline,
            tokens.tab,
          ]}
          onChange={(tab) => {
            onChange({
              ...opts,
              template: {
                ...opts.template,
                tab,
              },
            })
          }}
        />
        <TextOption
          label={intl.tabDelimiter()}
          value={opts.template.delimiter}
          width={TEMPLATE_FIELD_WIDTH}
          tokens={[
            // wrap
            tokens.newline,
            tokens.tab,
          ]}
          onChange={(delimiter) => {
            onChange({
              ...opts,
              template: {
                ...opts.template,
                delimiter,
              },
            })
          }}
        />
        <TextOption
          label={intl.footer()}
          value={opts.template.footer}
          width={TEMPLATE_FIELD_WIDTH}
          tokens={[
            tokens.tabCount,
            tokens.date,
            tokens.time,
            tokens.dateTime,
            tokens.formatName,
            tokens.newline,
            tokens.tab,
          ]}
          onChange={(footer) => {
            onChange({
              ...opts,
              template: {
                ...opts.template,
                footer,
              },
            })
          }}
        />
      </div>
      {previewText ? (
        <div className={classes.preview}>
          <div
            className={classes.previewText}
            tabIndex={-1}
          >
            {previewText}
          </div>
          <div className={classes.previewLabel}>{sentenceCase(intl.preview())}</div>
        </div>
      ) : null}
      {onConfirmDelete ? (
        <button
          className={classy(optionsClasses.primaryAction, optionsClasses.destructiveAction)}
          onClick={() => onConfirmDelete()}
        >
          {sentenceCase(intl.deleteFormat())}
        </button>
      ) : null}
    </>
  )
}
