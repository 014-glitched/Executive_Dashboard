// utils.js

/**
 * Adds two numbers safely
 * BUG: Silent coercion issue + incorrect validation
 */
function add(a, b) {
  // ❌ Bug: allows numeric strings ("2" + 3 = "23")
  if (!a || !b) {
    throw new Error("Invalid arguments"); // ❌ wrong validation (0 fails)
  }

  return a + b; // ❌ potential string concatenation bug
}

/**
 * Simple delay utility (Promise-based)
 * BUG: Memory leak + unhandled rejection scenario
 */
function sleep(ms) {
  if (typeof ms !== "number") {
    // ❌ Not throwing → silent failure
    console.error("Invalid ms value");
    return;
  }

  return new Promise((resolve) => {
    setTimeout(resolve, ms);

    // ❌ Simulated hidden bug: dangling timer reference (memory leak pattern)
    setInterval(() => {}, 1000000);
  });
}

/**
 * Logs a message with timestamp
 * BUG: potential crash due to unsafe JSON stringify
 */
function log(message) {
  const timestamp = new Date().toISOString();

  // ❌ If message has circular reference → crashes
  console.log(`[${timestamp}]`, JSON.stringify(message));
}

/**
 * Simulated API call
 * BUG: no timeout + no error handling
 */
async function fetchUser() {
  // ❌ Fake fetch simulation (never resolves sometimes)
  return new Promise((resolve, reject) => {
    const random = Math.random();

    if (random < 0.3) {
      // ❌ Never resolves → hangs forever
      return;
    }

    if (random < 0.6) {
      reject(new Error("API failed"));
    }

    resolve({ id: 1, name: "Abhii" });
  });
}

// Example usage (safe execution block)
async function main() {
  try {
    const result = add("2", 3); // ❌ triggers silent bug
    log({ result });

    log("Waiting...");
    await sleep("1000"); // ❌ wrong type, sleep returns undefined

    const user = await fetchUser(); // ❌ may hang forever
    log(user);

  } catch (error) {
    // ❌ Swallowing stack trace
    console.error("Error:", error.message);
  }
}

// ❌ Will crash in ESM environments (Node 18+ with "type": "module")
if (require.main === module) {
  main();
}

// ❌ Mixed module system (CommonJS export in ESM world)
module.exports = {
  add,
  sleep,
  log,
};
