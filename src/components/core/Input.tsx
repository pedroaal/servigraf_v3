import type { Component } from "solid-js";
import { type JSX, splitProps } from "solid-js";

interface IProps {
	name: string;
	type?: "text" | "email" | "tel" | "password" | "url" | "date" | "number";
	label?: string;
	placeholder?: string;
	value: string | undefined;
	error: string;
	required?: boolean;
	class?: string;
	containerClass?: string;
	labelClass?: string;
	errorClass?: string;
	ref: (element: HTMLInputElement) => void;
	onInput: JSX.EventHandler<HTMLInputElement, InputEvent>;
	onChange: JSX.EventHandler<HTMLInputElement, Event>;
	onBlur: JSX.EventHandler<HTMLInputElement, FocusEvent>;
	disabled?: boolean;
	readonly?: boolean;
}

const Input: Component<IProps> = (props) => {
	const [, inputProps] = splitProps(props, [
		"value",
		"label",
		"error",
		"class",
		"containerClass",
		"labelClass",
		"errorClass",
		"required",
		"disabled",
		"readonly",
	]);

	return (
		<fieldset class="fieldset">
			<legend class="fieldset-legend">
				{props.label}
				{props.required && <span class="required">*</span>}
			</legend>
			<input
				{...inputProps}
				id={props.name}
				value={props.value || ""}
				aria-invalid={!!props.error}
				aria-errormessage={props.error ? `${props.name}-error` : undefined}
				class="input w-full"
				classList={{ "input-error": !!props.error }}
				disabled={props.disabled}
				readonly={props.readonly}
			/>
			{props.error && <p class="legend text-error">{props.error}</p>}
		</fieldset>
	);
};

export default Input;
