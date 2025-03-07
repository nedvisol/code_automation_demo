import { Mastra } from "@mastra/core/mastra";
import { pocWorkflow } from "./workflows/poc";
import fs from 'fs';
import { createBackup } from "./util";

const mastra = new Mastra({
    workflows: {
        pocWorkflow,
    },
});

type PocWorkflowRunParams = {
    entityDescriptionFile: string;
    existingSchemaFile: string;
    sampleDaoFilePath: string;
    sampleResolverFilePath: string;
    existingResolverObjectFile: string;
}

const pocWorkflowRun = async (params: PocWorkflowRunParams) => {
    const { runId, start } = mastra.getWorkflow("pocWorkflow").createRun();

    console.log("Run", runId);
    const entityDescription = fs.readFileSync(params.entityDescriptionFile, "utf-8");
    const existingSchemaContent = fs.readFileSync(params.existingSchemaFile, "utf-8");
    const sampleDaoContent = fs.readFileSync(params.sampleDaoFilePath, "utf-8");
    const sampleResolverContent = fs.readFileSync(params.sampleResolverFilePath, "utf-8");
    const existingResolverObjectContent = fs.readFileSync(params.existingResolverObjectFile, "utf-8");

    const runResult = await start({
        triggerData: { 
            entityDescription, 
            existingSchemaContent, 
            sampleDaoContent, 
            sampleDaoFilePath: params.sampleDaoFilePath,
            sampleResolverContent, 
            sampleResolverFilePath: params.sampleResolverFilePath,
            existingResolverObjectContent,
    },
    });

    console.log("Final output:", runResult.results);
    const { updateGraphqlSchema, createDaoFunctions, createResolverFunctions, updateResolverIndex} = runResult.results as any;    
    createBackup(params.existingSchemaFile);
    fs.writeFileSync(params.existingSchemaFile, updateGraphqlSchema.output.updatedSchemaContent);


    const generatedDaoContent = createDaoFunctions.output.generatedDaoFile;
    const recommendedDaoPath = createDaoFunctions.output.recommendedDaoPath;
    fs.writeFileSync(recommendedDaoPath, generatedDaoContent);

    const generatedResolverContent = createResolverFunctions.output.generatedResolverContent;
    const recommendedResolverPath = createResolverFunctions.output.recommendedResolverPath;
    fs.writeFileSync(recommendedResolverPath, generatedResolverContent);

    const updatedResolverObjectContent = updateResolverIndex.output.updatedResolverObjectContent;
    createBackup(params.existingResolverObjectFile);
    fs.writeFileSync(params.existingResolverObjectFile, updatedResolverObjectContent);

    console.log("Backup files created and updated files written.");
};

pocWorkflowRun({
    entityDescriptionFile: "../graph-server/automation/book.md",
    existingSchemaFile: "../graph-server/src/schema.graphql",
    sampleDaoFilePath: "../graph-server/src/dao/author.ts",
    sampleResolverFilePath: "../graph-server/src/resolvers/author.ts",
    existingResolverObjectFile: "../graph-server/src/resolvers/index.ts",
});