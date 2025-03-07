import { Workflow } from "@mastra/core/workflows";
import { z } from "zod";
import { createResolverFunctions, updateGraphqlSchemaStep, updateResolverIndex } from "./graphql-steps";
import { createDaoFunctions } from "./dao-steps";

const pocWorkflow = new Workflow({
    name: "poc-workflow",
    triggerSchema: z.object({
        entityDescription: z.string(),
        existingSchemaContent: z.string(),
        sampleDaoContent: z.string(),
        sampleResolverContent: z.string(),
        existingResolverObjectContent: z.string(),
    }),
});

pocWorkflow
    .step(updateGraphqlSchemaStep)
    .then(createDaoFunctions)
    .then(createResolverFunctions)
    .then(updateResolverIndex);

pocWorkflow.commit();

export { pocWorkflow };