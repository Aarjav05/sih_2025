import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";

function Toast({ id, title, description, type }) {
    const colors =
        type === "success" ? "bg-green-600 text-white" :
            type === "error" ? "bg-red-600 text-white" :
                type === "warning" ? "bg-amber-600 text-white" :
                    "bg-slate-800 text-white";

    return (
        <div className={`max-w-sm w-full rounded-lg shadow-lg p-3 flex flex-col gap-1 ${colors}`}>
            {title && <div className="font-semibold text-sm">{title}</div>}
            {description && <div className="text-xs opacity-90">{description}</div>}
        </div>
    );
}

export default function ToastContainer() {
    const [toasts, setToasts] = useState([]);

    useEffect(() => {
        function onToast(ev) {
            const { title = "", description = "", type = "default", duration = 4000 } = ev.detail || {};
            const id = Math.random().toString(36).slice(2, 9);
            setToasts((t) => [...t, { id, title, description, type }]);

            setTimeout(() => {
                setToasts((t) => t.filter((x) => x.id !== id));
            }, duration);
        }

        window.addEventListener("app-toast", onToast);
        return () => window.removeEventListener("app-toast", onToast);
    }, []);

    if (typeof document === "undefined") return null;

    return createPortal(
        <div className="fixed right-4 top-4 z-50 flex flex-col gap-3">
            {toasts.map((t) => (
                <Toast key={t.id} {...t} />
            ))}
        </div>,
        document.body
    );
}