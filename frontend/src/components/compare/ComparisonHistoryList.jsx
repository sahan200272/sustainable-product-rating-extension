import { Link } from "react-router-dom";
import { FiTrash2, FiClock, FiChevronRight, FiPackage } from "react-icons/fi";

export default function ComparisonHistoryList({ history, onDelete, onClearAll }) {
  if (!history || history.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center bg-white rounded-3xl shadow-sm border border-gray-100 p-16 text-center">
        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
          <FiPackage className="w-10 h-10 text-gray-300" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">No Comparisons Yet</h3>
        <p className="text-gray-500 max-w-sm mb-6">
          You haven't compared any products. Go back to the main page to start exploring sustainable alternatives.
        </p>
        <Link
          to="/compare"
          className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold transition-all shadow-md"
        >
          Start Comparing
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 border-b border-gray-100 pb-4">
        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <FiClock className="text-emerald-500" /> History
        </h2>
        <button
          onClick={() => {
            if (window.confirm("Are you sure you want to clear all history?")) {
              onClearAll();
            }
          }}
          className="text-sm font-medium text-red-500 hover:text-red-700 mt-4 sm:mt-0 px-4 py-2 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
        >
          Clear All
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {history.map((comp) => {
          const p1 = comp.products[0];
          const p2 = comp.products[1];
          // Handle cases where a product might have been deleted from DB but stays in history 
          // depends on if mongoose populate works fully or returns null
          if (!p1 || !p2) return null;

          const isWin1 = comp.comparisonScore?.winner === p1._id;
          const isWin2 = comp.comparisonScore?.winner === p2._id;

          const date = new Date(comp.createdAt).toLocaleDateString(undefined, { 
            year: 'numeric', month: 'short', day: 'numeric' 
          });

          return (
            <div key={comp._id} className="group relative flex flex-col sm:flex-row items-center gap-4 p-4 border border-gray-100 rounded-xl hover:shadow-md transition-all bg-gray-50/50 hover:bg-white text-left">
              
              <div className="flex flex-1 w-full gap-4 items-center">
                
                {/* Product 1 */}
                <div className={`flex flex-col flex-1 rounded-lg p-3 border ${isWin1 ? 'bg-emerald-50 border-emerald-200' : 'bg-white border-gray-100'}`}>
                  <span className="text-xs text-gray-400 mb-1 leading-none">{p1.brand}</span>
                  <span className="font-semibold text-gray-900 leading-tight line-clamp-1">{p1.name}</span>
                </div>
                
                <span className="text-xs font-bold text-gray-400 px-2">VS</span>

                {/* Product 2 */}
                <div className={`flex flex-col flex-1 rounded-lg p-3 border ${isWin2 ? 'bg-emerald-50 border-emerald-200' : 'bg-white border-gray-100'}`}>
                  <span className="text-xs text-gray-400 mb-1 leading-none">{p2.brand}</span>
                  <span className="font-semibold text-gray-900 leading-tight line-clamp-1">{p2.name}</span>
                </div>

              </div>

              <div className="flex items-center gap-4 w-full sm:w-auto mt-4 sm:mt-0 border-t sm:border-t-0 pt-4 sm:pt-0 border-gray-200">
                <span className="text-xs font-medium text-gray-400 min-w-[80px] text-center sm:text-right">
                  {date}
                </span>

                <Link
                  to={`/compare/${comp._id}`}
                  className="p-2 text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors ml-auto sm:ml-0"
                  aria-label="View Details"
                >
                  <FiChevronRight className="w-5 h-5"/>
                </Link>

                <button
                  onClick={() => {
                    if (window.confirm("Delete this comparison?")) {
                      onDelete(comp._id);
                    }
                  }}
                  className="p-2 text-red-400 hover:text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
                  aria-label="Delete"
                >
                  <FiTrash2 className="w-5 h-5"/>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
