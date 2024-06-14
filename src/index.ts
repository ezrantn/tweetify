import { web } from "./application/web";

const port = process.env.PORT;

web.listen(3000, () => {
  console.log(`Server Ready at https://localhost:${port}`);
});
