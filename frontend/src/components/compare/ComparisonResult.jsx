import { 
  FiCheckCircle, 
  FiXCircle, 
  FiAward, 
  FiCpu, 
  FiInfo, 
  FiClock, 
  FiArrowRight,
  FiAlertCircle
} from "react-icons/fi";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js';
import { Radar } from 'react-chartjs-2';

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

const booleanFeature = (isTrue) => (
  <div className="flex justify-center">
    {isTrue ? (
      <FiCheckCircle className="text-emerald-500 w-5 h-5" />
    ) : (
      <FiXCircle className="text-red-400 w-5 h-5" />
    ) || <span className="text-gray-300">-</span>}
  </div>
);

export default function ComparisonResult({ result }) {
  const { user } = useAuth();

  if (!result) return null;

  const {
    products,
    sustainabilityHighlights,
    comparisonGraph,
    aiVerdict,
    recommendations
  } = result;

  // Fallback if backend returned the unnormalized raw result (which happens if Nodemon refused to restart)
  const comparisonScore = result.comparisonScore || {
    product1Score: result.scores?.product1,
    product2Score: result.scores?.product2,
    winner: result.winner,
    scoreDifference: result.scores?.difference
  };

  const p1 = products[0];
  const p2 = products[1];

  const chartOptions = {
    responsive: true,
    scales: {
      r: {
        angleLines: { color: 'rgba(0, 0, 0, 0.05)' },
        grid: { color: 'rgba(0, 0, 0, 0.05)' },
        pointLabels: {
          font: { size: 12, family: "'Inter', sans-serif" },
          color: '#4B5563'
        },
        ticks: { display: false, min: 0, max: 100 }
      }
    },
    plugins: {
      legend: {
        position: 'bottom',
        labels: { padding: 20, font: { size: 14 } }
      }
    }
  };

  // Modify backend colors to match our theme if necessary
  const formattedGraphData = comparisonGraph ? {
    labels: comparisonGraph.labels,
    datasets: comparisonGraph.datasets.map((dataset, i) => ({
      ...dataset,
      backgroundColor: i === 0 ? 'rgba(16, 185, 129, 0.2)' : 'rgba(99, 102, 241, 0.2)',
      borderColor: i === 0 ? '#10b981' : '#6366f1',
      pointBackgroundColor: i === 0 ? '#10b981' : '#6366f1',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: i === 0 ? '#10b981' : '#6366f1',
      borderWidth: 2,
    }))
  } : null;

  return (
    <div className="flex flex-col gap-8 animate-in fade-in zoom-in-95 duration-500">
      
      {/* Header Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[p1, p2].map((p, index) => {
          const isWinner = comparisonScore.winner === p._id;
          return (
            <div 
              key={p._id || index} 
              className={`relative bg-white rounded-2xl shadow-sm border p-6 flex items-center gap-6 overflow-hidden ${
                isWinner ? 'border-emerald-400 shadow-emerald-100/50' : 'border-gray-100'
              }`}
            >
              {isWinner && (
                <div className="absolute -top-6 -right-6 w-24 h-24 bg-emerald-50 rounded-full flex items-end justify-start p-5">
                  <FiAward className="w-8 h-8 text-emerald-500" />
                </div>
              )}
              <div className="w-24 h-24 rounded-xl overflow-hidden bg-gray-50 flex-shrink-0 border border-gray-100">
                <img 
                  src={p.images && p.images[0] ? (p.images[0].url || p.images[0]) : "https://via.placeholder.com/100"} 
                  alt={p.name} 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 pr-8">
                <div className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">{p.brand}</div>
                <h3 className="text-xl font-bold text-gray-900 leading-tight mb-2">{p.name}</h3>
                <div className="inline-flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-200">
                  <span className="text-xs text-gray-500 font-medium">Score:</span>
                  <span className={`text-lg font-bold ${isWinner ? 'text-emerald-600' : 'text-gray-700'}`}>
                    {index === 0 ? comparisonScore.product1Score : comparisonScore.product2Score}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Radar Chart */}
        {formattedGraphData && (
          <div className="lg:col-span-1 bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-center">
            <h4 className="text-lg font-bold text-gray-900 mb-6 self-start w-full border-b border-gray-100 pb-4">Performance Comparison</h4>
            <div className="w-full max-w-sm aspect-square">
              <Radar data={formattedGraphData} options={chartOptions} />
            </div>
          </div>
        )}

        {/* Detailed Metrics Table */}
        <div className={`bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden ${formattedGraphData ? 'lg:col-span-2' : 'lg:col-span-3'}`}>
          <div className="p-6 border-b border-gray-100">
             <h4 className="text-lg font-bold text-gray-900">Metrics Breakdown</h4>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="p-4 font-semibold text-gray-600 border-b border-gray-200 text-sm">Feature</th>
                  <th className="p-4 font-bold text-emerald-700 border-b border-gray-200 text-center w-1/3">{p1.name}</th>
                  <th className="p-4 font-bold text-indigo-700 border-b border-gray-200 text-center w-1/3">{p2.name}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                <tr>
                  <td className="p-4 text-sm font-medium text-gray-700">Recyclable</td>
                  <td className="p-4 text-center">{booleanFeature(p1.sustainability?.recyclableMaterial)}</td>
                  <td className="p-4 text-center">{booleanFeature(p2.sustainability?.recyclableMaterial)}</td>
                </tr>
                <tr>
                  <td className="p-4 text-sm font-medium text-gray-700">Biodegradable</td>
                  <td className="p-4 text-center">{booleanFeature(p1.sustainability?.biodegradable)}</td>
                  <td className="p-4 text-center">{booleanFeature(p2.sustainability?.biodegradable)}</td>
                </tr>
                <tr>
                  <td className="p-4 text-sm font-medium text-gray-700">Plastic Free</td>
                  <td className="p-4 text-center">{booleanFeature(p1.sustainability?.plasticFree)}</td>
                  <td className="p-4 text-center">{booleanFeature(p2.sustainability?.plasticFree)}</td>
                </tr>
                <tr>
                  <td className="p-4 text-sm font-medium text-gray-700">Cruelty Free</td>
                  <td className="p-4 text-center">{booleanFeature(p1.sustainability?.crueltyFree)}</td>
                  <td className="p-4 text-center">{booleanFeature(p2.sustainability?.crueltyFree)}</td>
                </tr>
                <tr>
                  <td className="p-4 text-sm font-medium text-gray-700">Carbon Footprint</td>
                  <td className="p-4 text-center text-sm font-bold text-emerald-600 bg-emerald-50/30">
                    {p1.sustainability?.carbonFootprint ? `${p1.sustainability.carbonFootprint} kg` : '-'}
                  </td>
                  <td className="p-4 text-center text-sm font-bold text-indigo-600 bg-indigo-50/30">
                    {p2.sustainability?.carbonFootprint ? `${p2.sustainability.carbonFootprint} kg` : '-'}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Highlights & Verdict */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Left Column: Advantages */}
        <div className="flex flex-col gap-6">
          {(sustainabilityHighlights?.product1Advantages?.length > 0 || sustainabilityHighlights?.product2Advantages?.length > 0) && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h4 className="text-lg font-bold text-gray-900 mb-6">Key Advantages</h4>
              <div className="space-y-6">
                {sustainabilityHighlights.product1Advantages?.length > 0 && (
                  <div>
                    <h5 className="text-sm font-bold text-emerald-700 uppercase tracking-widest mb-3">{p1.name}</h5>
                    <ul className="space-y-2">
                      {sustainabilityHighlights.product1Advantages.map((adv, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                          <FiCheckCircle className="text-emerald-500 w-4 h-4 mt-0.5 flex-shrink-0" />
                          <span>{adv}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {sustainabilityHighlights.product2Advantages?.length > 0 && (
                  <div>
                    <h5 className="text-sm font-bold text-indigo-700 uppercase tracking-widest mb-3">{p2.name}</h5>
                    <ul className="space-y-2">
                      {sustainabilityHighlights.product2Advantages.map((adv, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                          <FiCheckCircle className="text-indigo-400 w-4 h-4 mt-0.5 flex-shrink-0" />
                          <span>{adv}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Recommendations if any */}
          {recommendations && (
             <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
               <h4 className="text-lg font-bold text-gray-900 mb-6">Recommendations</h4>
               
               {recommendations.general?.length > 0 && (
                 <div className="mb-4 bg-gray-50 border border-gray-200 p-4 rounded-xl">
                   <div className="flex items-center gap-2 mb-2 text-gray-800 font-semibold text-sm">
                     <FiInfo className="text-gray-500"/> General Insights
                   </div>
                   <ul className="list-disc pl-5 space-y-1 text-sm text-gray-600">
                     {recommendations.general.map((rec, i) => <li key={i}>{rec}</li>)}
                   </ul>
                 </div>
               )}

               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                 {recommendations.product1Suggestions?.length > 0 && (
                   <div className="border border-emerald-100 bg-emerald-50/30 p-4 rounded-xl">
                      <h5 className="text-xs font-bold text-emerald-700 uppercase mb-2 line-clamp-1" title={`For ${p1.name}`}>For {p1.name}</h5>
                      <ul className="space-y-1 text-sm text-gray-600 list-disc pl-4">
                        {recommendations.product1Suggestions.map((rec, i) => <li key={i}>{rec}</li>)}
                      </ul>
                   </div>
                 )}
                 {recommendations.product2Suggestions?.length > 0 && (
                   <div className="border border-indigo-100 bg-indigo-50/30 p-4 rounded-xl">
                      <h5 className="text-xs font-bold text-indigo-700 uppercase mb-2 line-clamp-1" title={`For ${p2.name}`}>For {p2.name}</h5>
                      <ul className="space-y-1 text-sm text-gray-600 list-disc pl-4">
                        {recommendations.product2Suggestions.map((rec, i) => <li key={i}>{rec}</li>)}
                      </ul>
                   </div>
                 )}
               </div>
             </div>
          )}
        </div>

        {/* Right Column: AI Verdict */}
        <div className="h-full">
          <div className="h-full rounded-2xl shadow-lg border border-purple-200 bg-gradient-to-br from-indigo-900 via-purple-900 to-fuchsia-900 p-8 flex flex-col items-center justify-center text-center relative overflow-hidden">
            {/* Glassmorphism decoration */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

            <div className="relative z-10 w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center mb-6 shadow-xl border border-white/20">
              <FiCpu className="w-8 h-8 text-purple-200" />
            </div>
            <h4 className="relative z-10 text-2xl font-black text-white tracking-widest uppercase mb-6">AI Verdict</h4>
            <div className="relative z-10 text-lg text-purple-100 leading-relaxed max-w-md mx-auto italic font-light font-serif">
              "{aiVerdict}"
            </div>
          </div>
        </div>

      </div>

      {/* Footer Actions */}
      <div className="flex flex-col sm:flex-row items-center justify-between bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mt-4">
        <div className="flex items-center gap-3 text-gray-500 text-sm mb-4 sm:mb-0">
          <FiAlertCircle className="w-5 h-5 text-emerald-500"/>
          {user ? (
            <span>This comparison was automatically saved to your history.</span>
          ) : (
            <span>Register an account to automatically save your comparisons.</span>
          )}
        </div>
        
        <div className="flex gap-4">
          {user && (
            <Link
              to="/compare/history"
              className="px-6 py-2.5 bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-700 rounded-xl font-medium transition-colors flex items-center gap-2"
            >
              <FiClock /> View in History
            </Link>
          )}
          <Link
            to="/compare"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} // if already on /compare, it just scrolls up. Better UX.
            className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold transition-shadow shadow-md flex items-center gap-2"
          >
            New Comparison <FiArrowRight />
          </Link>
        </div>
      </div>
    </div>
  );
}
