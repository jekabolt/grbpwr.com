export interface AccountOnboardingState {
  isSignedIn: boolean;
}

export interface AccountOnboardingActions {
  setSignedIn: (value: boolean) => void;
}

export type AccountOnboardingStore = AccountOnboardingState & AccountOnboardingActions;
