const z = require("zod");

const user = z.object({
  firstName: z.string().min(1).max(20),
});
