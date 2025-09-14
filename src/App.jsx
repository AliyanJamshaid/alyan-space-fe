import { useState } from 'react'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-2xl p-8 max-w-md w-full mx-4">
        <h1 className="text-4xl font-bold text-gray-800 text-center mb-8">
          Alyan Space
        </h1>

        <div className="text-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">
            Tailwind CSS Test
          </h2>
          <p className="text-gray-600 mb-6">
            Testing if Tailwind CSS is working properly
          </p>
        </div>

        <div className="text-center">
          <button
            onClick={() => setCount((count) => count + 1)}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200 transform hover:scale-105"
          >
            Count is {count}
          </button>
        </div>

        <div className="mt-8 p-4 bg-gray-100 rounded-lg">
          <p className="text-sm text-gray-600 text-center">
            ✅ If you see styling, Tailwind CSS is working!
          </p>
        </div>
      </div>
    </div>
  )
}

export default App
