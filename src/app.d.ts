// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		interface Locals {
			isAdmin?: boolean;
		}
		interface Platform {
			env: {
				DB?: D1Database;
				IMAGES_BUCKET?: R2Bucket;
				ADMIN_PASSWORD?: string;
				ADMIN_SECRET?: string;
				ASSETS?: Fetcher;
			};
			cf?: CfProperties;
			ctx?: ExecutionContext;
		}
	}
}

export {};