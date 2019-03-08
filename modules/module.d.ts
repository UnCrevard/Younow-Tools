
declare module NodeJS {
	interface Global {
		system:
		{
			verbosity: number
			maxRetry:number
			maxParallelDownload:number
		}
	}
}
