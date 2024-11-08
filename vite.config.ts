import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import react from '@vitejs/plugin-react-swc';
import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill';
import { NodeModulesPolyfillPlugin } from '@esbuild-plugins/node-modules-polyfill';
import rollupNodePolyFill from 'rollup-plugin-node-polyfills';

// https://vitejs.dev/config/
export default defineConfig({
	base: '/',
	plugins: [
		// Allows using React dev server along with building a React application with Vite.
		// https://npmjs.com/package/@vitejs/plugin-react-swc
		react(),
		// Allows using the compilerOptions.paths property in tsconfig.json.
		// https://www.npmjs.com/package/vite-tsconfig-paths
		tsconfigPaths(),
	],
	publicDir: 'public',
	server: {
		host: 'localhost', // Cài đặt host nếu cần
	},
	optimizeDeps: {
		esbuildOptions: {
		  // Node.js global to browser polyfill
		  define: {
			global: 'globalThis',
		  },
		  // Enable esbuild polyfill plugins
		  plugins: [
			NodeGlobalsPolyfillPlugin({
			  buffer: true,
			}),
			NodeModulesPolyfillPlugin(),
		  ],
		},
	  },
	  resolve: {
		alias: {
		  // These Node.js modules should be mocked or polyfilled for the browser
		  util: 'rollup-plugin-node-polyfills/polyfills/util',
		  sys: 'util',
		  events: 'rollup-plugin-node-polyfills/polyfills/events',
		  stream: 'rollup-plugin-node-polyfills/polyfills/stream',
		  path: 'rollup-plugin-node-polyfills/polyfills/path',
		  querystring: 'rollup-plugin-node-polyfills/polyfills/qs',
		  punycode: 'rollup-plugin-node-polyfills/polyfills/punycode',
		  url: 'rollup-plugin-node-polyfills/polyfills/url',
		  string_decoder: 'rollup-plugin-node-polyfills/polyfills/string-decoder',
		  http: 'rollup-plugin-node-polyfills/polyfills/http',
		  https: 'rollup-plugin-node-polyfills/polyfills/http',
		  os: 'rollup-plugin-node-polyfills/polyfills/os',
		  assert: 'rollup-plugin-node-polyfills/polyfills/assert',
		  constants: 'rollup-plugin-node-polyfills/polyfills/constants',
		  _stream_duplex: 'rollup-plugin-node-polyfills/polyfills/readable-stream/duplex',
		  _stream_passthrough: 'rollup-plugin-node-polyfills/polyfills/readable-stream/passthrough',
		  _stream_readable: 'rollup-plugin-node-polyfills/polyfills/readable-stream/readable',
		  _stream_writable: 'rollup-plugin-node-polyfills/polyfills/readable-stream/writable',
		  _stream_transform: 'rollup-plugin-node-polyfills/polyfills/readable-stream/transform',
		  timers: 'rollup-plugin-node-polyfills/polyfills/timers',
		  console: 'rollup-plugin-node-polyfills/polyfills/console',
		  vm: 'rollup-plugin-node-polyfills/polyfills/vm',
		  zlib: 'rollup-plugin-node-polyfills/polyfills/zlib',
		  tty: 'rollup-plugin-node-polyfills/polyfills/tty',
		  domain: 'rollup-plugin-node-polyfills/polyfills/domain',
		  buffer: 'rollup-plugin-node-polyfills/polyfills/buffer-es6',  // Add this alias for buffer
		},
	  },
	  build: {
		rollupOptions: {
		  plugins: [
			rollupNodePolyFill(),  // Polyfill Node.js core modules for browser use
		  ],
		},
	  },
});
