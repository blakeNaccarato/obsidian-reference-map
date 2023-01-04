import { SemanticPaper } from "src/types";
import React, { useState } from "react";
import { copyElToClipboard, removeNullReferences } from "src/utils";
import { IoMdClipboard } from "react-icons/io";
import { SiOpenaccess } from "react-icons/si";
import { FiPaperclip, FiSlash } from "react-icons/fi";
import { ReferencesList } from "./ReferencesList";
import { PaperTitleGroup } from "./PaperTitleGroup";
import { CitationsList } from "./CitationsList";

export const RootReference = (props: {
	key: string;
	rootPaper: SemanticPaper;
	references: SemanticPaper[];
	citations: SemanticPaper[];
}) => {
	const [showReferences, setShowReferences] = useState(false);
	const [showCitations, setShowCitations] = useState(false);

	const handleShowReferencesClick = () => {
		setShowReferences(!showReferences);
		setShowCitations(false);
	};

	const handleShowCitationsClick = () => {
		setShowCitations(!showCitations);
		setShowReferences(false);
	};

	const references = removeNullReferences(props.references);
	const citations = removeNullReferences(props.citations);

	const rootPaper: SemanticPaper = props.rootPaper;

	const paperTitle = rootPaper.title ? rootPaper.title : "Unknown Title";
	const firstAuthor = rootPaper.authors[0]?.name
		? rootPaper.authors[0].name
		: "Unknown Author";
	const year = rootPaper.year ? rootPaper.year : "Unknown Year";
	const abstract = rootPaper.abstract
		? rootPaper.abstract
		: "No abstract available";
	const bibTex = rootPaper.citationStyles.bibtex
		? rootPaper.citationStyles.bibtex
		: "No BibTex available";
	let openAccessPdfUrl = "";
	if (rootPaper.isOpenAccess) {
		openAccessPdfUrl = rootPaper.openAccessPdf.url
			? rootPaper.openAccessPdf.url
			: "";
	}
	return (
		<div className="orm-root-paper">
			<PaperTitleGroup paper={rootPaper} />
			<div className="orm-paper-buttons">
				<div
					className="orm-copy-bibtex"
					onClick={() => {
						copyElToClipboard(bibTex);
					}}
				>
					<IoMdClipboard size={17} />
				</div>

				<div
					className="orm-copy-metadata"
					onClick={() => {
						copyElToClipboard(
							`${paperTitle}, ${firstAuthor}, ${year}\n${abstract}`
						);
					}}
				>
					<FiPaperclip size={16} />
				</div>

				<div className="orm-openaccess">
					{rootPaper.isOpenAccess ? (
						<a href={`${openAccessPdfUrl}`}>
							<SiOpenaccess size={16} />
						</a>
					) : (
						<FiSlash size={16} />
					)}
				</div>
				<div
					className={`orm-references`}
					onClick={() => handleShowReferencesClick()}
				>
					{rootPaper.referenceCount.toString()}
				</div>
				<div
					className="orm-citations"
					onClick={() => handleShowCitationsClick()}
				>
					{rootPaper.citationCount.toString()}
				</div>
				{/* <div className="orm-influential-citations">
					{rootPaper.influentialCitationCount.toString()}
				</div> */}
			</div>
			{showReferences && <ReferencesList references={references} />}
			{showCitations && <CitationsList citations={citations} />}
		</div>
	);
};
