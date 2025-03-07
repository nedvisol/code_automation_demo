import { Mastra } from "@mastra/core/mastra";
import { pocWorkflow } from "./workflows/poc";
import fs from 'fs';

const mastra = new Mastra({
    workflows: {
        pocWorkflow,
    },
});

type PocWorkflowRunParams = {
    entityDescriptionFile: string;
    existingSchemaFile: string;
    sampleDaoFile: string;
    sampleResolverFile: string;
    existingResolverObjectFile: string;
}

const pocWorkflowRun = async (params: PocWorkflowRunParams) => {
    const { runId, start } = mastra.getWorkflow("pocWorkflow").createRun();

    console.log("Run", runId);
    const entityDescription = fs.readFileSync(params.entityDescriptionFile, "utf-8");
    const existingSchemaContent = fs.readFileSync(params.existingSchemaFile, "utf-8");
    const sampleDaoContent = fs.readFileSync(params.sampleDaoFile, "utf-8");
    const sampleResolverContent = fs.readFileSync(params.sampleResolverFile, "utf-8");
    const existingResolverObjectContent = fs.readFileSync(params.existingResolverObjectFile, "utf-8");

    const runResult = await start({
        triggerData: { 
            entityDescription, 
            existingSchemaContent, 
            sampleDaoContent, 
            sampleResolverContent, 
            existingResolverObjectContent,
    },
    });

    console.log("Final output:", runResult.results);
};

pocWorkflowRun({
    entityDescriptionFile: "../graph-server/automation/book.md",
    existingSchemaFile: "../graph-server/src/schema.graphql",
    sampleDaoFile: "../graph-server/src/dao/author.ts",
    sampleResolverFile: "../graph-server/src/resolvers/author.ts",
    existingResolverObjectFile: "../graph-server/src/resolvers/index.ts",
});