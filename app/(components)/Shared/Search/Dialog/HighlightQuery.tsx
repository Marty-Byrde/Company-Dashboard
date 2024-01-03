import Highlighter from 'react-highlight-words'

export default function HighlightQuery({ text, query }: { text: string; query: string }) {
  return <Highlighter highlightClassName='group-aria-selected:underline bg-transparent text-sky-600 dark:text-sky-400' searchWords={[query]} autoEscape={true} textToHighlight={text} />
}
