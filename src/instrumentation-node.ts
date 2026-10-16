// Node.js-only startup checks. Kept separate from instrumentation.ts so it's never bundled for the Edge runtime
export async function validateEnv() {
  try {
    // Importing the module runs the validation
    await import("@/env");
  } catch (error) {
    // Validation errors are user-facing, so only print the message. Anything else is unexpected: keep the stack trace.
    // The name is compared as a string because a failed import means nothing from the module can be imported
    if (error instanceof Error && error.name === "EnvValidationError") {
      console.error(error.message);
    } else {
      console.error(error);
    }
    process.exit(1);
  }
}
