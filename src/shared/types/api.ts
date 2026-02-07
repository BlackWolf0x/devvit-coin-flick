export type InitResponse = {
	type: 'init';
	postId: string;
	username: string;
};

export type CreatePuzzleRequest = {
	board: number[][];
};

export type CreatePuzzleResponse = {
	success: boolean;
	postId: string;
	postUrl?: string;
	message: string;
};
