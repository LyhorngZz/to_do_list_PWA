import api from "./api";
import { getDeviceId } from "@/utils/device";

class HeartbeatService {
    async heartbeat() {
        return api.post(
            "/auth/heartbeat",
            {},
            {
                headers: {
                    "X-Device-Id": getDeviceId(),
                },
            },
        );
    }
}

export default new HeartbeatService();