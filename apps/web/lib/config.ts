export function isSimulationMode() {
  return process.env.TALOS_SIMULATION_MODE !== "false";
}
