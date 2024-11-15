// provide sugar for authoring notification tab text blocks
// - supports links for external (https?) or extension pages

type TextBlockProps = {
  content: (string | Link | JSX.Element)[]
}

type Link = [string, string] // [text, url]

export const TextBlock = ({ content }: TextBlockProps) => {
  return (
    <div>
      {content.map((item) =>
        typeof item === 'string' ? (
          <span>{item}</span>
        ) : Array.isArray(item) ? (
          renderLink(...item)
        ) : (
          item
        ),
      )}
    </div>
  )
}

function renderLink(text: string, url: string) {
  const isExternalUrl = /^https?:\/\//.test(url)

  return (
    <a
      href={url}
      target="_blank"
      onClick={
        isExternalUrl
          ? undefined
          : (e) => {
              chrome.tabs.create({
                url: chrome.runtime.getURL(url),
              })

              e.preventDefault()
            }
      }
    >
      {text}
    </a>
  )
}
