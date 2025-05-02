interface NewsArticlePageProps {
    params: {
        slug: string;
    }
}

const NewArticlePage = ({ params }: NewsArticlePageProps) => {
    const { slug } = params;

    // TODO: Fetch news data

    return (
        <div>
            <h1>News Article: {slug}</h1>
            <p>Content for the news articles</p>
        </div>
    )
}

export default NewArticlePage;