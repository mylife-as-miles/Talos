export function isMockMode() {
  return process.env.TALOS_MOCK_MODE !== "false";
}
