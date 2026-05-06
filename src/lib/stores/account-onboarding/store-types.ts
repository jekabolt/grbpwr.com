import { AccountTierEnum } from "@/api/proto-http/frontend";

export type AccountProfile = {
  accountTier?: AccountTierEnum;
  firstName: string;
  lastName: string;
  email: string;
};

export interface AccountOnboardingState {
  isSignedIn: boolean;
  account: AccountProfile | null;
}

export interface AccountOnboardingActions {
  setSignedIn: (value: boolean) => void;
  setAccount: (account: AccountProfile | null) => void;
}

export type AccountOnboardingStore = AccountOnboardingState & AccountOnboardingActions;
