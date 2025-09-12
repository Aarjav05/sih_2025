"use client";

import { Toaster, toast } from "sonner";
import React, { useEffect } from "react";

export default function ToastContainer({ message }) {
    useEffect(() => {
        if (message) {
            toast.success(message, {
                duration: 3000,
            });
        }
    }, [message]);

    return <Toaster />;
}