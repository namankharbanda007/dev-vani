import { CATEGORY_LABELS, DISPLAY_ORDER } from "@/lib/categoryMapping";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Dispatch, SetStateAction } from "react";

interface PersonalityFiltersProps {
    setSelectedFilters: Dispatch<SetStateAction<PersonalityFilter[]>>;
    selectedFilters: PersonalityFilter[];
    languageState: string;
    currentUser: IUser;
}

const PersonalityFilters = ({
    setSelectedFilters,
    selectedFilters,
    currentUser,
}: PersonalityFiltersProps) => {
    const isDoctor = currentUser.user_info?.user_type === "doctor";

    return (
        <div className="overflow-x-auto scrollbar-hide">
            <ToggleGroup
                type="multiple"
                variant="outline"
                size="sm"
                value={selectedFilters}
                onValueChange={(value: string[]) => {
                    setSelectedFilters(value as PersonalityFilter[]);
                }}
                className="justify-start mb-4 ml-1 text-xs inline-flex flex-nowrap min-w-max"
            >
                {DISPLAY_ORDER.map((categoryKey) => (
                    <ToggleGroupItem
                        key={categoryKey}
                        value={categoryKey}
                        aria-label={`Toggle ${CATEGORY_LABELS[categoryKey]}`}
                        className="rounded-full flex items-center gap-2 text-xs border border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 [&[data-state=on]]:bg-black [&[data-state=on]]:text-white [&[data-state=on]]:border-black"
                    >
                        {CATEGORY_LABELS[categoryKey]}
                    </ToggleGroupItem>
                ))}

            </ToggleGroup>
        </div>
    );
};

export default PersonalityFilters;
