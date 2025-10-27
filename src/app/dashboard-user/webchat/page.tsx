// app/page.tsx
"use client";

import { useState } from "react";

export default function Page() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");

  const handleSubmit = async () => {
    const res = await fetch("https://n8n.srv1074739.hstgr.cloud/webhook-test/webchat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt: input }),
    });
    const data = await res.json();
    setOutput(data.message);
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-6">
      <h1 className="text-xl font-bold mb-4">AI Agent Demo</h1>
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Tulis pertanyaanmu di sini..."
        className="border rounded-lg p-2 w-80 h-24"
      />
      <button
        onClick={handleSubmit}
        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg"
      >
        Kirim
      </button>

      {output && (
        <div className="mt-6 bg-gray-100 p-4 rounded-lg w-80">
          <strong>Jawaban AI:</strong>
          <p>{output}</p>
        </div>
      )}
    </main>
  );
}
