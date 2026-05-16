import { useState } from "react";
import {
  Search,
  ChevronUp,
  ChevronDown,
  ChevronsUpDown,
  ChevronLeft,
  ChevronRight,
  Users,
  Wifi,
  WifiOff,
  Clock,
  ArrowRightLeft,
  CheckCircle2,
  Loader2,
  Filter,
  X,
  Radio,
} from "lucide-react";
import { useSkillSwapData, SortField } from "../../hooks/useSkillSwapData";
import { formatTimeAgo, SkillSwapUser } from "../../services/mockSkillSwapData";

// ─── Sort Header ────────────────────────────────────────────────────────────
function SortableHeader({
  label,
  field,
  currentField,
  direction,
  onSort,
}: {
  label: string;
  field: SortField;
  currentField: SortField;
  direction: "asc" | "desc";
  onSort: (f: SortField) => void;
}) {
  const isActive = currentField === field;
  return (
    <th
      className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer select-none group hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
      onClick={() => onSort(field)}
    >
      <div className="flex items-center gap-1.5">
        <span>{label}</span>
        <span className="inline-flex">
          {isActive ? (
            direction === "asc" ? (
              <ChevronUp className="w-3.5 h-3.5 text-blue-500" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5 text-blue-500" />
            )
          ) : (
            <ChevronsUpDown className="w-3.5 h-3.5 opacity-0 group-hover:opacity-50 transition-opacity" />
          )}
        </span>
      </div>
    </th>
  );
}

// ─── Status Badge ───────────────────────────────────────────────────────────
function AvailabilityBadge({ status }: { status: "Online" | "Offline" }) {
  if (status === "Online") {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 text-xs font-medium rounded-full border border-emerald-200 dark:border-emerald-800/50">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
        </span>
        Online
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-gray-100 dark:bg-gray-800/60 text-gray-500 dark:text-gray-400 text-xs font-medium rounded-full border border-gray-200 dark:border-gray-700/50">
      <span className="h-2 w-2 rounded-full bg-gray-400 dark:bg-gray-500"></span>
      Offline
    </span>
  );
}

function SwapStatusBadge({ status }: { status: "Pending" | "Accepted" | "Completed" }) {
  const styles = {
    Pending: {
      bg: "bg-amber-50 dark:bg-amber-950/40",
      text: "text-amber-600 dark:text-amber-400",
      border: "border-amber-200 dark:border-amber-800/50",
      icon: <Loader2 className="w-3 h-3 animate-spin" />,
    },
    Accepted: {
      bg: "bg-blue-50 dark:bg-blue-950/40",
      text: "text-blue-600 dark:text-blue-400",
      border: "border-blue-200 dark:border-blue-800/50",
      icon: <ArrowRightLeft className="w-3 h-3" />,
    },
    Completed: {
      bg: "bg-emerald-50 dark:bg-emerald-950/40",
      text: "text-emerald-600 dark:text-emerald-400",
      border: "border-emerald-200 dark:border-emerald-800/50",
      icon: <CheckCircle2 className="w-3 h-3" />,
    },
  };

  const s = styles[status];

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 ${s.bg} ${s.text} text-xs font-medium rounded-full border ${s.border}`}
    >
      {s.icon}
      {status}
    </span>
  );
}

// ─── Filter Dropdown ────────────────────────────────────────────────────────
function FilterDropdown({
  label,
  value,
  options,
  onChange,
  icon,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (val: string) => void;
  icon?: React.ReactNode;
}) {
  return (
    <div className="relative">
      <label className="block text-[10px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-1">
        {label}
      </label>
      <div className="relative">
        {icon && (
          <div className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 pointer-events-none">
            {icon}
          </div>
        )}
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`appearance-none w-full ${icon ? "pl-8" : "pl-3"} pr-8 py-2 text-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition-all cursor-pointer hover:border-gray-300 dark:hover:border-gray-600`}
        >
          <option value="All">All</option>
          {options.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
      </div>
    </div>
  );
}

// ─── User Row ───────────────────────────────────────────────────────────────
function UserRow({
  user,
  isHighlighted,
  isNew,
}: {
  user: SkillSwapUser;
  isHighlighted: boolean;
  isNew: boolean;
}) {
  return (
    <tr
      className={`
        border-b border-gray-100 dark:border-gray-800/50 transition-all duration-500
        ${
          isNew
            ? "bg-emerald-50/50 dark:bg-emerald-950/20 animate-pulse"
            : isHighlighted
            ? "bg-blue-50/50 dark:bg-blue-950/20"
            : "hover:bg-gray-50/80 dark:hover:bg-gray-800/40"
        }
      `}
    >
      {/* User Name */}
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          <div
            className={`
              w-9 h-9 rounded-full flex items-center justify-center text-lg
              ${
                user.availabilityStatus === "Online"
                  ? "bg-gradient-to-br from-emerald-100 to-teal-100 dark:from-emerald-900/40 dark:to-teal-900/40 ring-2 ring-emerald-400/30"
                  : "bg-gray-100 dark:bg-gray-800"
              }
            `}
          >
            {user.avatar}
          </div>
          <span className="font-medium text-sm text-gray-900 dark:text-gray-100">
            {user.userName}
          </span>
        </div>
      </td>

      {/* Skill Offered */}
      <td className="px-4 py-3">
        <span className="inline-flex items-center px-2.5 py-1 bg-violet-50 dark:bg-violet-950/30 text-violet-600 dark:text-violet-400 text-xs font-medium rounded-lg border border-violet-200/60 dark:border-violet-800/40">
          {user.skillOffered}
        </span>
      </td>

      {/* Skill Requested */}
      <td className="px-4 py-3">
        <span className="inline-flex items-center px-2.5 py-1 bg-sky-50 dark:bg-sky-950/30 text-sky-600 dark:text-sky-400 text-xs font-medium rounded-lg border border-sky-200/60 dark:border-sky-800/40">
          {user.skillRequested}
        </span>
      </td>

      {/* Location */}
      <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
        {user.location}
      </td>

      {/* Availability */}
      <td className="px-4 py-3">
        <AvailabilityBadge status={user.availabilityStatus} />
      </td>

      {/* Swap Status */}
      <td className="px-4 py-3">
        <SwapStatusBadge status={user.swapStatus} />
      </td>

      {/* Last Active */}
      <td className="px-4 py-3">
        <div className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400">
          <Clock className="w-3.5 h-3.5" />
          {formatTimeAgo(user.lastActive)}
        </div>
      </td>
    </tr>
  );
}

// ─── Pagination ─────────────────────────────────────────────────────────────
function Pagination({
  currentPage,
  totalPages,
  filteredCount,
  pageSize,
  onPageChange,
  onPageSizeChange,
}: {
  currentPage: number;
  totalPages: number;
  filteredCount: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
}) {
  const start = (currentPage - 1) * pageSize + 1;
  const end = Math.min(currentPage * pageSize, filteredCount);

  // Build page numbers to show
  const getPageNumbers = () => {
    const pages: (number | "...")[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push("...");
      for (
        let i = Math.max(2, currentPage - 1);
        i <= Math.min(totalPages - 1, currentPage + 1);
        i++
      ) {
        pages.push(i);
      }
      if (currentPage < totalPages - 2) pages.push("...");
      pages.push(totalPages);
    }
    return pages;
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-4 py-3 border-t border-gray-200 dark:border-gray-800/50">
      {/* Info & page size */}
      <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
        <span>
          Showing <span className="font-medium text-gray-700 dark:text-gray-200">{start}</span>–
          <span className="font-medium text-gray-700 dark:text-gray-200">{end}</span> of{" "}
          <span className="font-medium text-gray-700 dark:text-gray-200">{filteredCount}</span>
        </span>
        <div className="flex items-center gap-2">
          <span className="text-xs">Rows:</span>
          <select
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            className="appearance-none px-2 py-1 text-xs bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500/40 cursor-pointer"
          >
            {[5, 10, 20, 50].map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Page buttons */}
      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {getPageNumbers().map((page, idx) =>
          page === "..." ? (
            <span key={`dots-${idx}`} className="px-1.5 text-gray-400 text-sm">
              …
            </span>
          ) : (
            <button
              key={page}
              onClick={() => onPageChange(page as number)}
              className={`min-w-[32px] h-8 rounded-lg text-sm font-medium transition-all ${
                currentPage === page
                  ? "bg-blue-500 text-white shadow-md shadow-blue-500/25"
                  : "hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400"
              }`}
            >
              {page}
            </button>
          )
        )}

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

// ─── Main Component ─────────────────────────────────────────────────────────
export default function UserManagement() {
  const data = useSkillSwapData({ pageSize: 10, pollInterval: 3000 });
  const [showFilters, setShowFilters] = useState(false);

  const hasActiveFilters =
    data.skillFilter !== "All" ||
    data.locationFilter !== "All" ||
    data.statusFilter !== "All" ||
    data.swapStatusFilter !== "All";

  const clearFilters = () => {
    data.setSkillFilter("All");
    data.setLocationFilter("All");
    data.setStatusFilter("All");
    data.setSwapStatusFilter("All");
  };

  return (
    <div className="space-y-5">
      {/* ─── Page Header ─────────────────────────────────────────────────── */}
      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent">
            Live Activity Dashboard
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">
            Real-time Skill Swap platform activity · {data.totalCount} total users
          </p>
        </div>

        {/* Live toggle */}
        <button
          onClick={() => data.setIsLive(!data.isLive)}
          className={`
            inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all
            ${
              data.isLive
                ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20"
                : "bg-gray-100 dark:bg-gray-800 text-gray-500 border border-gray-200 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-700"
            }
          `}
        >
          <Radio
            className={`w-4 h-4 ${data.isLive ? "animate-pulse" : ""}`}
          />
          {data.isLive ? "Live" : "Paused"}
          {data.isLive && (
            <span className="text-[10px] text-emerald-500 dark:text-emerald-400 font-normal">
              Updated {formatTimeAgo(data.lastUpdated)}
            </span>
          )}
        </button>
      </div>

      {/* ─── Stats Cards ─────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-white dark:bg-gray-900/80 backdrop-blur rounded-xl p-4 border border-gray-200/80 dark:border-gray-800/60 shadow-sm">
          <div className="flex items-center gap-2.5 mb-2">
            <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/40 rounded-lg flex items-center justify-center">
              <Users className="w-4 h-4 text-blue-500" />
            </div>
            <p className="text-[11px] text-gray-500 dark:text-gray-400 uppercase font-semibold tracking-wider">
              Total Users
            </p>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{data.totalCount}</p>
        </div>

        <div className="bg-white dark:bg-gray-900/80 backdrop-blur rounded-xl p-4 border border-gray-200/80 dark:border-gray-800/60 shadow-sm">
          <div className="flex items-center gap-2.5 mb-2">
            <div className="w-8 h-8 bg-emerald-100 dark:bg-emerald-900/40 rounded-lg flex items-center justify-center">
              <Wifi className="w-4 h-4 text-emerald-500" />
            </div>
            <p className="text-[11px] text-gray-500 dark:text-gray-400 uppercase font-semibold tracking-wider">
              Online Now
            </p>
          </div>
          <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
            {data.onlineCount}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-900/80 backdrop-blur rounded-xl p-4 border border-gray-200/80 dark:border-gray-800/60 shadow-sm">
          <div className="flex items-center gap-2.5 mb-2">
            <div className="w-8 h-8 bg-amber-100 dark:bg-amber-900/40 rounded-lg flex items-center justify-center">
              <Loader2 className="w-4 h-4 text-amber-500" />
            </div>
            <p className="text-[11px] text-gray-500 dark:text-gray-400 uppercase font-semibold tracking-wider">
              Pending Swaps
            </p>
          </div>
          <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">
            {data.pendingCount}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-900/80 backdrop-blur rounded-xl p-4 border border-gray-200/80 dark:border-gray-800/60 shadow-sm">
          <div className="flex items-center gap-2.5 mb-2">
            <div className="w-8 h-8 bg-violet-100 dark:bg-violet-900/40 rounded-lg flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4 text-violet-500" />
            </div>
            <p className="text-[11px] text-gray-500 dark:text-gray-400 uppercase font-semibold tracking-wider">
              Completed
            </p>
          </div>
          <p className="text-2xl font-bold text-violet-600 dark:text-violet-400">
            {data.completedCount}
          </p>
        </div>
      </div>

      {/* ─── Search & Filter Toolbar ─────────────────────────────────────── */}
      <div className="bg-white dark:bg-gray-900/80 backdrop-blur rounded-xl border border-gray-200/80 dark:border-gray-800/60 shadow-sm">
        <div className="p-4 flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              id="search-users"
              type="text"
              placeholder="Search users, skills, locations..."
              value={data.searchQuery}
              onChange={(e) => data.setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 text-sm bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 focus:bg-white dark:focus:bg-gray-800 transition-all placeholder:text-gray-400"
            />
            {data.searchQuery && (
              <button
                onClick={() => data.setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Toggle filters */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`
              inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-lg border transition-all
              ${
                showFilters || hasActiveFilters
                  ? "bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800/50"
                  : "bg-gray-50 dark:bg-gray-800/60 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700"
              }
            `}
          >
            <Filter className="w-4 h-4" />
            Filters
            {hasActiveFilters && (
              <span className="bg-blue-500 text-white text-[10px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center">
                {[
                  data.skillFilter,
                  data.locationFilter,
                  data.statusFilter,
                  data.swapStatusFilter,
                ].filter((f) => f !== "All").length}
              </span>
            )}
          </button>
        </div>

        {/* Filter Panel */}
        {showFilters && (
          <div className="px-4 pb-4 border-t border-gray-100 dark:border-gray-800/50 pt-3">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              <FilterDropdown
                label="Skill"
                value={data.skillFilter}
                options={data.allSkills}
                onChange={data.setSkillFilter}
              />
              <FilterDropdown
                label="Location"
                value={data.locationFilter}
                options={data.allLocations}
                onChange={data.setLocationFilter}
              />
              <FilterDropdown
                label="Availability"
                value={data.statusFilter}
                options={["Online", "Offline"]}
                onChange={data.setStatusFilter}
                icon={
                  data.statusFilter === "Online" ? (
                    <Wifi className="w-3.5 h-3.5" />
                  ) : data.statusFilter === "Offline" ? (
                    <WifiOff className="w-3.5 h-3.5" />
                  ) : undefined
                }
              />
              <FilterDropdown
                label="Swap Status"
                value={data.swapStatusFilter}
                options={["Pending", "Accepted", "Completed"]}
                onChange={data.setSwapStatusFilter}
              />
            </div>

            {hasActiveFilters && (
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100 dark:border-gray-800/50">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Showing {data.filteredCount} of {data.totalCount} users
                </p>
                <button
                  onClick={clearFilters}
                  className="inline-flex items-center gap-1 text-xs text-red-500 hover:text-red-600 dark:hover:text-red-400 font-medium transition-colors"
                >
                  <X className="w-3 h-3" />
                  Clear all filters
                </button>
              </div>
            )}
          </div>
        )}

        {/* ─── Table ───────────────────────────────────────────────────────── */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50/80 dark:bg-gray-800/40 border-y border-gray-200/80 dark:border-gray-800/50">
              <tr>
                <SortableHeader
                  label="User"
                  field="userName"
                  currentField={data.sortField}
                  direction={data.sortDirection}
                  onSort={data.setSorting}
                />
                <SortableHeader
                  label="Skill Offered"
                  field="skillOffered"
                  currentField={data.sortField}
                  direction={data.sortDirection}
                  onSort={data.setSorting}
                />
                <SortableHeader
                  label="Skill Requested"
                  field="skillRequested"
                  currentField={data.sortField}
                  direction={data.sortDirection}
                  onSort={data.setSorting}
                />
                <SortableHeader
                  label="Location"
                  field="location"
                  currentField={data.sortField}
                  direction={data.sortDirection}
                  onSort={data.setSorting}
                />
                <SortableHeader
                  label="Status"
                  field="availabilityStatus"
                  currentField={data.sortField}
                  direction={data.sortDirection}
                  onSort={data.setSorting}
                />
                <SortableHeader
                  label="Swap Status"
                  field="swapStatus"
                  currentField={data.sortField}
                  direction={data.sortDirection}
                  onSort={data.setSorting}
                />
                <SortableHeader
                  label="Last Active"
                  field="lastActive"
                  currentField={data.sortField}
                  direction={data.sortDirection}
                  onSort={data.setSorting}
                />
              </tr>
            </thead>
            <tbody>
              {data.displayedUsers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-16 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <Search className="w-10 h-10 text-gray-300 dark:text-gray-600" />
                      <p className="text-gray-500 dark:text-gray-400 font-medium">
                        No users found
                      </p>
                      <p className="text-sm text-gray-400 dark:text-gray-500">
                        Try adjusting your search or filters
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                data.displayedUsers.map((user) => (
                  <UserRow
                    key={user.id}
                    user={user}
                    isHighlighted={data.recentlyUpdatedIds.has(user.id)}
                    isNew={data.recentlyAddedIds.has(user.id)}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* ─── Pagination ──────────────────────────────────────────────────── */}
        <Pagination
          currentPage={data.currentPage}
          totalPages={data.totalPages}
          filteredCount={data.filteredCount}
          pageSize={data.pageSize}
          onPageChange={data.setCurrentPage}
          onPageSizeChange={data.setPageSize}
        />
      </div>
    </div>
  );
}
