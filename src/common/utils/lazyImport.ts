import { lazy } from "react";

export const lazyImport = (fn:()=>Promise<any>, delay = 300) =>
    lazy(() => {
        return Promise.all([
            fn(),
            new Promise((resolve) => setTimeout(resolve, delay)),
        ]).then(([moduleExports]) => moduleExports);
    });
