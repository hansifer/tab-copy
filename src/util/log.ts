type LogOpts = {
  separate?: boolean
}

export function log(text: string, opts: LogOpts = {}) {
  if (opts.separate) {
    console.log('')
  }

  console.log(`%c${text}`, 'color: #0ea9c0;')
}
