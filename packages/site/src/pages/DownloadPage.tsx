import { downloads } from '../content'
import type { Locale } from '../content'
import { withBasePath } from '../app/paths'
import { Article } from './Article'

export function DownloadPage({ locale }: { locale: Locale }) {
  const content = downloads[locale]

  return (
    <Article title={content.title}>
      <h2>{content.offlineTitle}</h2>
      <p>{content.offlineIntro}</p>
      <h3>{content.stepDownload}</h3>
      <p>
        <a href={withBasePath(content.releaseHref)}>
          {content.releaseLink}
        </a>{' '}
        {content.releaseNote}
      </p>
      <h3>{content.stepUnzip}</h3>
      <p>{content.unzip}</p>
      <h3>{content.stepLoad}</h3>
      <ol>
        {content.steps.map((step) => (
          <li key={step}>{step}</li>
        ))}
      </ol>
    </Article>
  )
}
