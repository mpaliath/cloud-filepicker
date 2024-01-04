import {resolve} from 'path';

import react from '@vitejs/plugin-react';
import hq from 'alias-hq';
import postcssPresetEnv from 'postcss-preset-env';
import {defineConfig} from 'vite';
import dts from 'vite-plugin-dts';

// https://vitejs.dev/config/
export default defineConfig({
    resolve: {
        alias: hq.get('rollup'),
    },
    plugins: [react(), dts({rollupTypes: true, exclude: ['**/*.stories.(ts|tsx)']})],
    build: {
        sourcemap: true,
        lib: {
            // Could also be a dictionary or array of multiple entry points
            entry: resolve(__dirname, 'src/lib/index.ts'),
            name: 'Fetch Cloud Photos',
            // the proper extensions will be added
            fileName: 'index',
        },
        rollupOptions: {
            // make sure to externalize deps that shouldn't be bundled
            // into your library

            output: {
                // Provide global variables to use in the UMD build
                // for externalized deps
                globals: {
                    react: 'React',
                },
                assetFileNames: assetInfo => {
                    if (assetInfo.name == 'style.css') return 'Cloud-FilePicker.css';
                    return assetInfo.name;
                },
            },
        },
    },
    css: {
        postcss: {
            plugins: [postcssPresetEnv({})],
        },
    },
});
