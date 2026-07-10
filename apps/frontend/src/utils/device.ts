function generateDeviceId(): string {
    return crypto.randomUUID();
}

export function getDeviceId(): string {
    let deviceId = localStorage.getItem("deviceId");

    if (!deviceId) {
        deviceId = generateDeviceId();
        localStorage.setItem("deviceId", deviceId);
    }

    return deviceId;
}