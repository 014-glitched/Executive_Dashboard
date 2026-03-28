// utils.js

/**
 * Adds two numbers safely
 * @param {number} a
 * @param {number} b
 * @returns {number}
 */
function add(a, b) {
  if (typeof a !== "number" || typeof b !== "number") {
    throw new TypeError("Both arguments must be numbers");
  }
  return a + b;
}

/**
 * Simple delay utility (Promise-based)
 * @param {number} ms
 * @returns {Promise<void>}
 */
function sleep(ms) {
  if (typeof ms !== "number" || ms < 0) {
    throw new TypeError("ms must be a non-negative number");
  }
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Logs a message with timestamp
 * @param {string} message
 */
function log(message) {
  if (typeof message !== "string") {
    throw new TypeError("Message must be a string");
  }
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${message}`);
}

// Example usage (safe execution block)
async function main() {
  try {
    const result = add(2, 3);
    log(`Result: ${result}`);

    log("Waiting for 1 second...");
    await sleep(1000);

    log("Done.");
  } catch (error) {
    console.error("Error:", error.message);
  }
}

// Run only if executed directly (Node.js)
if (require.main === module) {
  main();
}

// Export functions for reuse
module.exports = {
  add,
  sleep,
  log,
};
