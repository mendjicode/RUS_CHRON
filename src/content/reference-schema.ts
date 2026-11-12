import {z} from 'zod';
export const termSchema=z.object({id:z.string().min(1),title:z.string().min(2),definition:z.string().min(30),example:z.string().min(20),sources:z.array(z.string()).optional(),lessonIds:z.array(z.string()).optional()});
export const personSchema=z.object({id:z.string().min(1),name:z.string().min(2),years:z.string(),role:z.string(),eraId:z.string(),bio:z.string().min(30),actions:z.string().min(10),debate:z.string().min(25),sources:z.array(z.string()).min(1),lessonIds:z.array(z.string()).optional()});
const contextEvent=z.object({title:z.string().min(3),description:z.string().min(30)});
export const worldContextSchema=z.object({id:z.string(),year:z.number().int(),eraId:z.string(),russia:contextEvent,world:contextEvent,connection:z.string().min(30),lessonIds:z.array(z.string()).min(1),sources:z.array(z.string()).min(2)});
