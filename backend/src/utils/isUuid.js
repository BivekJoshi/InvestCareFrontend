/**
 * Postgres raises a type error on a malformed uuid, which would surface as a
 * 500. Checking the shape first turns a mistyped id into an honest 404.
 */
export const isUuid = (value) =>
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(String(value));
