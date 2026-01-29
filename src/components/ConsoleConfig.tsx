'use client';

import { useEffect } from 'react';

export default function ConsoleConfig() {
    useEffect(() => {
        if (process.env.NODE_ENV === 'production' && typeof window !== 'undefined') {
            // Save the original console methods immediately in case we need to restore them (optional, not implemented here)
            // Override console methods to be no-ops
            const noOp = () => { };

            console.log = noOp;
            console.info = noOp;
            console.warn = noOp;
            console.error = noOp;
            console.debug = noOp;
            console.trace = noOp;
            console.group = noOp;
            console.groupCollapsed = noOp;
            console.groupEnd = noOp;
        }
    }, []);

    return null;
}
