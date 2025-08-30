// lib/ai.ts
import { supabase } from "./supabase";

export async function sendMessageToAI(message: string) {
  try {
    const { data, error } = await supabase.functions.invoke("ai-chat", {
      body: { message }, // ✅ automatically JSON.stringified by the SDK
    });

    if (error) {
      console.error("Supabase Functions error:", error);
      throw error;
    }

    if (!data) {
      console.error("No data returned from AI function");
      throw new Error("No response from AI");
    }

    if (data.error) {
      console.error("AI function returned error:", data);
      throw new Error(data.details || data.error);
    }

    return data.reply as string;
  } catch (err) {
    console.error("sendMessageToAI caught error:", err);
    throw err;
  }
}
