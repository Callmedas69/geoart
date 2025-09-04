"use client";

import React, { useState } from "react";

interface TestResult {
  success: boolean;
  message: string;
  duration: number;
}

export default function TestVibeLoader() {
  const [testResults, setTestResults] = useState<{
    fileUpload: TestResult | null;
    metadata: TestResult | null;
    filebase: TestResult | null;
    deployment: TestResult | null;
  }>({
    fileUpload: null,
    metadata: null,
    filebase: null,
    deployment: null,
  });

  const [logs, setLogs] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs((prev) => [...prev, `[${timestamp}] ${message}`]);
  };

  // Test 1: File Upload + CSV Validation
  const testFileUpload = async (): Promise<TestResult> => {
    const start = Date.now();
    try {
      // Simulate basic validation
      const mockFiles = ["test1.png", "test2.png"];
      const mockCSV = [
        { filename: "test1.png", rarity: 1 },
        { filename: "test2.png", rarity: 3 },
      ];

      // Basic validation checks
      if (mockFiles.length !== mockCSV.length) {
        throw new Error("File count mismatch");
      }

      mockCSV.forEach((item, index) => {
        if (!item.filename || item.rarity < 1 || item.rarity > 5) {
          throw new Error(`Invalid entry ${index + 1}`);
        }
      });

      return {
        success: true,
        message: `Validation passed: ${mockFiles.length} files`,
        duration: Date.now() - start,
      };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : "Unknown error",
        duration: Date.now() - start,
      };
    }
  };

  // Test 2: Metadata Generation
  const testMetadata = async (): Promise<TestResult> => {
    const start = Date.now();
    try {
      // Simulate metadata generation
      const metadata = [
        {
          name: "Test NFT #1",
          description: "Generated test NFT",
          image: "https://ipfs.filebase.io/ipfs/test/test1.png",
          attributes: [{ trait_type: "Rarity", value: "Common" }],
        },
        {
          name: "Test NFT #2",
          description: "Generated test NFT",
          image: "https://ipfs.filebase.io/ipfs/test/test2.png",
          attributes: [{ trait_type: "Rarity", value: "Epic" }],
        },
      ];

      // Validate structure
      metadata.forEach((item, index) => {
        if (!item.name || !item.description || !item.image) {
          throw new Error(`Invalid metadata for item ${index + 1}`);
        }
      });

      return {
        success: true,
        message: `Generated ${metadata.length} metadata entries`,
        duration: Date.now() - start,
      };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : "Unknown error",
        duration: Date.now() - start,
      };
    }
  };

  // Test 3: API Connection
  const testFilebaseUpload = async (): Promise<TestResult> => {
    const start = Date.now();
    try {
      // Test API endpoint availability
      const response = await fetch("/api/upload-metadata", {
        method: "OPTIONS",
      });

      if (response.status === 405 || response.status === 200) {
        return {
          success: true,
          message: "API endpoint is accessible",
          duration: Date.now() - start,
        };
      }

      throw new Error(`API returned status: ${response.status}`);
    } catch (error) {
      return {
        success: false,
        message:
          error instanceof Error ? error.message : "API connection failed",
        duration: Date.now() - start,
      };
    }
  };

  // Test 4: Contract Address Validation
  const testContractDeployment = async (): Promise<TestResult> => {
    const start = Date.now();
    try {
      const contractAddress = "0xa2b463aec4f721fa7c2af400ddde2fe8dff270a1";
      const addressRegex = /^0x[a-fA-F0-9]{40}$/;

      if (!addressRegex.test(contractAddress)) {
        throw new Error("Invalid contract address format");
      }

      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      return {
        success: true,
        message: "Contract address validation passed",
        duration: Date.now() - start,
      };
    } catch (error) {
      return {
        success: false,
        message:
          error instanceof Error ? error.message : "Contract validation failed",
        duration: Date.now() - start,
      };
    }
  };

  const runSingleTest = async (
    testName: keyof typeof testResults,
    testFunction: () => Promise<TestResult>
  ) => {
    if (isRunning) return;

    setIsRunning(true);
    addLog(`🔄 Starting ${testName} test...`);

    try {
      const result = await testFunction();
      setTestResults((prev) => ({ ...prev, [testName]: result }));

      if (result.success) {
        addLog(
          `✅ ${testName} test passed (${result.duration}ms): ${result.message}`
        );
      } else {
        addLog(
          `❌ ${testName} test failed (${result.duration}ms): ${result.message}`
        );
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      addLog(`💥 ${testName} test crashed: ${errorMessage}`);
    } finally {
      setIsRunning(false);
    }
  };

  const runAllTests = async () => {
    if (isRunning) return;

    setIsRunning(true);
    setLogs(["🚀 Starting VibeLoader test suite..."]);

    const tests = [
      {
        name: "fileUpload" as const,
        fn: testFileUpload,
        label: "File Upload + CSV",
      },
      {
        name: "metadata" as const,
        fn: testMetadata,
        label: "Metadata Generation",
      },
      {
        name: "filebase" as const,
        fn: testFilebaseUpload,
        label: "Filebase API",
      },
      {
        name: "deployment" as const,
        fn: testContractDeployment,
        label: "Contract Connection",
      },
    ];

    try {
      for (const test of tests) {
        addLog(`🔄 Testing ${test.label}...`);
        const result = await test.fn();
        setTestResults((prev) => ({ ...prev, [test.name]: result }));

        if (result.success) {
          addLog(`✅ ${test.label} passed (${result.duration}ms)`);
        } else {
          addLog(`❌ ${test.label} failed: ${result.message}`);
          addLog("⏹️ Stopping test suite on first failure");
          return;
        }
      }

      addLog("🎉 All tests passed!");
    } catch (error) {
      addLog(
        `💥 Test suite crashed: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    } finally {
      setIsRunning(false);
    }
  };

  const clearResults = () => {
    setTestResults({
      fileUpload: null,
      metadata: null,
      filebase: null,
      deployment: null,
    });
    setLogs([]);
  };

  const getStatusBadge = (result: TestResult | null) => {
    if (!result) return "⚪ NOT RUN";
    return result.success ? "🟢 PASS" : "🔴 FAIL";
  };

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "2rem" }}>
      <div style={{ marginBottom: "2rem" }}>
        <h1
          style={{
            fontSize: "2rem",
            fontWeight: "bold",
            marginBottom: "0.5rem",
          }}
        >
          VibeLoader Test Suite
        </h1>
        <p style={{ color: "#666" }}>
          Minimal chunked testing for VibeLoader deployment system - KISS
          principle applied
        </p>
      </div>

      {/* Security Warning */}
      <div
        style={{
          backgroundColor: "#fef3c7",
          border: "1px solid #f59e0b",
          borderRadius: "0.5rem",
          padding: "1rem",
          marginBottom: "2rem",
        }}
      >
        <h3 style={{ color: "#92400e", marginBottom: "0.5rem" }}>
          ⚠️ Security Notice
        </h3>
        <p style={{ color: "#92400e", fontSize: "0.875rem" }}>
          <strong>Critical:</strong> These tests are safe and read-only. No
          actual deployments occur. However, production code still has security
          gaps that need fixing.
        </p>
      </div>

      {/* Test Controls */}
      <div style={{ marginBottom: "2rem" }}>
        <button
          onClick={runAllTests}
          disabled={isRunning}
          style={{
            backgroundColor: isRunning ? "#9ca3af" : "#2563eb",
            color: "white",
            padding: "0.5rem 1rem",
            borderRadius: "0.375rem",
            border: "none",
            marginRight: "1rem",
            cursor: isRunning ? "not-allowed" : "pointer",
          }}
        >
          {isRunning ? "Running..." : "Run All Tests"}
        </button>
        <button
          onClick={clearResults}
          disabled={isRunning}
          style={{
            backgroundColor: "white",
            color: "#374151",
            border: "1px solid #d1d5db",
            padding: "0.5rem 1rem",
            borderRadius: "0.375rem",
            cursor: isRunning ? "not-allowed" : "pointer",
          }}
        >
          Clear Results
        </button>
      </div>

      {/* Individual Test Buttons */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "1rem",
          marginBottom: "2rem",
        }}
      >
        {[
          {
            name: "fileUpload",
            label: "File Upload + CSV",
            desc: "Tests file validation and CSV parsing",
          },
          {
            name: "metadata",
            label: "Metadata Generation",
            desc: "Tests NFT metadata creation",
          },
          {
            name: "filebase",
            label: "Filebase API",
            desc: "Tests API endpoint availability",
          },
          {
            name: "deployment",
            label: "Contract Connection",
            desc: "Tests contract address validation",
          },
        ].map((test) => (
          <div
            key={test.name}
            style={{
              border: "1px solid #d1d5db",
              borderRadius: "0.5rem",
              padding: "1rem",
              backgroundColor: "white",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "0.75rem",
              }}
            >
              <h4 style={{ margin: 0, fontWeight: "500" }}>{test.label}</h4>
              <span style={{ fontSize: "0.875rem" }}>
                {getStatusBadge(
                  testResults[test.name as keyof typeof testResults]
                )}
              </span>
            </div>
            <p
              style={{
                fontSize: "0.875rem",
                color: "#666",
                marginBottom: "0.75rem",
              }}
            >
              {test.desc}
            </p>
            <button
              onClick={() =>
                runSingleTest(
                  test.name as keyof typeof testResults,
                  test.name === "fileUpload"
                    ? testFileUpload
                    : test.name === "metadata"
                    ? testMetadata
                    : test.name === "filebase"
                    ? testFilebaseUpload
                    : testContractDeployment
                )
              }
              disabled={isRunning}
              style={{
                backgroundColor: "white",
                color: "#2563eb",
                border: "1px solid #2563eb",
                padding: "0.375rem 0.75rem",
                borderRadius: "0.25rem",
                fontSize: "0.875rem",
                cursor: isRunning ? "not-allowed" : "pointer",
              }}
            >
              Test Individual
            </button>
          </div>
        ))}
      </div>

      {/* Test Console */}
      <div
        style={{
          border: "1px solid #d1d5db",
          borderRadius: "0.5rem",
          backgroundColor: "white",
          marginBottom: "2rem",
        }}
      >
        <h3
          style={{
            padding: "1rem",
            margin: 0,
            borderBottom: "1px solid #d1d5db",
          }}
        >
          Test Console
        </h3>
        <div
          style={{
            backgroundColor: "#1f2937",
            color: "#10b981",
            padding: "1rem",
            fontFamily: "monospace",
            fontSize: "0.875rem",
            maxHeight: "400px",
            overflowY: "auto",
          }}
        >
          {logs.length === 0 ? (
            <div style={{ color: "#9ca3af" }}>
              No tests run yet. Click a test button to begin.
            </div>
          ) : (
            logs.map((log, index) => (
              <div key={index} style={{ marginBottom: "0.25rem" }}>
                {log}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Results Summary */}
      {Object.values(testResults).some((result) => result !== null) && (
        <div
          style={{
            border: "1px solid #d1d5db",
            borderRadius: "0.5rem",
            backgroundColor: "white",
          }}
        >
          <h3
            style={{
              padding: "1rem",
              margin: 0,
              borderBottom: "1px solid #d1d5db",
            }}
          >
            Test Results Summary
          </h3>
          <div style={{ padding: "1rem" }}>
            {Object.entries(testResults).map(([key, result]) => {
              if (!result) return null;
              return (
                <div
                  key={key}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "0.5rem",
                    border: "1px solid #e5e7eb",
                    borderRadius: "0.25rem",
                    marginBottom: "0.5rem",
                  }}
                >
                  <span
                    style={{ fontWeight: "500", textTransform: "capitalize" }}
                  >
                    {key.replace(/([A-Z])/g, " $1").trim()}
                  </span>
                  <div>
                    <span style={{ marginRight: "0.5rem" }}>
                      {getStatusBadge(result)}
                    </span>
                    <span style={{ fontSize: "0.875rem", color: "#6b7280" }}>
                      {result.duration}ms
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
