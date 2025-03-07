import { z } from "zod";
import { Step } from '@mastra/core/workflows';
import { graphqlAgent } from '../agents/graphql-agent';

interface updateGraphqlSchemaStepInput {
  entityDescription: string;
  existingSchemaContent: string;
}


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
      const triggerResult:updateGraphqlSchemaStepInput = context?.getStepResult("trigger");
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

interface createResolverFunctionsInput {
  entityDescription: string;
  sampleResolverContent: string;
}

export const createResolverFunctions = new Step({
    id: "createResolverFunctions",
    inputSchema: z.object({
      entityDescription: z.string(),  
      sampleResolverContent: z.string(),
    }),
    outputSchema: z.object({
      generatedResolverContent: z.string(),            
    }),
    execute: async ({ context }:any) => {
      const triggerResult:createResolverFunctionsInput = context?.getStepResult("trigger");
      const entityDescription = triggerResult?.entityDescription;
      const sampleResolverContent = triggerResult?.sampleResolverContent;
   
      const prompt = `
            The objective is to generate GraphQL resolver functions for the new entity defined by the detail below:
             ${entityDescription}             
            -----------------------------  
            An example of a file containing resolver functions for an entity is as follows:
            \`\`\`
            ${sampleResolverContent}
            \`\`\`
            -----------------------------
          `;
   
      const res = await graphqlAgent.generate(prompt, {
        output: z.object({
          generatedResolverContent: z.string(),            
        }),
      });
   
      return res.object;
    },
});

interface updateResolverIndexInput {
  entityDescription: string;
  existingResolverObjectContent: string;
}

export const updateResolverIndex = new Step({
    id: "updateResolverIndex",
    inputSchema: z.object({
      entityDescription: z.string(),  
      existingResolverObjectContent: z.string(),
    }),
    outputSchema: z.object({
      updatedResolverObjectContent: z.string(),            
    }),
    execute: async ({ context }:any) => {
      const triggerResult:updateResolverIndexInput = context?.getStepResult("trigger");
      const entityDescription = triggerResult?.entityDescription;
      const existingResolverObjectContent = triggerResult?.existingResolverObjectContent;
   
      const prompt = `
            The objective is to update an existing resolver object to include the new entity defined by the detail below:
             ${entityDescription}             
            -----------------------------  
            The existing resolver object file is as follows:
            \`\`\`
            ${existingResolverObjectContent}
            \`\`\`
            -----------------------------
            Update the resolver object to include the new entity. 
            The existing resolver object content should be included in the response.
          `;
   
      const res = await graphqlAgent.generate(prompt, {
        output: z.object({
          updatedResolverObjectContent: z.string(),            
        }),
      });
   
      return res.object;
    },
});