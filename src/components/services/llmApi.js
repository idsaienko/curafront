const API_BASE = "http://curaexample-production.up.railway.app/api/llm";

export async function analyzeNote(note, residentId) {
  const res = await fetch(`${API_BASE}/analyze`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      note,
      residentId,
    }),
  });

   const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Failed to analyze note");
  }

  return data;
}
