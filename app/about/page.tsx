export default function About() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-customColor2 p-8">
      <h1 className="mb-4 text-4xl font-bold text-customColor6">
        About Reddish Trends
      </h1>
      <div className="mb-10 max-w-4xl text-lg text-customColor6">
        <h2 className="mt-6 text-2xl font-semibold">Who we are</h2>
        <p>
          Welcome to Reddish Trends this Website is owned and operated by{" "}
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
          webiste is that it uses a social media platform to provide users with 
          a platform to get trading insights which are easy to understand. 
          This webiste was inspired by wallstreetbets.
          page.
        </p>
      </div>
    </div>
  );
}
