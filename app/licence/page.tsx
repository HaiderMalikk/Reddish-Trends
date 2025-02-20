export default function License() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-customColor2 p-8">
      <h1 className="mb-4 text-4xl font-bold text-customColor6">License</h1>
      <div className="mb-10 max-w-4xl text-lg text-customColor6">
        <p>Copyright 2025 Haider Ali Gazi Malik</p>

        <p className="mt-6">
          Permission is hereby granted, free of charge, to any person obtaining
          a copy of this software and associated documentation files (the
          "Software"), to use, copy, modify, and distribute the Software for
          personal, academic, or educational purposes only, subject to the
          following conditions:
        </p>

        <ul className="mt-4 list-inside list-disc">
          <li>
            Commercial use of this Software, in whole or in part, is strictly
            prohibited without prior written consent from the copyright holder.
            This includes, but is not limited to:
            <ul className="ml-6 mt-2 list-inside list-disc">
              <li>Selling or licensing the Software.</li>
              <li>
                Using the Software as part of a product or service that
                generates revenue.
              </li>
            </ul>
          </li>
          <li className="mt-4">
            Redistributions of the Software must include this copyright notice
            and the full terms of this license.
          </li>
          <li className="mt-4">
            Any modified versions of this Software must be clearly marked as
            such, and must not misrepresent the original author or creator.
          </li>
        </ul>

        <p className="mt-6">
          THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
          EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
          MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND
          NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
          LIABLE FOR ANY CLAIM, DAMAGES, OR OTHER LIABILITY, WHETHER IN AN
          ACTION OF CONTRACT, TORT, OR OTHERWISE, ARISING FROM, OUT OF, OR IN
          CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
          SOFTWARE.
        </p>
      </div>
    </div>
  );
}
