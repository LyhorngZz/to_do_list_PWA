import heartbeatService from "@/services/heartbeat.service";

let intervalId: number | undefined;

function sendHeartbeat() {
    if (!navigator.onLine) {
        return;
    }

    heartbeatService
        .heartbeat()
        .then(() => console.debug("[Heartbeat] Sent"))
        .catch(() => console.warn("[Heartbeat] Failed"));
}

export function startHeartbeat() {
    if (intervalId) return;

    sendHeartbeat();

    intervalId = window.setInterval(() => {
        sendHeartbeat();
    }, 60 * 1000);
}

export function stopHeartbeat() {
    if (!intervalId) return;

    clearInterval(intervalId);
    intervalId = undefined;
}