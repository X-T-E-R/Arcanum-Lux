export interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: string;
}

export interface User {
  id: string;
  email: string;
  displayName: string;
  avatarUrl?: string;
  subscription: SubscriptionStatus;
  createdAt: string;
  stats: UserStats;
}

export interface SubscriptionStatus {
  plan: "free" | "premium_monthly" | "premium_yearly";
  status: "active" | "past_due" | "cancelled" | "trialing";
  currentPeriodEnd?: string;
  trialEnd?: string;
}

export interface UserStats {
  totalReadings: number;
  streakDays: number;
  cardsCollected: number;
  favoriteSpread: string;
  favoriteCard: string;
}

export interface SSEEvent {
  event:
    | "RunStarted"
    | "RunContent"
    | "ToolCallStarted"
    | "ToolCallCompleted"
    | "RunPaused"
    | "RunCompleted"
    | "RunError";
  data: string;
}

export interface PricingPlan {
  id: string;
  name: string;
  price: number;
  period: "month" | "year";
  features: string[];
  highlighted?: boolean;
  discount?: number;
}
