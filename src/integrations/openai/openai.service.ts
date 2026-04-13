export class OpenAIService {
	private readonly baseUrl = process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1';
	private readonly model = process.env.OPENAI_MODEL || 'gpt-4o-mini';

	private getApiKey() {
		return process.env.OPENAI_API_KEY;
	}

	async generateQuestions(documentType: string, template?: string) {
		const fallback = [
			'Siapa nama lengkap pemohon?',
			'Kapan tanggal mulai izin?',
			'Apa alasan pengajuan izin?',
			'Kepada siapa surat ditujukan?',
		];

		const apiKey = this.getApiKey();
		if (!apiKey) {
			return fallback;
		}

		const prompt = `Buatkan 5 pertanyaan singkat untuk mengisi surat ${documentType}. Template opsional: ${template ?? '-'}. Balas dalam JSON array string.`;
		const response = await fetch(`${this.baseUrl}/chat/completions`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${apiKey}`,
			},
			body: JSON.stringify({
				model: this.model,
				messages: [{ role: 'user', content: prompt }],
			}),
		});

		if (!response.ok) {
			return fallback;
		}

		const data = (await response.json()) as any;
		const content = data.choices?.[0]?.message?.content as string | undefined;
		if (!content) {
			return fallback;
		}

		try {
			return JSON.parse(content);
		} catch (_e) {
			return fallback;
		}
	}

	async generateDraft(input: {
		documentType: string;
		answers: Record<string, string>;
		organizationName?: string;
	}) {
		const apiKey = this.getApiKey();
		const prompt = `Buatkan surat ${input.documentType} formal berbahasa Indonesia berdasarkan data berikut: ${JSON.stringify(input.answers)}. Nama organisasi: ${input.organizationName ?? '-'}.`;
		if (!apiKey) {
			return `Surat ${input.documentType}\n\n${Object.entries(input.answers)
				.map(([key, value]) => `${key}: ${value}`)
				.join('\n')}\n\nHormat saya,\nPemohon`;
		}

		const response = await fetch(`${this.baseUrl}/chat/completions`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${apiKey}`,
			},
			body: JSON.stringify({
				model: this.model,
				messages: [{ role: 'user', content: prompt }],
			}),
		});

		if (!response.ok) {
			throw new Error('Failed to generate document draft from OpenAI');
		}

		const data = (await response.json()) as any;
		return data.choices?.[0]?.message?.content || '';
	}
}
