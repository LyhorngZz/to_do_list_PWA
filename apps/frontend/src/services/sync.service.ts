import db from "@/database";
import todoApi from "./todo.api";

class SyncService {

    async pull() {
        console.log("Pull not implemented yet.");
    }

    async push() {
        console.log("Push not implemented yet.");
    }

    async sync() {
        if (!navigator.onLine) {
            console.log("Offline, skip sync.");
            return;
        }

        await this.push();
        await this.pull();
    }

    getLastPulledAt(): number {
        return Number(
            localStorage.getItem("lastPulledAt") ?? "0"
        );
    }

    setLastPulledAt(timestamp: number) {
        localStorage.setItem(
            "lastPulledAt",
            timestamp.toString()
        );
    }
}

export default new SyncService();