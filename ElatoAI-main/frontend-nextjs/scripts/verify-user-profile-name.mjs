import { resolveUserDisplayName } from "../app/lib/userProfileName.js";

const cases = [
  {
    name: "uses settings name before stale supervisor name",
    input: {
      dbUser: {
        supervisor_name: "Aria",
        supervisee_name: "Naman",
        user_info: { user_metadata: { supervisee_name: "Naman" } },
      },
      authUser: {
        email: "naman@example.com",
        user_metadata: { full_name: "Aria" },
      },
    },
    expected: "Naman",
  },
  {
    name: "uses saved settings metadata when the profile column is empty",
    input: {
      dbUser: {
        supervisor_name: "Aria",
        supervisee_name: "",
        user_info: { user_metadata: { supervisee_name: "Naman" } },
      },
      authUser: {
        email: "naman@example.com",
        user_metadata: {},
      },
    },
    expected: "Naman",
  },
  {
    name: "falls back to supervisor name only after saved user names",
    input: {
      dbUser: {
        supervisor_name: "Naman K",
        supervisee_name: "",
        user_info: { user_metadata: {} },
      },
      authUser: {
        email: "naman@example.com",
        user_metadata: {},
      },
    },
    expected: "Naman K",
  },
  {
    name: "falls back to the email local part for first-time profiles",
    input: {
      dbUser: null,
      authUser: {
        email: "naman@example.com",
        user_metadata: {},
      },
    },
    expected: "naman",
  },
];

const failures = [];

for (const testCase of cases) {
  const actual = resolveUserDisplayName(testCase.input);
  if (actual !== testCase.expected) {
    failures.push(`${testCase.name}: expected "${testCase.expected}", got "${actual}"`);
  }
}

if (failures.length > 0) {
  console.error("User profile name regression check failed:");
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log("User profile name regression check passed.");
