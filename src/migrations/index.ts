import * as migration_20260921_144927_initial from "./20260921_144927_initial";

export const migrations = [
  {
    up: migration_20260921_144927_initial.up,
    down: migration_20260921_144927_initial.down,
    name: "20260921_144927_initial",
  },
];
