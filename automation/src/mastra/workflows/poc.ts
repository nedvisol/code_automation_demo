import { Workflow } from "@mastra/core/workflows";
import { z } from "zod";
import { updateGraphqlSchemaStep } from "./graphql-steps";

const pocWorkflow = new Workflow({
    name: "poc-workflow",
    triggerSchema: z.object({
        entityDescription: z.string(),
        existingSchemaContent: z.string(),
    }),
});

pocWorkflow
    .step(updateGraphqlSchemaStep);
// .then(askAboutSpecialty, {
//   when: { "gatherCandidateInfo.isTechnical": true },
// })
// .after(gatherCandidateInfo)
// .step(askAboutRole, {
//   when: { "gatherCandidateInfo.isTechnical": false },
// });

pocWorkflow.commit();

export { pocWorkflow };