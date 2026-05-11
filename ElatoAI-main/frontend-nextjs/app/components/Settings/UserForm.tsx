import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import React, { forwardRef } from "react";
import {
    userFormAgeDescription,
    userFormAgeLabel,
    userFormPersonaLabel,
    userFormPersonaPlaceholder,
} from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
interface GeneralUserFormProps {
    selectedUser?: IUser;
    heading?: React.ReactNode;
    onSave?: (values: any, userType: "doctor" | "user", userId: string) => void;
    onClickCallback: () => void;
    userId: string;
    disabled?: boolean;
}


export const UserSettingsSchema = z.object({
    supervisee_name: z.string().min(1).max(50),
    supervisee_age: z.number().min(1).max(18),
    supervisee_persona: z.string().max(500).optional(),
    birth_place: z.string().optional(),
    birth_time: z.string().optional(), // Could be validated as regex for time if needed, sticking to string for flexibility
    birth_date: z.string().optional(),
    rashi: z.string().optional(),
    modules: z
        .array(z.enum(["math", "science", "spelling", "general_trivia"]))
        .refine((value) => value.some((item) => item), {
            message: "You have to select at least one item.",
        }),
});

export type GeneralUserInput = z.infer<typeof UserSettingsSchema>;

const GeneralUserForm = ({ selectedUser, onSave, onClickCallback, userId, heading, disabled }: GeneralUserFormProps) => {
    const userMetadata = (selectedUser?.user_info as any)?.user_metadata as IUserMetadata | undefined;

    const form = useForm<GeneralUserInput>({
        defaultValues: {
            supervisee_name: selectedUser?.supervisee_name ?? "",
            supervisee_age: selectedUser?.supervisee_age ?? 0,
            supervisee_persona: selectedUser?.supervisee_persona ?? "",
            birth_place: userMetadata?.birth_place ?? "",
            birth_time: userMetadata?.birth_time ?? "",
            birth_date: userMetadata?.birth_date ?? "",
            rashi: userMetadata?.rashi ?? "",
        },
    });

    async function onSubmit(values: z.infer<typeof UserSettingsSchema>) {
        onSave && onSave(values, "user", userId);
    }

    const handleSave = () => {
        onSave && onSave(form.getValues(), "user", userId);
        onClickCallback();
    };

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex flex-col gap-8 mb-4"
            >
                {heading}
                <section className="space-y-4 max-w-screen-sm">
                    <h2 className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-amber-600 border-b border-gray-200/50 pb-2 flex items-center gap-2">
                        Basic Info
                    </h2>
                    <div className="flex flex-col gap-6">
                        <FormField
                            control={form.control}
                            name="supervisee_name"
                            render={({ field }) => (
                                <FormItem className="w-full rounded-md">
                                    <FormLabel className="text-sm font-semibold text-gray-700">
                                        Your Name
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            required
                                            placeholder="e.g. Rahul Sharma"
                                            {...field}
                                            className="bg-white/50 border-gray-200 focus:border-purple-400 focus:ring-purple-200 transition-all rounded-xl"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        {/* for child age */}
                        <FormField
                            control={form.control}
                            name="supervisee_age"
                            render={({ field }) => (
                                <FormItem className="w-full rounded-md">
                                    <FormLabel className="text-sm font-semibold text-gray-700">
                                        {userFormAgeLabel}
                                    </FormLabel>
                                    <FormDescription className="text-xs text-gray-500">
                                        {userFormAgeDescription}
                                    </FormDescription>
                                    <FormControl>
                                        <Input
                                            required
                                            type="number"
                                            placeholder="e.g. 24"
                                            {...field}
                                            className="bg-white/50 border-gray-200 focus:border-purple-400 focus:ring-purple-200 transition-all rounded-xl"
                                            onChange={(e) => field.onChange(Number(e.target.value))}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="supervisee_persona"
                            render={({ field }) => (
                                <FormItem className="w-full rounded-md">
                                    <FormLabel className="text-sm font-semibold text-gray-700">
                                        {userFormPersonaLabel}
                                    </FormLabel>
                                    <FormControl>
                                        <Textarea
                                            rows={4}
                                            placeholder={
                                                userFormPersonaPlaceholder
                                            }
                                            {...field}
                                            className="bg-white/50 border-gray-200 focus:border-purple-400 focus:ring-purple-200 transition-all rounded-xl resize-none"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                </section>

                <section className="space-y-4 max-w-screen-sm">
                    <h2 className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-amber-600 to-orange-600 border-b border-gray-200/50 pb-2 flex items-center gap-2">
                        Birth Details
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                            control={form.control}
                            name="birth_place"
                            render={({ field }) => (
                                <FormItem className="w-full rounded-md">
                                    <FormLabel className="text-sm font-semibold text-gray-700">
                                        Birth Place
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="e.g. Mumbai, India"
                                            {...field}
                                            className="bg-white/50 border-gray-200 focus:border-amber-400 focus:ring-amber-200 transition-all rounded-xl"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="birth_date"
                            render={({ field }) => (
                                <FormItem className="w-full rounded-md">
                                    <FormLabel className="text-sm font-semibold text-gray-700">
                                        Birth Date
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            type="date"
                                            placeholder="DD/MM/YYYY"
                                            {...field}
                                            className="bg-white/50 border-gray-200 focus:border-amber-400 focus:ring-amber-200 transition-all rounded-xl"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="birth_time"
                            render={({ field }) => (
                                <FormItem className="w-full rounded-md">
                                    <FormLabel className="text-sm font-semibold text-gray-700">
                                        Birth Time
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            type="time"
                                            {...field}
                                            className="bg-white/50 border-gray-200 focus:border-amber-400 focus:ring-amber-200 transition-all rounded-xl"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="rashi"
                            render={({ field }) => (
                                <FormItem className="w-full rounded-md">
                                    <FormLabel className="text-sm font-semibold text-gray-700">
                                        Rashi (Optional)
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="e.g. Mesha (Aries)"
                                            {...field}
                                            className="bg-white/50 border-gray-200 focus:border-amber-400 focus:ring-amber-200 transition-all rounded-xl"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                </section>
                <Button
                    variant="default"
                    className="rounded-full w-fit mt-4 flex flex-row items-center gap-2"
                    size="sm"
                    onClick={handleSave}
                    type="submit"
                    disabled={disabled}
                >
                    {disabled ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>Save settings</span>}
                </Button>
            </form>
        </Form>
    );
};

export default GeneralUserForm;
