"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

// User profile fields
export interface UserProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  company: string;
  jobTitle: string;
  location: string;
  bio: string;
  avatarUrl: string;
  role: "admin" | "affiliate" | "customer" | "team_member";
  
  // Affiliate-specific fields
  isAffiliate: boolean;
  affiliateOnboardingComplete: boolean;
  affiliateAgreementSigned: boolean;
  affiliateAgreementDate: string | null;
  
  // Networking profile (for affiliates)
  networkingProfile: {
    expertise: string[];
    categories: string[];
    idealReferralPartner: string;
    topReferralSources: string;
    goalsThisQuarter: string;
    uniqueValueProposition: string;
    targetClientProfile: string;
    problemsYouSolve: string;
    successStory: string;
  };
  
  // Profile completion tracking
  profileCompletedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

// Default empty profile
const defaultProfile: UserProfile = {
  id: "",
  email: "",
  firstName: "",
  lastName: "",
  phone: "",
  company: "",
  jobTitle: "",
  location: "",
  bio: "",
  avatarUrl: "",
  role: "team_member",
  isAffiliate: false,
  affiliateOnboardingComplete: false,
  affiliateAgreementSigned: false,
  affiliateAgreementDate: null,
  networkingProfile: {
    expertise: [],
    categories: [],
    idealReferralPartner: "",
    topReferralSources: "",
    goalsThisQuarter: "",
    uniqueValueProposition: "",
    targetClientProfile: "",
    problemsYouSolve: "",
    successStory: "",
  },
  profileCompletedAt: null,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

// Calculate profile completion percentage
export function calculateProfileCompletion(profile: UserProfile): number {
  const requiredFields = [
    profile.firstName,
    profile.lastName,
    profile.email,
    profile.phone,
    profile.company,
    profile.jobTitle,
    profile.location,
    profile.bio,
  ];
  
  const completedFields = requiredFields.filter((field) => field && field.trim() !== "").length;
  return Math.round((completedFields / requiredFields.length) * 100);
}

// Calculate affiliate networking profile completion
export function calculateNetworkingCompletion(profile: UserProfile): number {
  if (!profile.isAffiliate) return 100;
  
  const networkingFields = [
    profile.networkingProfile.expertise.length > 0,
    profile.networkingProfile.categories.length > 0,
    profile.networkingProfile.idealReferralPartner,
    profile.networkingProfile.topReferralSources,
    profile.networkingProfile.goalsThisQuarter,
    profile.networkingProfile.uniqueValueProposition,
    profile.networkingProfile.targetClientProfile,
    profile.networkingProfile.problemsYouSolve,
  ];
  
  const completedFields = networkingFields.filter((field) => {
    if (typeof field === "boolean") return field;
    return field && String(field).trim() !== "";
  }).length;
  
  return Math.round((completedFields / networkingFields.length) * 100);
}

// Check if profile is complete
export function isProfileComplete(profile: UserProfile): boolean {
  return calculateProfileCompletion(profile) === 100;
}

// Check if affiliate onboarding is needed
export function needsAffiliateOnboarding(profile: UserProfile): boolean {
  return profile.isAffiliate && !profile.affiliateOnboardingComplete;
}

// Context type
interface UserProfileContextType {
  profile: UserProfile;
  setProfile: (profile: UserProfile) => void;
  updateProfile: (updates: Partial<UserProfile>) => void;
  profileCompletion: number;
  networkingCompletion: number;
  isComplete: boolean;
  needsOnboarding: boolean;
  showProfileWizard: boolean;
  setShowProfileWizard: (show: boolean) => void;
  showAffiliateOnboarding: boolean;
  setShowAffiliateOnboarding: (show: boolean) => void;
  getDisplayName: () => string;
  getInitials: () => string;
}

const UserProfileContext = createContext<UserProfileContextType | undefined>(undefined);

// Mock user data - in production this would come from auth/database
const mockUserData: UserProfile = {
  ...defaultProfile,
  id: "user-1",
  email: "brian@strategicvalueplus.com",
  firstName: "Brian",
  lastName: "Stitt",
  role: "admin",
  isAffiliate: true,
  affiliateAgreementSigned: true,
  affiliateAgreementDate: "2024-01-15",
  affiliateOnboardingComplete: false, // Set to false to show onboarding
  createdAt: "2024-01-01T00:00:00Z",
  updatedAt: new Date().toISOString(),
};

export function UserProfileProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<UserProfile>(mockUserData);
  const [showProfileWizard, setShowProfileWizard] = useState(false);
  const [showAffiliateOnboarding, setShowAffiliateOnboarding] = useState(false);

  const profileCompletion = calculateProfileCompletion(profile);
  const networkingCompletion = calculateNetworkingCompletion(profile);
  const isComplete = isProfileComplete(profile);
  const needsOnboarding = needsAffiliateOnboarding(profile);

  // Check if wizards should be shown on mount
  useEffect(() => {
    if (!isComplete) {
      setShowProfileWizard(true);
    } else if (needsOnboarding) {
      setShowAffiliateOnboarding(true);
    }
  }, [isComplete, needsOnboarding]);

  const updateProfile = (updates: Partial<UserProfile>) => {
    setProfile((prev) => ({
      ...prev,
      ...updates,
      updatedAt: new Date().toISOString(),
    }));
  };

  const getDisplayName = () => {
    if (profile.firstName && profile.lastName) {
      return `${profile.firstName} ${profile.lastName}`;
    }
    if (profile.firstName) return profile.firstName;
    if (profile.email) return profile.email.split("@")[0];
    return "User";
  };

  const getInitials = () => {
    if (profile.firstName && profile.lastName) {
      return `${profile.firstName[0]}${profile.lastName[0]}`.toUpperCase();
    }
    if (profile.firstName) return profile.firstName[0].toUpperCase();
    if (profile.email) return profile.email[0].toUpperCase();
    return "U";
  };

  return (
    <UserProfileContext.Provider
      value={{
        profile,
        setProfile,
        updateProfile,
        profileCompletion,
        networkingCompletion,
        isComplete,
        needsOnboarding,
        showProfileWizard,
        setShowProfileWizard,
        showAffiliateOnboarding,
        setShowAffiliateOnboarding,
        getDisplayName,
        getInitials,
      }}
    >
      {children}
    </UserProfileContext.Provider>
  );
}

export function useUserProfile() {
  const context = useContext(UserProfileContext);
  if (context === undefined) {
    throw new Error("useUserProfile must be used within a UserProfileProvider");
  }
  return context;
}
