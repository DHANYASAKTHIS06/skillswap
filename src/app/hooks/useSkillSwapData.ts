import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import {
  SkillSwapUser,
  SwapStatus,
  AvailabilityStatus,
  generateInitialData,
  generateNewUser,
  simulateUserUpdate,
  getAllSkills,
  getAllLocations,
} from "../services/mockSkillSwapData";

export type SortField =
  | "userName"
  | "skillOffered"
  | "skillRequested"
  | "location"
  | "availabilityStatus"
  | "swapStatus"
  | "lastActive";

export type SortDirection = "asc" | "desc";

interface UseSkillSwapDataOptions {
  pageSize?: number;
  pollInterval?: number; // ms between simulated updates
}

export interface UseSkillSwapDataReturn {
  // Data
  displayedUsers: SkillSwapUser[];
  totalCount: number;
  filteredCount: number;
  onlineCount: number;
  pendingCount: number;
  completedCount: number;

  // Pagination
  currentPage: number;
  totalPages: number;
  setCurrentPage: (page: number) => void;
  pageSize: number;
  setPageSize: (size: number) => void;

  // Search
  searchQuery: string;
  setSearchQuery: (query: string) => void;

  // Filters
  skillFilter: string;
  setSkillFilter: (skill: string) => void;
  locationFilter: string;
  setLocationFilter: (location: string) => void;
  statusFilter: string;
  setStatusFilter: (status: string) => void;
  swapStatusFilter: string;
  setSwapStatusFilter: (status: string) => void;

  // Sorting
  sortField: SortField;
  sortDirection: SortDirection;
  setSorting: (field: SortField) => void;

  // Lists for filter dropdowns
  allSkills: string[];
  allLocations: string[];

  // Real-time indicator
  isLive: boolean;
  setIsLive: (live: boolean) => void;
  lastUpdated: Date;
  recentlyUpdatedIds: Set<string>;
  recentlyAddedIds: Set<string>;
}

export function useSkillSwapData(
  options: UseSkillSwapDataOptions = {}
): UseSkillSwapDataReturn {
  const { pageSize: defaultPageSize = 10, pollInterval = 4000 } = options;

  // Core data
  const [users, setUsers] = useState<SkillSwapUser[]>(() =>
    generateInitialData(80)
  );
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [isLive, setIsLive] = useState(true);

  // Track recently updated / added for highlighting
  const [recentlyUpdatedIds, setRecentlyUpdatedIds] = useState<Set<string>>(
    new Set()
  );
  const [recentlyAddedIds, setRecentlyAddedIds] = useState<Set<string>>(
    new Set()
  );

  // Search & filters
  const [searchQuery, setSearchQuery] = useState("");
  const [skillFilter, setSkillFilter] = useState("All");
  const [locationFilter, setLocationFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [swapStatusFilter, setSwapStatusFilter] = useState("All");

  // Sorting
  const [sortField, setSortField] = useState<SortField>("lastActive");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(defaultPageSize);

  // Ref for interval cleanup
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Toggle sort direction or set new field
  const setSorting = useCallback(
    (field: SortField) => {
      if (field === sortField) {
        setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
      } else {
        setSortField(field);
        setSortDirection("asc");
      }
      setCurrentPage(1);
    },
    [sortField]
  );

  // Get unique skill and location lists
  const allSkills = useMemo(() => getAllSkills(users), [users]);
  const allLocations = useMemo(() => getAllLocations(users), [users]);

  // Filter and search
  const filteredUsers = useMemo(() => {
    let result = [...users];

    // Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (u) =>
          u.userName.toLowerCase().includes(q) ||
          u.skillOffered.toLowerCase().includes(q) ||
          u.skillRequested.toLowerCase().includes(q) ||
          u.location.toLowerCase().includes(q)
      );
    }

    // Skill filter (matches either offered or requested)
    if (skillFilter !== "All") {
      result = result.filter(
        (u) =>
          u.skillOffered === skillFilter || u.skillRequested === skillFilter
      );
    }

    // Location filter
    if (locationFilter !== "All") {
      result = result.filter((u) => u.location === locationFilter);
    }

    // Availability status filter
    if (statusFilter !== "All") {
      result = result.filter(
        (u) => u.availabilityStatus === (statusFilter as AvailabilityStatus)
      );
    }

    // Swap status filter
    if (swapStatusFilter !== "All") {
      result = result.filter(
        (u) => u.swapStatus === (swapStatusFilter as SwapStatus)
      );
    }

    return result;
  }, [users, searchQuery, skillFilter, locationFilter, statusFilter, swapStatusFilter]);

  // Sort
  const sortedUsers = useMemo(() => {
    const sorted = [...filteredUsers];
    sorted.sort((a, b) => {
      let comparison = 0;

      switch (sortField) {
        case "userName":
          comparison = a.userName.localeCompare(b.userName);
          break;
        case "skillOffered":
          comparison = a.skillOffered.localeCompare(b.skillOffered);
          break;
        case "skillRequested":
          comparison = a.skillRequested.localeCompare(b.skillRequested);
          break;
        case "location":
          comparison = a.location.localeCompare(b.location);
          break;
        case "availabilityStatus":
          comparison = a.availabilityStatus.localeCompare(b.availabilityStatus);
          break;
        case "swapStatus": {
          const order: Record<SwapStatus, number> = {
            Pending: 0,
            Accepted: 1,
            Completed: 2,
          };
          comparison = order[a.swapStatus] - order[b.swapStatus];
          break;
        }
        case "lastActive":
          comparison = a.lastActive.getTime() - b.lastActive.getTime();
          break;
      }

      return sortDirection === "asc" ? comparison : -comparison;
    });

    return sorted;
  }, [filteredUsers, sortField, sortDirection]);

  // Pagination
  const totalPages = Math.max(1, Math.ceil(sortedUsers.length / pageSize));

  const displayedUsers = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedUsers.slice(start, start + pageSize);
  }, [sortedUsers, currentPage, pageSize]);

  // Stats
  const onlineCount = useMemo(
    () => users.filter((u) => u.availabilityStatus === "Online").length,
    [users]
  );
  const pendingCount = useMemo(
    () => users.filter((u) => u.swapStatus === "Pending").length,
    [users]
  );
  const completedCount = useMemo(
    () => users.filter((u) => u.swapStatus === "Completed").length,
    [users]
  );

  // Clamp page when filters change
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  // Real-time simulation via polling
  useEffect(() => {
    if (!isLive) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    intervalRef.current = setInterval(() => {
      setUsers((prev) => {
        const action = Math.random();
        let updated = [...prev];
        const newUpdatedIds = new Set<string>();
        const newAddedIds = new Set<string>();

        if (action < 0.25 && updated.length < 200) {
          // Add a new user
          const newUser = generateNewUser();
          updated = [newUser, ...updated];
          newAddedIds.add(newUser.id);
        } else if (action < 0.35 && updated.length > 30) {
          // Remove a completed user occasionally
          const completedIdx = updated.findIndex(
            (u) => u.swapStatus === "Completed" && u.availabilityStatus === "Offline"
          );
          if (completedIdx >= 0) {
            updated.splice(completedIdx, 1);
          }
        } else {
          // Update 1-3 random users
          const updateCount = Math.floor(Math.random() * 3) + 1;
          for (let i = 0; i < updateCount; i++) {
            const idx = Math.floor(Math.random() * updated.length);
            updated[idx] = simulateUserUpdate(updated[idx]);
            newUpdatedIds.add(updated[idx].id);
          }
        }

        // Update tracking sets
        setRecentlyUpdatedIds(newUpdatedIds);
        setRecentlyAddedIds(newAddedIds);

        // Clear highlights after 2 seconds
        setTimeout(() => {
          setRecentlyUpdatedIds(new Set());
          setRecentlyAddedIds(new Set());
        }, 2000);

        setLastUpdated(new Date());
        return updated;
      });
    }, pollInterval);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isLive, pollInterval]);

  return {
    displayedUsers,
    totalCount: users.length,
    filteredCount: sortedUsers.length,
    onlineCount,
    pendingCount,
    completedCount,

    currentPage,
    totalPages,
    setCurrentPage,
    pageSize,
    setPageSize: (size: number) => {
      setPageSize(size);
      setCurrentPage(1);
    },

    searchQuery,
    setSearchQuery: (q: string) => {
      setSearchQuery(q);
      setCurrentPage(1);
    },

    skillFilter,
    setSkillFilter: (s: string) => {
      setSkillFilter(s);
      setCurrentPage(1);
    },
    locationFilter,
    setLocationFilter: (l: string) => {
      setLocationFilter(l);
      setCurrentPage(1);
    },
    statusFilter,
    setStatusFilter: (s: string) => {
      setStatusFilter(s);
      setCurrentPage(1);
    },
    swapStatusFilter,
    setSwapStatusFilter: (s: string) => {
      setSwapStatusFilter(s);
      setCurrentPage(1);
    },

    sortField,
    sortDirection,
    setSorting,

    allSkills,
    allLocations,

    isLive,
    setIsLive,
    lastUpdated,
    recentlyUpdatedIds,
    recentlyAddedIds,
  };
}
