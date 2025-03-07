import { z } from "zod";
import { Step } from '@mastra/core/workflows';
import { graphqlAgent } from '../agents/graphql-agent';

interface CreateDaoFunctionsInput {
    entityDescription: string;
    sampleDaoContent: string;
    sampleDaoFilePath: string;
}

export const createDaoFunctions = new Step({
    id: "createDaoFunctions",
    inputSchema: z.object({
      entityDescription: z.string(),  
      sampleDaoContent: z.string(),
      sampleDaoFilePath: z.string(),
    }),
    outputSchema: z.object({
      generatedDaoFile: z.string(), 
      recommendedDaoPath: z.string(),           
    }),
    execute: async ({ context }:any) => {
      const triggerResult = context?.getStepResult("trigger") as CreateDaoFunctionsInput;
      const entityDescription = triggerResult?.entityDescription;
      const sampleDaoContent = triggerResult?.sampleDaoContent;
      const sampleDaoFilePath = triggerResult?.sampleDaoFilePath;
   
      const prompt = `
            The objective is generate data access functions for the new entity defined by the detail below:
             ${entityDescription}             
            -----------------------------  
            An example of a data access object (DAO) file is as follows:
            \`\`\`
            ${sampleDaoContent}
            \`\`\`
            -----------------------------

            In addition, make a recommendation for the file name and path for this new data access functions file.
            The recommended path should be be similar to the following:
            ${sampleDaoFilePath}
          `;
   
      const res = await graphqlAgent.generate(prompt, {
        output: z.object({
            generatedDaoFile: z.string(),   
            recommendedDaoPath: z.string(),         
        }),
      });
   
      return res.object;
    },
});