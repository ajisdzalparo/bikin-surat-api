export interface GenerateQuestionsInput {
	document_type: string;
	template?: string;
}

export interface GenerateDocumentInput {
	document_type: string;
	organization_id?: string;
	answers: Record<string, string>;
}
