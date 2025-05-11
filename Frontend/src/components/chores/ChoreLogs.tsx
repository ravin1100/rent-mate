import React, { useState, useEffect } from "react";
import { householdApi } from "../../contexts/HouseholdContext";

interface ChoreLogsProps {
  chores: any[];
  household: any;
}

const ChoreLogs: React.FC<ChoreLogsProps> = ({ chores, household }) => {
  const [choreLogs, setChoreLogs] = useState<any[]>([]);
  const [logsLoading, setLogsLoading] = useState(false);
  const [logsError, setLogsError] = useState<string | null>(null);
  const [selectedChoreForLogs, setSelectedChoreForLogs] = useState<string | null>(null);

  // Fetch logs when component mounts or when selectedChoreForLogs changes
  useEffect(() => {
    if (household) {
      fetchChoreLogs(selectedChoreForLogs || undefined);
    }
  }, [selectedChoreForLogs, household]);

  const fetchChoreLogs = async (choreId?: string) => {
    if (!household) return;

    try {
      setLogsLoading(true);
      setLogsError(null);
      let url = '/api/chores/logs';
      if (choreId) {
        url += `?choreId=${choreId}`;
      }
      const response = await householdApi.get(url);
      setChoreLogs(response.data);
    } catch (err: any) {
      setLogsError(err.response?.data?.message || "Failed to fetch chore logs");
      setChoreLogs([]);
    } finally {
      setLogsLoading(false);
    }
  };

  return (
    <>
      {/* Chore Filter for Logs */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-8">
        <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-2 text-indigo-500"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z"
              clipRule="evenodd"
            />
          </svg>
          Filter Logs
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label
              htmlFor="filterChore"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Filter by Chore
            </label>
            <div className="relative">
              <select
                id="filterChore"
                value={selectedChoreForLogs || ""}
                onChange={(e) => setSelectedChoreForLogs(e.target.value === "" ? null : e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 appearance-none bg-white"
              >
                <option value="">All Chores</option>
                {chores.map((chore) => (
                  <option key={chore.id} value={chore.id}>
                    {chore.name}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg
                  className="fill-current h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Logs Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        {logsError && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4 flex items-center">
            <svg className="h-5 w-5 text-red-500 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-sm text-red-700">{logsError}</span>
          </div>
        )}
        
        {logsLoading ? (
          <div className="text-center py-16 flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mb-4"></div>
            <p className="text-gray-600 font-medium">Loading chore logs...</p>
          </div>
        ) : choreLogs.length === 0 ? (
          <div className="text-center py-16">
            <svg className="h-16 w-16 text-gray-300 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <p className="text-gray-500 text-lg">No chore logs found</p>
            <p className="text-gray-400 mt-1">Logs will appear here when chores are assigned or completed</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Chore Name
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Assigned To
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Assigned On
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Completed On
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {choreLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-gray-50 transition-colors duration-150">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {log.choreName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {log.assignedToName}
                      <div className="text-xs text-gray-400">{log.assignedToEmail}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(log.assignedOn).toLocaleDateString()} 
                      <div className="text-xs text-gray-400">{new Date(log.assignedOn).toLocaleTimeString()}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {log.completedOn ? (
                        <>
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            {new Date(log.completedOn).toLocaleDateString()}
                          </span>
                        </>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          Pending
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
};

export default ChoreLogs;
