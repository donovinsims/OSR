/**
 * Core application/domain types for the Free iOS & Mac apps directory.
 * These interfaces are used across UI components, API layers, and data mappers
 * to ensure a single source of truth for data contracts.
 */

/**
 * Monetization tier classification for listed apps.
 * - tier1-completely-free: Entirely free with no paywalls
 * - tier2-generous-freemium: Free plan with generous limits and optional paid upgrades
 */
export type TierType = "tier1-completely-free" | "tier2-generous-freemium";

/**
 * Tier metadata shown in UI and used for filtering.
 */
export interface Tier {
  /** Stable programmatic id for logic and filtering */
  type: TierType;
  /** Short human label (e.g., "Completely free") */
  label: string;
  /** Tailwind-compatible color token or hex (e.g., "#10b981" or "text-green-600") */
  color: string;
  /** Helpful description for tooltips or details */
  description: string;
}

/**
 * Supported platforms an app is available on.
 */
export type PlatformType = "iOS" | "macOS" | "Web";

/**
 * Platform descriptor for UI display.
 */
export interface Platform {
  /** Concrete platform value */
  type: PlatformType;
  /** Optional icon reference/name (lucide name, URL, etc.) */
  icon?: string;
  /** Display label for the platform */
  label: string;
}

/**
 * How users obtain/install the app.
 */
export type DistributionMethodType = "AppStore" | "GitHub" | "DirectDownload";

/**
 * Distribution method metadata with URL.
 */
export interface DistributionMethod {
  /** Distribution method */
  type: DistributionMethodType;
  /** Human-friendly label (e.g., "App Store") */
  label: string;
  /** Direct URL to store/repo/download */
  url: string;
}

/**
 * Category for organizing apps.
 */
export interface Category {
  /** Numeric id from database */
  id: number;
  /** Category display name */
  name: string;
  /** Optional friendly slug (if present in DB) */
  slug?: string;
  /** Optional description for category pages */
  description?: string;
  /** Number of apps in this category (camelCase) */
  appCount?: number;
  /** Optional snake_case count used by legacy endpoints; prefer appCount */
  agent_count?: number;
  /** Optional icon (lucide name, URL, etc.) */
  icon?: string;
  /** Timestamps if available from API/DB */
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

/**
 * Primary App model used across the app directory.
 */
export interface App {
  /** Numeric id (DB generated) */
  id: number;
  /** App name */
  name: string;
  /** One or two sentence description */
  description: string;
  /** Category reference (can be minimal or full) */
  category: Pick<Category, "id" | "name"> | Category;
  /** Supported platforms */
  platforms: PlatformType[];
  /** Monetization tier */
  tier: TierType;
  /** Where/how the app is distributed */
  distributionMethod: DistributionMethod;
  /** ISO date string when manually verified */
  verifiedDate?: string;
  /** Image URLs for gallery/screens */
  screenshots: string[];
  /** Key features shown in detail views */
  features: string[];
  /** Optional install/setup instructions */
  installInstructions?: string;
  /** Optional official website */
  websiteUrl?: string;
  /** Optional icon/logo URL */
  iconUrl?: string;
}

// Named exports only (no default export)