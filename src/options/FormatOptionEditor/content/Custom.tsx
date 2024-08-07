import { intl } from '@/intl'
import { sentenceCase } from '@/util/string'
import { classy } from '@/util/css'

import { TextOption } from '@/options/TextOption/TextOption'
import { ContentProps } from './interface'
import classes from './Custom.module.css'
import optionsClasses from '../../Options.module.css'
import { tokens } from './tokens'

// content components receive up-to-date option and are responsible for reporting option changes

// todo: add more validation

const TEMPLATE_FIELD_WIDTH = '265px'

export const Custom = ({
  option,
  onChange,
  onConfirmDelete,
  onValidChanged,
}: ContentProps<'custom-*'>) => {
  const valid = !!option.name.trim()

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
        value={option.name}
        maxLength={30}
        width="200px"
        autoFocus
        onChange={(name) => {
          const newValid = !!name.trim()

          if (onValidChanged && newValid !== valid) {
            onValidChanged(newValid)
          }

          onChange({
            ...option,
            name,
          })
        }}
      />
      <div className={classes.template}>
        <TextOption
          label={intl.header()}
          value={option.template.header}
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
              ...option,
              template: {
                ...option.template,
                header,
              },
            })
          }}
        />
        <TextOption
          label={intl.tab()}
          value={option.template.tab}
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
              ...option,
              template: {
                ...option.template,
                tab,
              },
            })
          }}
        />
        <TextOption
          label={intl.tabDelimiter()}
          value={option.template.delimiter}
          width={TEMPLATE_FIELD_WIDTH}
          tokens={[
            // wrap
            tokens.newline,
            tokens.tab,
          ]}
          onChange={(delimiter) => {
            onChange({
              ...option,
              template: {
                ...option.template,
                delimiter,
              },
            })
          }}
        />
        <TextOption
          label={intl.footer()}
          value={option.template.footer}
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
              ...option,
              template: {
                ...option.template,
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
