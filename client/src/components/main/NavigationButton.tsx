import { IconType } from "react-icons";

interface NavMenuButtonProps {
    icon: IconType;
    label: string;
    onClick: () => void;
}

export function NavMenuButton({ icon: Icon, label, onClick }: NavMenuButtonProps) {
    return (
        <button
            type="button"
            onClick={onClick}
            className="flex items-center gap-3 text-white px-4 py-3 text-sm font-medium transition-colors w-full hover:bg-navy-hover"
        >
            <span className="text-lg">
                <Icon />
            </span>
            {label}
        </button>
    );
}