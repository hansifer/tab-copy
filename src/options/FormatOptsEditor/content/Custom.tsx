import { templateFields } from '@/template-field'
import { customFormat } from '@/format'
import { getPreviewWindows } from '@/preview'
import { applyTextTransformToWindows } from '@/copy'
import { intl } from '@/intl'
import { sentenceCase } from '@/util/string'
import { classy } from '@/util/css'

import { TextOption } from '@/options/TextOption/TextOption'

import { ContentProps } from './interface'
import { TemplateField } from './TemplateField'

import classes from './Custom.module.css'
import optionsClasses from '../../Options.module.css'

// content components receive up-to-date opts and are responsible for reporting opts changes

// todo: add more validation

export const Custom = ({ opts, onChange, onConfirmDelete }: ContentProps<'custom-*'>) => {
  const previewHtml = applyTextTransformToWindows(
    getPreviewWindows(),
    customFormat.transforms(opts),
    'html',
    customFormat.label(opts),
  )

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
      <div className={classes.templateScroll}>
        <div className={classes.template}>
          {templateFields.map(({ id, label, tokens }) => (
            <TemplateField
              key={id}
              id={id}
              label={label()}
              tokens={tokens}
              opts={opts}
              onChange={onChange}
            />
          ))}
        </div>
      </div>
      {previewHtml ? (
        <div className={classes.previewContainer}>
          <div className={classes.previewScroll}>
            <div className={classes.preview}>
              <div
                className={classes.previewHtml}
                tabIndex={-1}
                // todo: sanitize previewHtml to future-proof shared formats
                dangerouslySetInnerHTML={{ __html: previewHtml }}
              />
              <div className={classes.previewLabel}>{sentenceCase(intl.preview())}</div>
            </div>
          </div>
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
