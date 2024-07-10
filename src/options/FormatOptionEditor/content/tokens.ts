// todo: intl label

export const tokens = {
  tabCount: {
    id: 'tab-count',
    label: 'tab count',
    token: 'count',
  },
  date: {
    id: 'date',
    label: 'date',
    token: 'date',
  },
  time: {
    id: 'time',
    label: 'time',
    token: 'time',
  },
  dateTime: {
    id: 'date-time',
    label: 'date+time',
    token: 'date+time',
  },
  formatName: {
    id: 'format-name',
    label: 'format name',
    token: 'format name',
  },
  newline: {
    id: 'newline',
    label: 'NEWLINE',
    token: 'n',
  },
  tab: {
    id: 'tab',
    label: 'TAB',
    token: 't',
  },
  tabTitle: {
    id: 'tab-title',
    label: 'title',
    token: 'title',
  },
  tabUrl: {
    id: 'tab-url',
    label: 'url',
    token: 'url',
  },
  tabLink: {
    id: 'tab-link',
    label: 'link',
    token: 'link',
  },
  tabUrlSchema: {
    id: 'tab-url-schema',
    label: 'schema',
    token: 'schema',
  },
  tabUrlHost: {
    id: 'tab-url-host',
    label: 'host',
    token: 'host',
  },
  tabUrlPath: {
    id: 'tab-url-path',
    label: 'path',
    token: 'path',
  },
  tabUrlQuery: {
    id: 'tab-url-query',
    label: 'query',
    token: 'query',
  },
  tabUrlHash: {
    id: 'tab-url-hash',
    label: 'hash',
    token: 'hash',
  },
  tabNumber: {
    id: 'tab-number',
    label: 'tab number',
    token: '#',
  },
} as const satisfies Record<
  string,
  {
    id: string
    label: string
    token: string
  }
>

export type Token = (typeof tokens)[keyof typeof tokens]

export function makeTokenRegExp(tokens?: Token[]) {
  return tokens // wrap
    ? new RegExp(`\\[(${tokens.map(({ token }) => token).join('|')})]`, 'g')
    : null
}

// returns true if selectionStart or selectionEnd is inside of a token, otherwise false
// exception: returns 'full' if selection fully spans the content of a single token (all chars between [ and ])
export function selectionOverlapsToken(
  value: string,
  selectionStart: number,
  selectionEnd: number,
  tokenRegExp: RegExp,
) {
  // swap token delimiter brackets to facilitate counting. we know \n will not be included in the value since custom fields are single line.
  const bracketSwap = '\n'
  const bracketSwapRegExp = new RegExp(bracketSwap, 'g')

  const workingValue = value.replace(tokenRegExp, `${bracketSwap}$1${bracketSwap}`)

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
