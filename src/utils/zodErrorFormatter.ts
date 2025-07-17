import { ZodIssue } from 'zod';

// formats zod validation errors into a structured array... Each object contains the field name and error message

export const zodErrorFormatter = (issues: ZodIssue[]) => {
    return issues.map((issue) => ({
        field: String(issue.path[0] ?? 'unknow'),
        message: issue.message,
    }));
};
