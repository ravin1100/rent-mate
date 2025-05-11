import React, { useState, useEffect } from "react";
import { householdApi, useHousehold } from "../../contexts/HouseholdContext";

interface CalendarEntry {
  title: string;
  type: string;
  dueDate: string[];
}

const Calendar: React.FC = () => {
  const { household } = useHousehold();
  const [calendarEntries, setCalendarEntries] = useState<CalendarEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDateEntries, setSelectedDateEntries] = useState<
    CalendarEntry[]
  >([]);

  useEffect(() => {
    if (!household) return;

    const fetchCalendarData = async () => {
      try {
        setLoading(true);

        // Get the first and last day of the current month for API query
        const year = currentMonth.getFullYear();
        const month = currentMonth.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);

        // Format dates for API
        const fromDate = firstDay.toISOString().split("T")[0];
        const toDate = lastDay.toISOString().split("T")[0];

        // Fetch calendar entries from the API
        const response = await householdApi.get(
          `/api/calender/entries?fromDate=${fromDate}&toDate=${toDate}`
        );

        setCalendarEntries(response.data);
        setLoading(false);
      } catch (err: any) {
        setError(
          err.response?.data?.message || "Failed to fetch calendar data"
        );
        setLoading(false);
      }
    };

    fetchCalendarData();
  }, [household, currentMonth]);

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };

  // Handle date selection for modal display
  const handleDateClick = (date: Date, entries: CalendarEntry[]) => {
    setSelectedDate(date);
    setSelectedDateEntries(entries);
    setIsModalOpen(true);
  };

  // Close the modal
  const closeModal = () => {
    setIsModalOpen(false);
  };

  const renderCalendar = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDayOfMonth = getFirstDayOfMonth(year, month);

    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(
        <div
          key={`empty-${i}`}
          className="h-24 border border-gray-200 bg-gray-50"
        ></div>
      );
    }

    // Add cells for each day of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const currentDate = new Date(year, month, day);
      const dateString = currentDate.toISOString().split("T")[0];

      // Find entries for this day
      const dayEntries = calendarEntries.filter((entry) => {
        return entry.dueDate.some((date) => date.includes(dateString));
      });

      // Group entries by type
      const choreEntries = dayEntries.filter((entry) => entry.type === "CHORE");
      const expenseEntries = dayEntries.filter(
        (entry) => entry.type === "EXPENSE"
      );

      // Count of entries by type
      const choreCount = choreEntries.length;
      const expenseCount = expenseEntries.length;

      // Determine if this day has any entries
      const hasEntries = choreCount > 0 || expenseCount > 0;

      days.push(
        <div
          key={day}
          onClick={() => hasEntries && handleDateClick(currentDate, dayEntries)}
          className={`h-24 border border-gray-200 p-1 overflow-hidden ${
            hasEntries ? "cursor-pointer hover:bg-gray-50" : ""
          }`}
        >
          <div className="font-medium">{day}</div>
          <div className="space-y-1 mt-1 text-xs">
            {choreCount > 0 && (
              <div className="bg-blue-100 text-blue-800 p-1 rounded flex justify-between items-center">
                <span>Chores</span>
                <span className="font-bold">{choreCount}</span>
              </div>
            )}
            {expenseCount > 0 && (
              <div className="bg-green-100 text-green-800 p-1 rounded flex justify-between items-center">
                <span>Expenses</span>
                <span className="font-bold">{expenseCount}</span>
              </div>
            )}
          </div>
        </div>
      );
    }

    return days;
  };

  const previousMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1)
    );
  };

  const nextMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1)
    );
  };

  if (!household) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">No Household Found</h2>
          <p>You need to create or join a household to view the calendar.</p>
        </div>
      </div>
    );
  }

  // Render the day details modal
  const renderDayDetailsModal = () => {
    if (!selectedDate || !isModalOpen) return null;

    const formattedDate = selectedDate.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    // Group entries by type
    const choreEntries = selectedDateEntries.filter(
      (entry) => entry.type === "CHORE"
    );
    const expenseEntries = selectedDateEntries.filter(
      (entry) => entry.type === "EXPENSE"
    );

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
          {/* Modal Header */}
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-4 text-white">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-semibold">{formattedDate}</h3>
              <button
                onClick={closeModal}
                className="text-white hover:text-gray-200 focus:outline-none"
              >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Modal Content */}
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-8rem)]">
            {/* Chores Section */}
            {choreEntries.length > 0 && (
              <div className="mb-6">
                <h4 className="text-lg font-semibold mb-3 text-blue-600 flex items-center">
                  <svg
                    className="h-5 w-5 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    />
                  </svg>
                  Chores
                </h4>
                <div className="space-y-3">
                  {choreEntries.map((chore, index) => (
                    <div
                      key={`chore-${index}`}
                      className="bg-blue-50 p-3 rounded-lg border border-blue-100"
                    >
                      <div className="font-medium">{chore.title}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Expenses Section */}
            {expenseEntries.length > 0 && (
              <div>
                <h4 className="text-lg font-semibold mb-3 text-green-600 flex items-center">
                  <svg
                    className="h-5 w-5 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  Expenses
                </h4>
                <div className="space-y-3">
                  {expenseEntries.map((expense, index) => (
                    <div
                      key={`expense-${index}`}
                      className="bg-green-50 p-3 rounded-lg border border-green-100"
                    >
                      <div className="font-medium">{expense.title}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {selectedDateEntries.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <p>No entries for this date.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Calendar</h1>
        <p className="text-gray-500">
          View your household's chores and expenses
        </p>
      </div>

      {error && (
        <div
          className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative mb-6"
          role="alert"
        >
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-4 flex items-center justify-between">
          <button
            onClick={previousMonth}
            className="p-2 rounded-md hover:bg-gray-100"
          >
            &lt; Previous
          </button>
          <h2 className="text-xl font-semibold">
            {currentMonth.toLocaleString("default", {
              month: "long",
              year: "numeric",
            })}
          </h2>
          <button
            onClick={nextMonth}
            className="p-2 rounded-md hover:bg-gray-100"
          >
            Next &gt;
          </button>
        </div>

        <div className="grid grid-cols-7 text-center font-medium border-b border-gray-200 bg-gray-50">
          <div className="py-2">Sun</div>
          <div className="py-2">Mon</div>
          <div className="py-2">Tue</div>
          <div className="py-2">Wed</div>
          <div className="py-2">Thu</div>
          <div className="py-2">Fri</div>
          <div className="py-2">Sat</div>
        </div>

        {loading ? (
          <div className="text-center py-8">
            <p>Loading calendar...</p>
          </div>
        ) : (
          <div className="grid grid-cols-7">{renderCalendar()}</div>
        )}
      </div>

      <div className="mt-6 flex space-x-4">
        <div className="flex items-center">
          <div className="w-4 h-4 bg-blue-100 rounded mr-2"></div>
          <span>Chores</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-green-100 rounded mr-2"></div>
          <span>Expenses</span>
        </div>
      </div>

      {/* Render the day details modal */}
      {renderDayDetailsModal()}
    </div>
  );
};

export default Calendar;
