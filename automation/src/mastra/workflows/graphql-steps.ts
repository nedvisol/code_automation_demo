import { z } from "zod";
import { Step } from '@mastra/core/workflows';
import { graphqlAgent } from '../agents/graphql-agent';

export const updateGraphqlSchemaStep = new Step({
    id: "updateGraphqlSchema",
    inputSchema: z.object({
      entityDescription: z.string(),  
      existingSchemaContent: z.string(),
    }),
    outputSchema: z.object({
      updatedSchemaContent: z.string(),      
      isExternalApi: z.boolean(),
    }),
    execute: async ({ context }:any) => {
      const triggerResult = context?.getStepResult("trigger") as {
        entityDescription: string;
        existingSchemaContent: string;
      };
      const entityDescription = triggerResult?.entityDescription;
      const existingSchemaContent = triggerResult?.existingSchemaContent;
   
      const prompt = `
            The objective is to update the existing GraphQL schema to include a new entity defined by the detail below:
             ${entityDescription}             
            -----------------------------  
            The current schema is as follows:
            \`\`\`
            ${existingSchemaContent}
            \`\`\`
            -----------------------------
            Please update the schema to include the new entity. 
            The existing schema content should be included in the response.
            Make sure to follow best practices for schema design and include any necessary relationships or fields.

            Please also determine whether this entity will require integration with an external API.
          `;
   
      const res = await graphqlAgent.generate(prompt, {
        output: z.object({
            updatedSchemaContent: z.string(),
            isExternalApi: z.boolean(),
        }),
      });
   
      return res.object;
    },
});