import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { X } from "lucide-react";
import { Dispatch, SetStateAction } from "react";
import { FaBookOpen, FaHandHoldingMedical } from "react-icons/fa";
import { FaChild } from "react-icons/fa6";

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


            </ToggleGroup>
        </div>
    );
};

export default PersonalityFilters;
