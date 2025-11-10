/**
 * Generic API response contracts used by server routes and client fetchers.
 */

/**
 * Standard API response wrapper.
 * Wraps successful data or an error payload. Prefer returning this from API routes
 * for consistent client handling and better type inference.
 */
export interface ApiResponse<T> {
  /** Indicates whether the request succeeded */
  success: boolean;
  /** Data payload when success=true */
  data?: T;
  /** Error details when success=false */
  error?: {
    /** Machine-readable error code */
    code: string;
    /** Human-friendly error message */
    message: string;
  };
}

/**
 * Generic structure for paginated list endpoints.
 */
export interface PaginatedResponse<T> {
  /** Items for the current page */
  items: T[];
  /** Total number of items across all pages */
  total: number;
  /** Current page index (1-based) */
  page: number;
  /** Number of items per page */
  pageSize: number;
}

// Named exports only