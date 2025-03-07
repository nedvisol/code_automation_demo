import { Workflow } from "@mastra/core/workflows";
import { z } from "zod";
import { createResolverFunctionsStep, updateGraphqlSchemaStep, updateResolverIndexStep } from "./graphql-steps";
import { createDaoFunctionsStep } from "./dao-steps";

const demoWorkflow = new Workflow({
    name: "poc-workflow",
    triggerSchema: z.object({
        entityDescription: z.string(),
        existingSchemaContent: z.string(),
        sampleDaoContent: z.string(),
        sampleDaoFilePath: z.string(),
        sampleResolverContent: z.string(),
        sampleResolverFilePath: z.string(),
        existingResolverObjectContent: z.string(),
    }),
});

demoWorkflow
    .step(updateGraphqlSchemaStep)
    .after(updateGraphqlSchemaStep)
        .step(createDaoFunctionsStep, { when: { "updateGraphqlSchemaStep.isExternalApi": false }})
        .step(createResolverFunctionsStep, { when: { "updateGraphqlSchemaStep.isExternalApi": false }})
        .step(updateResolverIndexStep, { when: { "updateGraphqlSchemaStep.isExternalApi": false }})
    ;

demoWorkflow.commit();

export { demoWorkflow as demoWorkflow };