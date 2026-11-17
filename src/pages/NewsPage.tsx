type NewsItem = {
  title: string
  image: string
  imageAlt: string
  summary: string
  detail: string
}

type NewsPageProps = {
  newsItems: NewsItem[]
  selectedNews: NewsItem | null
  onSelectNews: (item: NewsItem) => void
  onCloseNews: () => void
}

export function NewsPage({ newsItems, selectedNews, onSelectNews, onCloseNews }: NewsPageProps) {
  return (
    <section className="section-block">
      <div className="section-heading">
        <p className="eyebrow">Novedades</p>
        <h2>Noticias y promociones</h2>
      </div>
      <div className="news-grid row g-4">
        {newsItems.map((item) => (
          <article className="col-12 col-md-6" key={item.title}>
            <button
              type="button"
              className="news-card card h-100 w-100 text-start"
              onClick={() => onSelectNews(item)}
              aria-label={`Ver información: ${item.title}`}
            >
              <img className="card-img-top news-image" src={item.image} alt={item.imageAlt} />
              <span className="card-body">
                <span className="card-title news-title">{item.title}</span>
                <span className="card-text news-summary">{item.summary}</span>
                <span className="news-more">Ver información</span>
              </span>
            </button>
          </article>
        ))}
      </div>
      {selectedNews && (
        <div className="news-modal-layer" role="presentation" onClick={onCloseNews}>
          <div
            className="modal d-block"
            role="dialog"
            aria-modal="true"
            aria-labelledby="news-modal-title"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content news-modal-content">
                <div className="modal-header">
                  <h2 className="modal-title fs-5" id="news-modal-title">{selectedNews.title}</h2>
                  <button type="button" className="btn-close" aria-label="Cerrar" onClick={onCloseNews} />
                </div>
                <div className="modal-body">
                  <img className="news-modal-image" src={selectedNews.image} alt={selectedNews.imageAlt} />
                  <p>{selectedNews.detail}</p>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-primary" onClick={onCloseNews}>Entendido</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
