const cron = require("node-cron");
const fs = require("fs");
const path = require("path");

// Paths
const uploadsDir = path.join(__dirname, "uploads");
const backupsDir = path.join(__dirname, "backups");

// Schedule: Approximately every 5 days at 1 AM server time (days 1,6,11,16,21,26,31)
cron.schedule("0 1 1,6,11,16,21,26,31 * *", () => {
  console.log("Starting automatic backup...");

  const timestamp = new Date().toISOString().replace(/:/g, "-"); // safe folder name

  try {
    // Ensure base backups directory exists
    fs.mkdirSync(backupsDir, { recursive: true });

    // Read all entries in uploadsDir (expected: one subfolder per username)
    const entries = fs.readdirSync(uploadsDir, { withFileTypes: true });

    entries.forEach((entry) => {
      if (!entry.isDirectory()) return; // skip files, only process username folders

      const username = entry.name;

      const userUploadPath = path.join(uploadsDir, username);
      const userBackupPath = path.join(backupsDir, username, timestamp);

      // Create backups/<username>/<timestamp>/
      fs.mkdirSync(userBackupPath, { recursive: true });

      // Copy that user's uploads into the timestamped backup folder
      fs.cpSync(userUploadPath, userBackupPath, { recursive: true });

      console.log(`Backup for user "${username}" completed at ${timestamp}`);
    });
  } catch (err) {
    console.error("Backup failed:", err);
  }
});
