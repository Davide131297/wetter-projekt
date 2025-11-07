import { ReactNode } from "react";
import { cn } from "@/lib/utils";

type WeatherInfoBoxProps = {
  color: "orange" | "blue" | "green" | "purple";
  title: string | ReactNode;
  value: string | ReactNode;
  subtitle?: string | ReactNode;
};

export default function WeatherInfoBox({
  color,
  title,
  value,
  subtitle,
}: WeatherInfoBoxProps) {
  const colorVariants = {
    orange: {
      bg: "bg-linear-to-br from-orange-50 to-red-50",
      text: "text-orange-600",
    },
    blue: {
      bg: "bg-linear-to-br from-blue-50 to-cyan-50",
      text: "text-blue-600",
    },
    green: {
      bg: "bg-linear-to-br from-green-50 to-emerald-50",
      text: "text-green-600",
    },
    purple: {
      bg: "bg-linear-to-br from-purple-50 to-pink-50",
      text: "text-purple-600",
    },
  };

  const variant = colorVariants[color];

  return (
    <div className={cn("space-y-2 p-4 rounded-lg", variant.bg)}>
      <p className="text-sm text-muted-foreground">{title}</p>
      <p className={cn("text-4xl font-bold", variant.text)}>{value}</p>
      {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
    </div>
  );
}
