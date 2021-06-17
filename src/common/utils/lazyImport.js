import { lazy } from "react";

// const lazyImport = (fn, delay = 300) => lazy(() => {
//     return new Promise(resolve => {
//         setTimeout(resolve(fn()), delay)
//     })
// })

export const lazyImport = (fn, delay = 300) =>
    lazy(() => {
        return Promise.all([
            fn(),
            new Promise((resolve) => setTimeout(resolve, delay)),
        ]).then(([moduleExports]) => moduleExports);
    });
