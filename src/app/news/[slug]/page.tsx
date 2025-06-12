export default async function NewsArticle({
    params,
}: {
    params: Promise<{ slug: string }>
}) {
    const { slug } = await params
    return (
        <div>News Article with URL: {slug}</div>
    )
}