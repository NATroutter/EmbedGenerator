import React from 'react';

function button(type: "red" | "disabled" = "red") {
	return `font-medium py-1 px-2 rounded transition ${type === "red"
			? "bg-[#d83c3e] hover:bg-[#a12d2f] text-white"
			: "bg-[#4f545c] cursor-not-allowed"
	}`;
}

interface ButtonBaseProps {
  disabled?: boolean,
  onClick?: React.MouseEventHandler<HTMLButtonElement> | undefined,
  callback?: () => void
};

export default function BasicButton({ children, disabled = false, onClick }: React.PropsWithChildren<ButtonBaseProps>) {
  return (
    <button type="button" onClick={onClick} className={button(disabled ? "disabled" : "red")}>
      {children}
    </button>
  );
}