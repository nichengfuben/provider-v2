// Constants for retry mechanism
const MAX_RETRIES = 3;
const INITIAL_RETRY_DELAY = 1000; // Starting delay in milliseconds
const MAX_RETRY_DELAY = 4000; // Maximum delay of 4 seconds
const MIGRATION_FLAG = "andi-identity-force-migrated";

// Add these constants at the top of the file
const keysToKeepPrefixes = [
    'CognitoIdentityId-',
    'com.amplify.Cognito.', 
    'ph_phc',
    'ph_andi-posthog'
];
const keysToKeepExact = [
    'andi-return-user',
    'andi-first-seen',
    MIGRATION_FLAG
];

// Initialize error handler as soon as possible
(function initErrorHandler() {
    let retryCount = getRetryCountFromSession();

    // Listen for critical resource loading errors
    window.addEventListener("error", handleError, true);
    window.addEventListener("unhandledrejection", handlePromiseRejection, true);

    function isViteChunkError(e) {
        // Handle Firefox's sanitized cross-origin errors
        if (
            e.message === "Script error." ||
            e.message === "Error loading script"
        ) {
            // Check if this is a same-origin resource before treating as critical
            try {
                const errorUrl = e.target?.src || e.target?.href;
                if (errorUrl) {
                    const resourceUrl = new URL(
                        errorUrl,
                        window.location.origin
                    );
                    return resourceUrl.origin === window.location.origin;
                }
            } catch (err) {
                return false;
            }
        }
        return (
            e &&
            e.message &&
            // Vite-specific chunk loading errors
            (e.message.includes(
                "Failed to fetch dynamically imported module"
            ) ||
                e.message.includes("Unable to preload CSS") ||
                e.message.includes("Unable to load script") ||
                e.message.includes("ChunkLoadError") ||
                e.message.includes("Loading chunk") ||
                e.message.includes("Request aborted") ||
                // Critical syntax errors in main bundle
                (e.message.includes("SyntaxError") &&
                    e.message.includes("Unexpected token")))
        );
    }

    function isCriticalResource(resource) {
        if (!resource) return false;

        const url = resource.src || resource.href || "";

        try {
            // Check same origin first
            const resourceUrl = new URL(url, window.location.origin);
            if (resourceUrl.origin !== window.location.origin) return false;

            // Check for Vite asset patterns
            const isViteAsset =
                url.includes("/assets/") &&
                // Add CSS chunks to critical resources
                url.match(/\/assets\/.*\.(js|css)$/) &&
                (url.includes("index-") ||
                    url.includes("vendor-") ||
                    url.includes("main.") ||
                    url.includes("polyfills.") ||
                    url.includes("runtime."));

            return isViteAsset;
        } catch (e) {
            console.warn("Error parsing resource URL:", e);
            return false;
        }
    }

    function handleError(e) {
        // Normalize error event across browsers
        const errorEvent = {
            message: e.message || e.error?.message || "Unknown error",
            target: e.target || e.srcElement, // IE compatibility
            src: e.target?.src || e.target?.href || e.path?.[0]?.src || "",
            type: e.type || "error",
        };

        // Only handle script/style loading errors for critical resources
        if (
            errorEvent.target &&
            (errorEvent.target.tagName === "SCRIPT" ||
                errorEvent.target.tagName === "LINK") &&
            isCriticalResource(errorEvent.target) &&
            isViteChunkError(errorEvent)
        ) {
            console.error(
                "Critical resource loading error:",
                e.target.src || e.target.href
            );

            if (retryCount < MAX_RETRIES) {
                retryCount++;
                updateRetryCountInSession(retryCount);
                console.log(
                    `Attempting reload (${retryCount}/${MAX_RETRIES})...`
                );

                const delay = getRetryDelay(retryCount);
                console.log(`Waiting for ${delay}ms before retrying...`);

                setTimeout(() => {
                    clearCachesAndReload();
                }, delay);
            } else {
                showErrorMessage();
            }

            // Send error to PostHog
            sendErrorToPostHog(e.message);
        }
    }

    function handlePromiseRejection(e) {
        if (e.reason && e.reason.message && isViteChunkError(e.reason)) {
            // Create an error-like object for handleError
            const errorLike = {
                target: e.target,
                message: e.reason.message,
                // Add source URL if available
                src: e.reason.stack?.match(/https?:\/\/[^)]+/)?.[0],
            };
            handleError(errorLike);
        }
    }

    function getRetryDelay(retryCount) {
        // Calculate exponential backoff delay with jitter to prevent synchronized retries
        const expDelay = Math.min(
            INITIAL_RETRY_DELAY * Math.pow(2, retryCount - 1),
            MAX_RETRY_DELAY
        );
        const jitter = Math.floor(Math.random() * 1000); // Random delay up to 1 second
        return expDelay + jitter;
    }

    // Helper function to preserve localStorage items
    function preserveLocalStorageItems() {
        // Collect keys to preserve
        const preservedItems = {};
        
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            const shouldKeepExact = keysToKeepExact.includes(key);
            const shouldKeepPrefix = keysToKeepPrefixes.some(prefix => 
                key.startsWith(prefix)
            );
            
            if (shouldKeepExact || shouldKeepPrefix) {
                preservedItems[key] = localStorage.getItem(key);
            }
        }
        return preservedItems;
    }

    // Helper function to restore preserved items
    function restoreLocalStorageItems(preservedItems) {
        Object.entries(preservedItems).forEach(([key, value]) => {
            try {
                localStorage.setItem(key, value);
            } catch (error) {
                console.error("Error restoring localStorage item:", error);
                sendErrorToPostHog(error);
            }
        });
    }

    async function clearCachesAndReload() {
        // Check if we're offline
        if (!navigator.onLine) {
            console.log("Device is offline, waiting for connection...");

            // Show offline message
            const message = `
                There was a critical error loading the app. You appear to be offline. 
                The app will automatically reload when your connection is restored.
                If the problem persists, please contact hello@andiai.com.
            `;
            alert(message);

            // Wait for online status
            await new Promise((resolve) => {
                const onlineHandler = () => {
                    window.removeEventListener("online", onlineHandler);
                    resolve();
                };
                window.addEventListener("online", onlineHandler);
            });
        }

        try {
            // Preserve critical localStorage items before clearing
            const preservedItems = preserveLocalStorageItems();

            // Only clear caches if we're online and it's not a network error
            if (navigator.onLine) {
                // Clear service workers
                if (navigator.serviceWorker?.getRegistrations) {
                    const registrations = await navigator.serviceWorker.getRegistrations();
                    await Promise.all(registrations.map((r) => r.unregister()));
                }

                // Clear caches
                if ("caches" in window) {
                    const keys = await caches.keys();
                    await Promise.all(keys.map((key) => caches.delete(key)));
                }

                // Restore preserved localStorage items
                restoreLocalStorageItems(preservedItems);
            }

            // Reload the page
            window.location.reload(true);
        } catch (err) {
            console.error("Error clearing caches:", err);
            // Only reload if we're online
            if (navigator.onLine) {
                window.location.reload(true);
            }
        }
    }

    function showErrorMessage() {
        const message = `
          Sorry, there was a problem loading the application.
          Please clear your browser cache and refresh the page.
          If the problem persists, please contact hello@andiai.com.
        `;
        alert(message);
        resetRetryCountInSession();
    }

    function getRetryCountFromSession() {
        const count = sessionStorage.getItem("retryCount");
        return parseInt(count || "0", 10);
    }

    function updateRetryCountInSession(count) {
        sessionStorage.setItem("retryCount", count);
    }

    function resetRetryCountInSession() {
        sessionStorage.removeItem("retryCount");
    }

    function sendErrorToPostHog(errorMessage) {
        // PostHog API endpoint and key from providers.jsx
        const POSTHOG_API_HOST = "https://srv-app.andisearch.com";
        const POSTHOG_PROJECT_API_KEY =
            "phc_qfFo1buj0GIw2nUN1SGAYMJK0xOBAgmWDNCU4HgzeME";

        // Try to get distinct_id from localStorage
        let distinctId = "anonymous";
        try {
            const phData = localStorage.getItem("ph_andi-posthog");
            if (phData) {
                const parsed = JSON.parse(phData);
                distinctId = parsed.distinct_id || distinctId;
            }
        } catch (e) {
            console.warn("Could not parse PostHog data from localStorage");
        }

        // Check if analytics are allowed
        const analyticsAllowed =
            localStorage.getItem("andi-analytics-allowed") !== "false";
        if (!analyticsAllowed) {
            return;
        }

        // Construct the error event payload
        const payload = {
            api_key: POSTHOG_PROJECT_API_KEY,
            event: "Error",
            distinct_id: distinctId,
            properties: {
                Action: "Load Error",
                Channel: "Error Handler",
                "Error Message": errorMessage,
                "Retry Count": retryCount,
                URL: window.location.href,
                $current_url: window.location.href,
                Client:
                    window.innerWidth >= 992
                        ? "Desktop Browser"
                        : "Mobile Browser",
                Version:
                    document.documentElement.getAttribute("data-version") ||
                    "unknown",
            },
            timestamp: new Date().toISOString(),
        };

        // Send error event directly to PostHog API
        try {
            const xhr = new XMLHttpRequest();
            xhr.open("POST", `${POSTHOG_API_HOST}/capture/`, true);
            xhr.setRequestHeader("Content-Type", "application/json");
            xhr.send(JSON.stringify(payload));
        } catch (e) {
            console.error("Failed to send error to PostHog:", e);
        }
    }
})();
