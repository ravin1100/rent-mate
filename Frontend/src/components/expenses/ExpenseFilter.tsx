import React from "react";
import { useHousehold } from "../../contexts/HouseholdContext";

interface ExpenseFilterProps {
  filterPaidBy: string;
  setFilterPaidBy: (value: string) => void;
  filterCategory: string;
  setFilterCategory: (value: string) => void;
  filterDateRange: "all" | "week" | "month" | "year";
  setFilterDateRange: (value: "all" | "week" | "month" | "year") => void;
}

const ExpenseFilter: React.FC<ExpenseFilterProps> = ({
  filterPaidBy,
  setFilterPaidBy,
  filterCategory,
  setFilterCategory,
  filterDateRange,
  setFilterDateRange,
}) => {
  const { household } = useHousehold();
  
  const categories = [
    { value: "all", label: "All Categories" },
    { value: "groceries", label: "Groceries" },
    { value: "rent", label: "Rent" },
    { value: "utilities", label: "Utilities" },
    { value: "entertainment", label: "Entertainment" },
    { value: "dining", label: "Dining" },
    { value: "transportation", label: "Transportation" },
    { value: "other", label: "Other" },
  ];

  const dateRanges = [
    { value: "all", label: "All Time" },
    { value: "week", label: "This Week" },
    { value: "month", label: "This Month" },
    { value: "year", label: "This Year" },
  ];

  return (
    <div className="p-4 bg-gray-50 border-b border-gray-100 rounded-t-xl">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div>
            <label htmlFor="filterCategory" className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              id="filterCategory"
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            >
              {categories.map((category) => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="filterPaidBy" className="block text-sm font-medium text-gray-700 mb-1">
              Paid By
            </label>
            <select
              id="filterPaidBy"
              value={filterPaidBy}
              onChange={(e) => setFilterPaidBy(e.target.value)}
              className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            >
              <option value="all">All Members</option>
              {household?.members.map((member: any) => (
                <option key={member.id} value={member.id}>
                  {member.firstName} {member.lastName}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="filterDateRange" className="block text-sm font-medium text-gray-700 mb-1">
              Date Range
            </label>
            <select
              id="filterDateRange"
              value={filterDateRange}
              onChange={(e) => setFilterDateRange(e.target.value as "all" | "week" | "month" | "year")}
              className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            >
              {dateRanges.map((range) => (
                <option key={range.value} value={range.value}>
                  {range.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpenseFilter;
