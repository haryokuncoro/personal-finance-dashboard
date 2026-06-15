export type NotificationState = {
    type: "success" | "error";
    message: string;
} | null;