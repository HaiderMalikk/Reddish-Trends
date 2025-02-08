export default function License() {
    return (
      <div className="min-h-screen bg-customColor1 flex flex-col items-center justify-center p-8 mt-20">
        <h1 className="text-4xl font-bold text-customColor2 mb-4">License</h1>
        <div className="text-lg text-customColor2 max-w-4xl">
          <p>Copyright 2025 Haider Ali Gazi Malik</p>
  
          <p className="mt-6">
            Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to use, copy, modify, and distribute the Software for personal, academic, or educational purposes only, subject to the following conditions:
          </p>
  
          <ul className="list-disc list-inside mt-4">
            <li>
              Commercial use of this Software, in whole or in part, is strictly prohibited without prior written consent from the copyright holder. This includes, but is not limited to:
              <ul className="list-disc list-inside ml-6 mt-2">
                <li>Selling or licensing the Software.</li>
                <li>Using the Software as part of a product or service that generates revenue.</li>
              </ul>
            </li>
            <li className="mt-4">
              Redistributions of the Software must include this copyright notice and the full terms of this license.
            </li>
            <li className="mt-4">
              Any modified versions of this Software must be clearly marked as such, and must not misrepresent the original author or creator.
            </li>
          </ul>
  
          <p className="mt-6">
            THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES, OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT, OR OTHERWISE, ARISING FROM, OUT OF, OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
          </p>
        </div>
      </div>
    );
  }