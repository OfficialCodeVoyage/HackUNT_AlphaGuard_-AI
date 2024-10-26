import { Pie, PieChart, Cell, Legend, ResponsiveContainer } from "recharts";
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart";

export default function CallChart({
    spamCalls,
    nonSpamCalls,
}: {
    spamCalls: number;
    nonSpamCalls: number;
}) {
    const data = [
        { name: "Spam Calls", value: spamCalls },
        { name: "Non-Spam Calls", value: nonSpamCalls },
    ];

    const COLORS = ["hsl(var(--destructive))", "hsl(var(--primary))"];

    return (
        <ChartContainer
            config={{
                spam: {
                    label: "Spam Calls",
                    color: "hsl(var(--destructive))",
                },
                nonSpam: {
                    label: "Non-Spam Calls",
                    color: "hsl(var(--primary))",
                },
            }}
            className="h-[300px]"
        >
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                    >
                        {data.map((entry, index) => (
                            <Cell
                                key={`cell-${index}`}
                                fill={COLORS[index % COLORS.length]}
                            />
                        ))}
                    </Pie>
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Legend />
                </PieChart>
            </ResponsiveContainer>
        </ChartContainer>
    );
}
