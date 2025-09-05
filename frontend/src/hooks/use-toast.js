import { useCallback } from "react";

export function useToast() {
    const toast = useCallback(
        ({ title = "", description = "", variant = "default", duration = 4000 } = {}) => {
            const type =
                variant === "destructive" ? "error" :
                    variant === "success" ? "success" :
                        variant === "warning" ? "warning" :
                            "default";

            const ev = new CustomEvent("app-toast", {
                detail: { title, description, type, duration },
            });
            window.dispatchEvent(ev);
        },
        []
    );

    return { toast };
}