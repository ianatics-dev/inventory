import app from "../../http_settings";

type LogPayload = {
  action: "VIEW" | "CREATE" | "UPDATE" | "DELETE" | "LOGIN" | "LOGOUT";
  module: string;
  description: string;
  target_id?: any;
  target_name?: any;
};

export const logActivity = async (payload: LogPayload) => {
  try {
    await app.post("/api/activity-log/create-log/", payload);
  } catch (error) {
    console.error("Failed to log activity", error);
  }
};