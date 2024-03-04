"use client";
import { Textarea } from "../components/ui/textarea";
import { Button } from "../components/ui/button";
import axios from "axios";
import { useRef, useState } from "react";
import { Progress } from "../components/ui/progress";
import Markdown from "react-markdown";
import remarkBreaks from "remark-breaks";

export default function Home() {
	const cvText = useRef("");
	const [hasText, setHasText] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [suggestions, setSuggestions] = useState<string>("");
	const getSuggestions = async (cvText: string) => {
		if (isLoading) return;
		if (!cvText) return;
		setIsLoading(true);
		try {
			const response = await axios.post("/api/generate-suggestions", {
				cv_text: cvText,
			});
			const data = response?.data;
			const suggestions = data?.suggestions;
			setSuggestions(suggestions);
		} catch (err) {
			console.error(err);
		} finally {
			setIsLoading(false);
		}
	};

	const reset = () => {
		cvText.current = "";
		setSuggestions("");
		setHasText(false);
	};

	return (
		<main className="flex min-h-screen flex-col items-center justify-between py-16 pb-28 lg:py-24 px-8 lg:px-24">
			<div className="fixed bottom-0 left-0 right-0 z-10 flex flex-col items-center justify-center h-20 text-xs border-t-2 bg-gray-800">
				<p>Autoria: Leonardo Ribeiro</p>
				<p>Análise e Desenvolvimento de Sistemas - Uninter</p>
				<p>RU 4224569</p>
			</div>
			<div className="flex flex-col items-center justify-center w-full">
				<h1 className="scroll-m-20 mb-12 text-4xl font-extrabold tracking-tight lg:text-5xl">
					CV Destaque
				</h1>

				{suggestions ? (
					<div className="max-w-4xl">
						<Markdown remarkPlugins={[remarkBreaks]}>
							{suggestions.replace(/\n/gi, "&nbsp; \n")}
						</Markdown>
						<div className="flex items-center justify-center">
							<Button
								type="button"
								className="mt-8 w-full max-w-[400px]"
								onClick={reset}
							>
								Voltar
							</Button>
						</div>
					</div>
				) : (
					<form
						className="text-center"
						onSubmit={(e) => {
							e.preventDefault();
							getSuggestions(cvText.current);
						}}
					>
						<p className="mb-4">
							Copie todo o conteúdo do seu currículo e cole no campo abaixo.
						</p>

						<p className="mb-8">
							Uma inteligência artificial irá analisar o conteúdo e te dará
							recomendações para melhorá-lo.
						</p>

						<Textarea
							disabled={isLoading}
							className="mb-12 min-h-[300px] placeholder:text-lg"
							placeholder="Cole aqui o conteúdo do seu currículo"
							onChange={(e) => {
								cvText.current = e.target.value;
								setHasText(!!e.target.value);
							}}
						/>

						<Button
							disabled={isLoading || !hasText}
							type="submit"
							className="w-full max-w-[400px]"
						>
							{isLoading ? <Progress /> : "Gerar recomendações"}
						</Button>
					</form>
				)}
			</div>
		</main>
	);
}
