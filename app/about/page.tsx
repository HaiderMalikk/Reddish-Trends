export default function About() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-customColor2 p-8">
      <h1 className="mb-4 text-4xl font-bold text-customColor6">
        About Trade Sense AI
      </h1>
      <div className="mb-10 max-w-4xl text-lg text-customColor6">
        <h2 className="mt-6 text-2xl font-semibold">Who we are</h2>
        <p>
          Welcome to Trade Sense AI this Website is owned and operated by{" "}
          <a
            className="text-customWhite underline hover:text-customColor3"
            href="https://haidermalikk.github.io/HaiderMaliksWebsite/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Haider Malik
          </a>{" "}
          a student at the York University of Canada. This Website was created
          to provide a platform for users to access the{" "}
          <a
            className="text-customWhite underline hover:text-customColor3"
            href="https://github.com/HaiderMalikk/Altharion"
            target="_blank"
            rel="noopener noreferrer"
          >
            Altharion AI Model
          </a>{" "}
          and its predictions. This website was ment to have a user friendly
          interface and to provide a platform for users to get trading insights
          that are holistic and easy to understand. The unique thing about this
          webiste is that it not only takes into account the technical analysis
          but also the sentiment analysis meaning it takes into account the news
          and the social media sentiment of the stock. This provides a more
          holistic view of the stock and helps the user make a more informed
          decision. The app is on the way we just need a little more time to
          make it perfect. If you have a question or a suggestion feel free to
          reach out to us using the contact info provided at the bottom of the
          page.
        </p>
      </div>
    </div>
  );
}
