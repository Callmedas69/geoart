// Simple OG Test Page - KISS Implementation
"use client";

import { useState } from "react";

export default function TestOGPage() {
  const [slug, setSlug] = useState("sample-collection");
  const [baseUrl] = useState("http://localhost:3000");

  const ogImageUrl = `${baseUrl}/api/og/${slug}`;
  const shareUrl = `${baseUrl}/share/${slug}`;

  return (
    <div style={{ padding: "20px", fontFamily: "system-ui" }}>
      <h1>OG Test Page</h1>

      <div style={{ marginBottom: "20px" }}>
        <label>
          Test Slug:
          <input
            type="text"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            style={{ marginLeft: "10px", padding: "5px" }}
          />
        </label>
      </div>

      <div style={{ marginBottom: "20px" }}>
        <h3>OG Image Preview:</h3>
        <img
          src={ogImageUrl}
          alt="OG Preview"
          style={{ border: "1px solid #ccc", maxWidth: "600px" }}
        />
      </div>

      <div style={{ marginBottom: "20px" }}>
        <h3>Test Links:</h3>
        <p>
          <a href={ogImageUrl} target="_blank">
            Direct OG Image
          </a>
        </p>
        <p>
          <a href={shareUrl} target="_blank">
            Share Page (redirects to VibeChain)
          </a>
        </p>
      </div>
    </div>
  );
}
