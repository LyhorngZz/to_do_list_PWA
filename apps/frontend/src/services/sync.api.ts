import api from "./api";

export default {
    pull(lastPulledAt: number) {
        return api.get("/sync/pull", {
            params: { lastPulledAt },
        });
    },

    push(payload: any) {
        return api.post("/sync/push", payload);
    },
};