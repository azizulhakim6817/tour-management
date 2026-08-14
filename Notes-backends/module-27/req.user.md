# 1. interfaces--index.d.ts---req.user---------------------

```js
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Request } from "express";
import { JwtPayload } from "jsonwebtoken";

declare global {
  namespace Express {
    interface Request {
      user: JwtPayload;
    }
  }
}
```

# 2. tsconfig.json-------------------

==> end line add ---> "include": ["./interfaces/index.d.ts]
