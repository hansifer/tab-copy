import classes from './OptionTip.module.css'

type OptionTipProps = {
  icon: JSX.Element
  text: string
  onDismiss: () => void
}

export const OptionTip = ({ icon, text, onDismiss }: OptionTipProps) => (
  <div className={classes.OptionTip}>
    <span className={classes.icon}>{icon}</span>
    <span className={classes.text}>{text}</span>
    <button
      className={classes.dismiss}
      onClick={() => onDismiss()}
    >
      Got it
    </button>
  </div>
)
