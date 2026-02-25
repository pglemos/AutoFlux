import { useState, useEffect } from 'react';

interface WAStatus {
    connected: boolean;
    qr: string | null;
}

export function useWhatsAppPolling() {
    const [status, setStatus] = useState<WAStatus>({ connected: false, qr: null });

    useEffect(() => {
        let timeoutId: ReturnType<typeof setTimeout>;
        let isMounted = true;
        let isFetching = false;
        let errorCount = 0;

        const checkStatus = async () => {
            // Clear any scheduled next run to avoid overlaps
            clearTimeout(timeoutId);

            // Optimization: If tab is hidden, stop polling to save resources.
            // When tab becomes visible again, the 'visibilitychange' event listener will restart the poll immediately.
            if (document.hidden) {
                return;
            }

            // Prevent concurrent fetches (race condition fix)
            if (isFetching) {
                return;
            }

            isFetching = true;

            try {
                const res = await fetch('http://localhost:3001/api/whatsapp/status');

                if (!isMounted) return;

                if (!res.ok) {
                    throw new Error(`Status check failed: ${res.statusText}`);
                }

                const data = await res.json();
                setStatus(data);

                // Reset error count on success
                errorCount = 0;

                // Schedule next check in 5 seconds
                timeoutId = setTimeout(checkStatus, 5000);
            } catch (err) {
                if (!isMounted) return;

                // Fail gracefully
                setStatus({ connected: false, qr: null });

                // Optimization: Exponential backoff on error
                // 5s -> 10s -> 20s -> 30s (max)
                errorCount++;
                const delay = Math.min(30000, 5000 * Math.pow(2, errorCount - 1));
                timeoutId = setTimeout(checkStatus, delay);
            } finally {
                isFetching = false;
            }
        };

        const handleVisibilityChange = () => {
            if (!document.hidden && !isFetching) {
                // Restart polling immediately when tab becomes visible
                checkStatus();
            }
        };

        // Initial check
        checkStatus();

        document.addEventListener('visibilitychange', handleVisibilityChange);

        return () => {
            isMounted = false;
            clearTimeout(timeoutId);
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, []);

    return status;
}
