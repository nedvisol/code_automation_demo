import { z } from "zod";
import { Step } from '@mastra/core/workflows';
import { graphqlAgent } from '../agents/graphql-agent';

interface CreateDaoFunctionsInput {
    entityDescription: string;
    sampleDaoContent: string;
}

export const createDaoFunctions = new Step({
    id: "createDaoFunctions",
    inputSchema: z.object({
      entityDescription: z.string(),  
      sampleDaoContent: z.string(),
    }),
    outputSchema: z.object({
      generatedDaoFile: z.string(),            
    }),
    execute: async ({ context }:any) => {
      const triggerResult = context?.getStepResult("trigger") as CreateDaoFunctionsInput;
      const entityDescription = triggerResult?.entityDescription;
      const sampleDaoContent = triggerResult?.sampleDaoContent;
   
      const prompt = `
            The objective is generate data access functions for the new entity defined by the detail below:
             ${entityDescription}             
            -----------------------------  
            An example of a data access object (DAO) file is as follows:
            \`\`\`
            ${sampleDaoContent}
            \`\`\`
            -----------------------------
          `;
   
      const res = await graphqlAgent.generate(prompt, {
        output: z.object({
            generatedDaoFile: z.string(),            
        }),
      });
   
      return res.object;
    },
});