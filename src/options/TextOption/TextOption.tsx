import { useState, useEffect, useRef, HTMLInputTypeAttribute } from 'react'

import { makeTokenRegExp, Token } from '@/template-field'
import { sentenceCase } from '@/util/string'
import { insertInputText } from '@/util/dom'
import { classy } from '@/util/css'
import { intl } from '@/intl'

import classes from './TextOption.module.css'

// todo: add validation feature

const MAX_COLLAPSED_TOKENS = 2

type TextOptionProps = {
  label: string
  value: string
  disabled?: boolean
  invalid?: boolean
  type?: Extract<
    HTMLInputTypeAttribute,
    'text' | 'number' | 'date' | 'datetime-local' | 'email' | 'month' | 'time' | 'url' | 'week'
  >
  min?: number
  max?: number
  width?: string
  maxLength?: number
  autoFocus?: boolean
  tokens?: Token[]
  onChange: (value: string) => void
}

export const TextOption = ({
  // wrap
  label,
  value,
  disabled,
  invalid,
  type = 'text',
  min,
  max,
  width = '100%',
  maxLength,
  autoFocus,
  tokens,
  onChange,
}: TextOptionProps) => {
  const [showAllTokens, setShowAllTokens] = useState(false)

  const inputRef = useRef<HTMLInputElement>(null)

  // use inert to ensure token selector gets hidden when comp is disabled
  const inert = disabled ? 'true' : undefined //  todo: update to boolean after this bug is fixed: https://github.com/facebook/react/pull/24730

  useEffect(() => {
    if (autoFocus) {
      inputRef.current?.focus()
    }
  }, [autoFocus])

  const rootClasses = classy(classes.TextOption, {
    [classes.disabled]: disabled,
    [classes.invalid]: invalid,
  })

  return (
    <div
      className={rootClasses}
      inert={inert}
    >
      <div className={classes.label}>{sentenceCase(label)}</div>
      <div style={{ width }}>
        <input
          ref={inputRef}
          disabled={disabled}
          type={type}
          min={min}
          max={max}
          maxLength={maxLength}
          onInput={({ currentTarget }) => {
            onChange(currentTarget.value)
          }}
          value={value}
        />
        {tokens?.length ? (
          <div className={classes.tokenSelector}>
            <span className={classes.insert}>{`${sentenceCase(intl.insert())}:`}</span>
            {(showAllTokens ? tokens : tokens.slice(0, MAX_COLLAPSED_TOKENS)).map(
              ({ id, label, token }) => (
                <button
                  key={id}
                  className={classes.token}
                  onClick={() => {
                    // insert token at cursor position

                    const input = inputRef.current

                    if (!input || input.selectionStart == null || input.selectionEnd == null) return

                    input.focus()

                    const inputSelectionOverlapsToken = selectionOverlapsToken(
                      input.value,
                      input.selectionStart,
                      input.selectionEnd,
                      tokens,
                    )

                    // setting input value (via insertInputText()) below seems redundant since onChange will render the new value, but it's needed for cursor position update to work. setting an input value puts cursor at end of input unless value is same, so insertInputText() updates cursor position after setting the value and onChange will not disrupt this position since value will be same.; insertInputText() does not fire onInput

                    if (inputSelectionOverlapsToken === 'full') {
                      // replace token
                      onChange(insertInputText(input, token, 1))
                    } else if (!inputSelectionOverlapsToken) {
                      // insert token
                      onChange(insertInputText(input, `[${token}]`))
                    }
                  }}
                >
                  {label()}
                </button>
              ),
            )}
            {tokens.length > MAX_COLLAPSED_TOKENS ? (
              <button
                className={classes.expandCollapse}
                onClick={() => setShowAllTokens((prev) => !prev)}
              >
                {showAllTokens ? '< less' : 'more >'}
              </button>
            ) : null}
          </div>
        ) : null}
      </div>
    </div>
  )
}

// returns true if selectionStart or selectionEnd is inside of a token, otherwise false
// exception: returns 'full' if selection fully spans the content of a single token (all chars between [ and ])
function selectionOverlapsToken(
  value: string,
  selectionStart: number,
  selectionEnd: number,
  tokens: Token[],
) {
  // swap token delimiter brackets to facilitate counting. we know \n will not be included in the value since custom fields are single line.
  const bracketSwap = '\n'
  const bracketSwapRegExp = new RegExp(bracketSwap, 'g')

  const workingValue = value.replace(makeTokenRegExp(tokens), `${bracketSwap}$1${bracketSwap}`)

  const beforeSelection = workingValue.slice(0, selectionStart)
  const beforeSelectionBracketCount = (beforeSelection.match(bracketSwapRegExp) ?? []).length
  const isSelectionStartInsideOfToken = !!(beforeSelectionBracketCount % 2)

  if (isSelectionStartInsideOfToken) {
    if (
      workingValue[selectionStart - 1] === bracketSwap &&
      workingValue[selectionEnd] === bracketSwap
    ) {
      const selection = workingValue.slice(selectionStart, selectionEnd)

      if (!selection.includes(bracketSwap)) {
        return 'full'
      }
    }

    return true
  }

  const afterSelection = workingValue.slice(selectionEnd)
  const afterSelectionBracketCount = (afterSelection.match(bracketSwapRegExp) ?? []).length
  const isSelectionEndInsideOfToken = !!(afterSelectionBracketCount % 2)

  return isSelectionEndInsideOfToken
}
