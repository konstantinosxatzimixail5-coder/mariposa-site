import { defineCliConfig } from "sanity/cli";
import { dataset, projectId } from "./src/sanity/env";

/** Powers the `sanity` CLI (e.g. `npx sanity dataset`, schema deploy). */
export default defineCliConfig({
  api: { projectId, dataset },
  autoUpdates: true,
});
