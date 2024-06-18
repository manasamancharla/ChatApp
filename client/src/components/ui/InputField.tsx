interface InputFieldProps {
	name: string;
	type: string;
	required: boolean;
	value: string;
	onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const InputField: React.FC<InputFieldProps> = ({
	name,
	type,
	required = false,
	value,
	onChange,
}) => {
	const id = `${name}-input`;

	return (
		<div className="w-full flex justify-center">
			<div className="w-full sm:max-w-[400px] lg:min-w-[400px]">
				<label
					htmlFor="email"
					className="block text-sm font-medium mb-1 leading-6"
				>
					{name}
				</label>
				<input
					id={id}
					name={name}
					type={type}
					required={required}
					onChange={onChange}
					value={value}
					className="block w-full rounded-md border-0 p-1.5 sm:text-sm sm:leading-6 ring-1 ring-inset"
				/>
			</div>
		</div>
	);
};
