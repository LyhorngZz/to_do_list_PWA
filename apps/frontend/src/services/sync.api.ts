import api from "./api";

import type {
    PullResponse,
    PushChanges,
    PushRequest,
    PushResponse,
} from "@/types/sync";

class SyncApi {
    async pull(
        lastPulledAt: string | null,
    ): Promise<PullResponse> {
        const { data } = await api.get<PullResponse>(
            "/sync/pull",
            {
                params: {
                    lastPulledAt,
                },
            },
        );

        return data;
    }

    async push(
        changes: PushChanges,
    ): Promise<void> {
        await api.post("/sync/push", {
            changes,
        });
    }
}

export default new SyncApi();