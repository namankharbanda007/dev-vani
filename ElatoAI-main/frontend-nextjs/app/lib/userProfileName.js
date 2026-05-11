function firstNonEmpty(values) {
  for (const value of values) {
    if (typeof value === "string" && value.trim()) {
      return value.trim();
    }
  }

  return null;
}

export function resolveUserDisplayName({ dbUser, authUser } = {}) {
  const metadata = dbUser?.user_info?.user_metadata || {};
  const authMetadata = authUser?.user_metadata || {};

  return (
    firstNonEmpty([
      dbUser?.supervisee_name,
      metadata?.supervisee_name,
      authMetadata?.supervisee_name,
      authMetadata?.full_name,
      authMetadata?.name,
      dbUser?.supervisor_name,
      authUser?.email?.split("@")[0],
    ]) || "Devotee"
  );
}
