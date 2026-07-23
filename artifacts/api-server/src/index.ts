process.on("uncaughtException", (err) => {
  console.error("UNCAUGHT EXCEPTION:", err);
  process.exit(1);
});
process.on("unhandledRejection", (err) => {
  console.error("UNHANDLED REJECTION:", err);
  process.exit(1);
});

const app = (await import("./app")).default;

const rawPort = process.env["PORT"];

if (!rawPort) {
  console.error("PORT environment variable is required but was not provided.");
  process.exit(1);
}

const port = Number(rawPort);

if (Number.isNaN(port) || port <= 0) {
  console.error(`Invalid PORT value: "${rawPort}"`);
  process.exit(1);
}

console.log("Starting server on port", port);

app.listen(port, (err) => {
  if (err) {
    console.error("Error listening on port", err);
    process.exit(1);
  }

  console.log(`Server listening on port ${port}`);
});
