import { requestUrl } from 'obsidian'
import { SEMANTIC_FIELDS, SEMANTICSCHOLAR_API_URL } from 'src/constants'
import { SemanticPaper } from 'src/types'

export const getIndexItem = async (
	paperId: string,
	debugMode = false
): Promise<SemanticPaper | null> => {
	const url = `${SEMANTICSCHOLAR_API_URL}/paper/${paperId}?fields=${SEMANTIC_FIELDS.join(
		','
	)}`
	const paperMetadata: SemanticPaper | null = await requestUrl(url).then(
		(response) => {
			if (response.status != 200) {
				if (debugMode) console.log(`Error ${response.status}`) //TODO: better error handling
				return null
			}
			return response.json as SemanticPaper
		}
	)
	return paperMetadata
}

export const getReferenceItems = async (
	paperId: string,
	debugMode = false
): Promise<SemanticPaper[]> => {
	const url = `${SEMANTICSCHOLAR_API_URL}/paper/${paperId}/references?fields=${SEMANTIC_FIELDS.join(
		','
	)}`
	const references: SemanticPaper[] = await requestUrl(url).then(
		(response) => {
			if (response.status != 200) {
				if (debugMode) console.log(`Error ${response.status}`) //TODO: better error handling
				return []
			}
			return response.json.data.map(
				(e: Record<string, unknown>) => e['citedPaper']
			)
		}
	)
	return references
}

export const getCitationItems = async (
	paperId: string,
	debugMode = false
): Promise<SemanticPaper[]> => {
	const url = `${SEMANTICSCHOLAR_API_URL}/paper/${paperId}/citations?fields=${SEMANTIC_FIELDS.join(
		','
	)}`
	const citations: SemanticPaper[] = await requestUrl(url).then(
		(response) => {
			if (response.status != 200) {
				if (debugMode) console.log(`Error ${response.status}`) //TODO: better error handling
				return []
			}
			return response.json.data.map(
				(e: Record<string, unknown>) => e['citingPaper']
			)
		}
	)
	return citations
}

export const getSearchItems = async (
	query: string,
	limit: number,
	debugMode = false
): Promise<SemanticPaper[]> => {
	let url = `${SEMANTICSCHOLAR_API_URL}/paper/search?query=${query}&fields=${SEMANTIC_FIELDS.join(
		','
	)}`
	if (limit != 0) url += `&offset=0&limit=${limit}`
	const search: SemanticPaper[] = await requestUrl(url).then((response) => {
		if (response.status != 200) {
			if (debugMode) console.log(`Error ${response.status}`) //TODO: better error handling
			return []
		}
		return response.json.data
	})
	return search
}

export const getPaperMetadata = async (
	paperId = '',
	refType = 'paper',
	query = '',
	offlimit = [0, null],
	unknownRef = false
): Promise<SemanticPaper[]> => {
	let fields: string
	let cite: string
	const offset = offlimit[0]
	const limit = offlimit[1]

	if (refType === 'references') {
		fields = `${paperId}/references?fields=${SEMANTIC_FIELDS.join(',')}`
		cite = 'citedPaper'
	} else if (refType === 'citations') {
		fields = `${paperId}/citations?fields=${SEMANTIC_FIELDS.join(',')}`
		cite = 'citingPaper'
	} else if (refType === 'search') {
		if (query === '') return []
		fields = `search?query=${query}&fields=${SEMANTIC_FIELDS.join(',')}`
	} else {
		fields = `${paperId}?fields=${SEMANTIC_FIELDS.join(',')}`
	}

	if (offset != 0) fields += `&offset=${offset}`
	if (limit != null) fields += `&limit=${limit}`
	if (unknownRef) fields += '&include_unknown_references=true'

	const url = `${SEMANTICSCHOLAR_API_URL}/paper/${fields}`
	const papermetadata: SemanticPaper[] = await requestUrl(url).then(
		(response) => {
			if (response.status != 200) {
				console.log(`Error ${response.status}`) //TODO: better error handling
				return []
			} else if (response.json.data) {
				if (refType === 'search') return response.json.data
				return response.json.data.map(
					(e: Record<string, unknown>) => e[cite]
				)
			} else {
				return [response.json]
			}
		}
	)
	return papermetadata
}

export const postPaperMetadata = async (
	paperIds: Set<string>
): Promise<SemanticPaper[]> => {
	const fields = `?fields=${SEMANTIC_FIELDS.join(',')}`
	// add json body to request
	const url = `${SEMANTICSCHOLAR_API_URL}/paper/batch${fields}`
	const papermetadata: SemanticPaper[] = await requestUrl({
		url: url,
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({ ids: Array.from(paperIds) }),
	}).then((response) => {
		if (response.status != 200) {
			// console.log(`Error ${response.status}`)
			//TODO: better error handling
			return []
		} else if (response.json.data) {
			return response.json.data
		} else {
			return response.json
		}
	})
	return papermetadata
}
