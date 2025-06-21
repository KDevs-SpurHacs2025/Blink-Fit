export default function Survey() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-xl text-center">
        <div className="w-full h-2 bg-gray-200 rounded-full mb-6">
          <div
            className="h-full bg-green-500 rounded-full"
            style={{ width: "40%" }}
          ></div>
        </div>

        <h2 className="text-2xl text-black font-bold text-center mb-8">
          Eye Health Quiz
        </h2>

        {/* 질문 반복 */}
        <div className="space-y-6 mb-8 text-black">
          {Array(2)
            .fill(0)
            .map((_, i) => (
              <div key={i}>
                <p className="font-medium mb-2">
                  Do you wear glasses or contact lenses?
                </p>
                <div className="space-y-2">
                  {[
                    "I don't wear any",
                    "Glasses",
                    "Contact Lenses",
                    "Both",
                  ].map((option, index) => (
                    <label
                      key={index}
                      className="flex items-center gap-2 bg-gray-50 border rounded-md px-3 py-2 cursor-pointer"
                    >
                      <input
                        type="radio"
                        name={`question${i}`}
                        className="form-radio text-green-500"
                      />
                      <span className="text-sm">{option}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
        </div>

        {/* 하단 버튼 */}
        <button className="w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600 transition">
          Next
        </button>
      </div>
    </div>
  );
}
