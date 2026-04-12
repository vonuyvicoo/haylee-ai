import z from "zod";

export type Refine<T> = (val: T, ctx: z.RefinementCtx) => void;
