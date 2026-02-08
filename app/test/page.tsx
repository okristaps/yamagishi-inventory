export default function Test() {
  return (
    <div className="p-6 space-y-4">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
        Test
      </h1>
      <div className="space-y-4 max-w-md">
        <input 
          type="text" 
          placeholder="Test keyboard behavior"
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-dark-input text-gray-900 dark:text-gray-100"
        />
        <textarea 
          placeholder="Multi-line test input"
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-dark-input text-gray-900 dark:text-gray-100 h-24"
        />
      </div>
    </div>
  );
}