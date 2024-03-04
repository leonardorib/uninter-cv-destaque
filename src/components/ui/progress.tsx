"use client";

import * as React from "react";
import { Loader2 } from "lucide-react";

import { cn } from "@/lib/utils";

const Progress = ({ className }: { className?: string }) => (
	<div className={cn("flex items-center justify-center w-full ", className)}>
		<Loader2 className="w-8 h-8 animate-spin" />
	</div>
);

export { Progress };
