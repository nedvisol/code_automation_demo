import { Mastra } from "@mastra/core/mastra";
import { demoWorkflow } from "./workflows/demo";
import fs from 'fs';
import { createBackup } from "./util";

const mastra = new Mastra({
    workflows: {
        demoWorkflow,
    },
});

type DemoWorkflowRunParams = {
    entityDescriptionFile: string;
    existingSchemaFile: string;
    sampleDaoFilePath: string;
    sampleResolverFilePath: string;
    existingResolverObjectFile: string;
}

const demoWorkflowRun = async (params: DemoWorkflowRunParams) => {
    const { runId, start } = mastra.getWorkflow("demoWorkflow").createRun();

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
    const { 
        updateGraphqlSchemaStep, 
        createDaoFunctionsStep, 
        createResolverFunctionsStep, 
        updateResolverIndexStep,
    } = runResult.results as any;    
    createBackup(params.existingSchemaFile);
    fs.writeFileSync(params.existingSchemaFile, updateGraphqlSchemaStep.output.updatedSchemaContent);


    const generatedDaoContent = createDaoFunctionsStep.output.generatedDaoFile;
    const recommendedDaoPath = createDaoFunctionsStep.output.recommendedDaoPath;
    fs.writeFileSync(recommendedDaoPath, generatedDaoContent);

    const generatedResolverContent = createResolverFunctionsStep.output.generatedResolverContent;
    const recommendedResolverPath = createResolverFunctionsStep.output.recommendedResolverPath;
    fs.writeFileSync(recommendedResolverPath, generatedResolverContent);

    const updatedResolverObjectContent = updateResolverIndexStep.output.updatedResolverObjectContent;
    createBackup(params.existingResolverObjectFile);
    fs.writeFileSync(params.existingResolverObjectFile, updatedResolverObjectContent);

    console.log("Backup files created and updated files written.");
};

demoWorkflowRun({
    entityDescriptionFile: "../graph-server/automation/book.md",
    existingSchemaFile: "../graph-server/src/schema.graphql",
    sampleDaoFilePath: "../graph-server/src/dao/author.ts",
    sampleResolverFilePath: "../graph-server/src/resolvers/author.ts",
    existingResolverObjectFile: "../graph-server/src/resolvers/index.ts",
});