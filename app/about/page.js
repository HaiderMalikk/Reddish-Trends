// app/about/page.js

export default function About() {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
        <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
          <h1 className="text-3xl font-semibold text-blue-600">About Us</h1>
          <p className="mt-4 text-lg text-gray-700">
            This is the About page of our amazing application. We are passionate about providing the best experience to our users.
          </p>
          <p className="mt-4 text-sm text-gray-600">
            More detailed information about the company or app can go here. This is just placeholder text.
          </p>
        </div>
      </div>
    );
  }
  