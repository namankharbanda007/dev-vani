import { CATEGORY_LABELS, DISPLAY_ORDER, CATEGORY_MAP } from "@/lib/categoryMapping";
import CharacterSection from "./CharacterSection";

interface UserPersonalitiesProps {
    onPersonalityPicked: (personalityIdPicked: string) => void;
    allPersonalities: IPersonality[];
    personalityIdState: string;
    languageState: string;
    disableButtons: boolean;
    selectedFilters: PersonalityFilter[]; // Kept for interface compatibility but ignored
    myPersonalities: IPersonality[];
}

const UserPersonalities: React.FC<UserPersonalitiesProps> = ({
    onPersonalityPicked,
    allPersonalities,
    personalityIdState,
    languageState,
    disableButtons,
    myPersonalities,
}) => {
    return (
        <div className="flex flex-col gap-12 w-full">
            {myPersonalities.length > 0 && (
                <CharacterSection
                    allPersonalities={myPersonalities}
                    languageState={languageState}
                    personalityIdState={personalityIdState}
                    onPersonalityPicked={onPersonalityPicked}
                    title={"My Characters"}
                    disableButtons={disableButtons}
                    // We pass empty filters to bypass the old filtering logic inside CharacterSection if we haven't updated it yet,
                    // or we will rely on CharacterSection being smart enough.
                    // Actually, we should pass "all" or handle it.
                    // For now we will pass a special "bypass" or just handle explicitly in CharacterSection that we are passing filtered list.
                    // Wait, CharacterSection filters internally. We need to prevent double filtering or ensure it works.
                    // Strategy: We will filter HERE and pass to CharacterSection, so CharacterSection needs to accept pre-filtered list and NOT filter again if we want to be clean.
                    // OR we make CharacterSection filtering optional.
                    // Let's modify CharacterSection to take an optional `skipFiltering` prop or just pass the subset.
                    // If we pass a subset as `allPersonalities` and empty `selectedFilters`, CharacterSection currently returns EVERYTHING passed to it (because length 0 returns true).
                    selectedFilters={[]}
                />
            )}

            {DISPLAY_ORDER.map((categoryKey) => {
                const categoryLabel = CATEGORY_LABELS[categoryKey];
                const allowedKeys = CATEGORY_MAP[categoryKey] || [];
                const categoryPersonalities = allPersonalities.filter(p => allowedKeys.includes(p.key));

                if (categoryPersonalities.length === 0) return null;

                return (
                    <div key={categoryKey} className="flex flex-col gap-4">
                        <CharacterSection
                            allPersonalities={categoryPersonalities}
                            languageState={languageState}
                            personalityIdState={personalityIdState}
                            onPersonalityPicked={onPersonalityPicked}
                            title={categoryLabel}
                            disableButtons={disableButtons}
                            selectedFilters={[]} // Pass empty so it renders all of the subset we passed
                        />
                    </div>
                );
            })}
        </div>
    );
};

export default UserPersonalities;
