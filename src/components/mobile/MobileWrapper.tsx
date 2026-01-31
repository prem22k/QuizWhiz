"use client";

import { useEffect, useState } from "react";
import { Capacitor } from "@capacitor/core";
import { Preferences } from "@capacitor/preferences";
import MobileOnboarding from "./MobileOnboarding";

export default function MobileWrapper({ children }: { children: React.ReactNode }) {
    const [isMobile, setIsMobile] = useState(false);
    const [isOnboardingComplete, setIsOnboardingComplete] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const checkPlatform = async () => {
            if (Capacitor.isNativePlatform()) {
                setIsMobile(true);
                const { value } = await Preferences.get({ key: "onboarding_completed" });
                if (value === "true") {
                    setIsOnboardingComplete(true);
                }
            }
            setIsLoading(false);
        };

        checkPlatform();
    }, []);

    if (isLoading) {
        // Optional: Return a splash screen or null while checking
        return null;
    }

    // If native mobile, and onboarding NOT complete -> show Onboarding
    if (isMobile && !isOnboardingComplete) {
        return (
            <MobileOnboarding
                onComplete={() => setIsOnboardingComplete(true)}
            />
        );
    }

    // Otherwise check if children contains login/home structure
    // This wrapper just ensures onboarding is handled first.
    return <>{children}</>;
}
