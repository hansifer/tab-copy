import clsx from 'clsx'
import styles from './styles.module.css'

export type State = 'next-up' | 'in-progress' | 'done'

export default function Status({ state }: { state?: State }): JSX.Element {
  if (!state) return null

  return (
    <span className={clsx(styles.Status, getStateClassName(state))}>{getStateText(state)}</span>
  )
}

function getStateClassName(state: State) {
  switch (state) {
    case 'done':
      return styles.done

    case 'in-progress':
      return styles.inProgress

    default:
      return styles.nextUp
  }
}

// todo: intl
function getStateText(state: State) {
  switch (state) {
    case 'done':
      return 'done'

    case 'in-progress':
      return 'in progress'

    default:
      return 'next up'
  }
}
