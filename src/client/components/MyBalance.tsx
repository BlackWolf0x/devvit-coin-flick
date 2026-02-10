interface MyBalanceProps {
	displayBalance: number;
}

export function MyBalance({ displayBalance }: MyBalanceProps) {
	return (
		<div className="absolute top-6 left-4">
			<img
				src="/misc/currency.png"
				width={80}
				height={80}
				className="w-10 absolute left-0 top-1/2 -translate-y-1/2"
			/>

			<div className="ml-3 pl-10 pr-4 h-6 flex items-center rounded-md bg-[#3E3525]">
				<span className="font-semibold text-white">
					{displayBalance ? displayBalance : 0}
				</span>
			</div>
		</div>
	);
}
