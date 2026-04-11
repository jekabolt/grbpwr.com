export type PromptStatus = "pending" | "done" | "skipped";
export type PrivacyUiStatus = "pending" | "accepted" | "skipped";

export interface AccountOnboardingState {
  isSignedIn: boolean;
  privacy: PrivacyUiStatus;
  phonePrompt: PromptStatus;
  birthDatePrompt: PromptStatus;
  rehydrated: boolean;
}

export interface AccountOnboardingActions {
  setSignedIn: (value: boolean) => void;
  setPrivacy: (value: PrivacyUiStatus) => void;
  setPhonePrompt: (value: PromptStatus) => void;
  setBirthDatePrompt: (value: PromptStatus) => void;
  resetOnboarding: () => void;
}

export type AccountOnboardingStore = AccountOnboardingState & AccountOnboardingActions;
