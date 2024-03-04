import axios from "axios";

type OpenAiResponseData = {
	id: string;
	object: string;
	created: number;
	model: string;
	choices: {
		message: {
			role: string;
			content: string;
			finish_reason:
				| "stop"
				| "length"
				| "function_call"
				| "content_filter"
				| null;
		};
		index: number;
	}[];
	usage: {
		prompt_tokens: number;
		completion_tokens: number;
		total_tokens: number;
	};
	system_fingerprint: string;
};

type ResponseData = {
	message: string;
	suggestions?: string;
};

const getSuggestions = async (cvText: string) => {
	if (!process.env.OPENAI_API_KEY) {
		throw new Error("No OpenAI API key found.");
	}
	return axios.post<OpenAiResponseData>(
		"https://api.openai.com/v1/chat/completions",
		{
			model: process.env.OPENAPI_GPT_MODEL || "gpt-3.5-turbo",
			messages: [
				{
					role: "system",
					content:
						"Você é um assistente que irá receber currículos de profissionais e sugerirá melhorias personalizadas com base no currículo que recebeu. Evite sugestões sobre formatação.",
				},
				{
					role: "user",
					content: cvText,
				},
			],
		},
		{
			headers: {
				Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
			},
		}
	);
};

export async function POST(req: Request): Promise<Response> {
	const reqBody = await req.json();

	try {
		const { cv_text } = reqBody;
		if (!cv_text) {
			return Response.json(
				{ message: "No CV text provided" },
				{
					status: 400,
				}
			);
		}
		const openAiResponse = await getSuggestions(cv_text);
		const data = openAiResponse.data;
		if (!data.choices.length) {
			return Response.json(
				{ message: "No suggestions generated" },
				{
					status: 500,
				}
			);
		}

		return Response.json(
			{
				message: "Suggestions generated",
				suggestions: data.choices[0].message.content,
			},
			{
				status: 200,
			}
		);
	} catch (err) {
		console.error(err);
		return Response.json(
			{ message: "Internal server error" },
			{
				status: 500,
			}
		);
	}
}
