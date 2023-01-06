import React from "react";
import { FiPaperclip, FiSlash, FiClipboard } from "react-icons/fi";
import { SiOpenaccess } from "react-icons/si";
import { ReferenceMapSettings, SemanticPaper } from "src/types";
import { copyElToClipboard } from "src/utils";

type Props = {
	settings: ReferenceMapSettings;
	paper: SemanticPaper;
	setShowReferences?: React.Dispatch<React.SetStateAction<boolean>>;
	showReferences?: boolean;
	setShowCitations?: React.Dispatch<React.SetStateAction<boolean>>;
	showCitations?: boolean;
	setIsButtonShown?: React.Dispatch<React.SetStateAction<boolean>>;
	isButtonShown?: boolean;
};

export const PaperButtons = ({
	settings,
	paper,
	setShowReferences = undefined,
	showReferences = false,
	setShowCitations = undefined,
	showCitations = false,
	setIsButtonShown = undefined,
	isButtonShown = false,
}: Props) => {
	const paperTitle = paper.title ? paper.title : "Unknown Title";
	let authors = "Unknown Authors";
	if (paper.authors.length > 0)
		authors = paper.authors.map((author) => author.name).join(", ");
	const year = paper.year ? paper.year : "Unknown Year";
	const abstract = paper.abstract ? paper.abstract : "No abstract available";
	const bibTex = paper.citationStyles?.bibtex
		? paper.citationStyles.bibtex
		: "No BibTex available";
	const influentialCount = paper.influentialCitationCount
		? paper.influentialCitationCount.toString()
		: "0";
	let openAccessPdfUrl = "";
	if (paper.isOpenAccess) {
		openAccessPdfUrl = paper.openAccessPdf?.url
			? paper.openAccessPdf.url
			: "";
	}
	const paperURL = paper.url ? paper.url : "Unknown URL";
	const doi = paper.externalIds?.DOI ? paper.externalIds.DOI : "Unknown DOI";

	let copyToClipboard = "";
	if (settings.copyTitle) copyToClipboard += `${paperTitle}\n`;
	if (settings.copyAuthors) copyToClipboard += `${authors}\n`;
	if (settings.copyYear) copyToClipboard += `${year}\n`;
	if (settings.copyAbstract) copyToClipboard += `${abstract}\n`;
	if (settings.copyUrl) copyToClipboard += `${paperURL}\n`;
	if (settings.copyOpenAccessPdf) copyToClipboard += `${openAccessPdfUrl}\n`;
	if (settings.copyPaperDOI) copyToClipboard += `${doi}\n`;

	let citingCited = null;
	if (
		setShowReferences !== undefined &&
		setShowCitations !== undefined &&
		setIsButtonShown !== undefined
	) {
		const handleShowReferencesClick = () => {
			setShowReferences(!showReferences);
			setShowCitations(false);
			if (showReferences || showCitations) {
				setIsButtonShown(true);
			}
		};

		const handleShowCitationsClick = () => {
			setShowCitations(!showCitations);
			setShowReferences(false);
			if (showReferences || showCitations) {
				setIsButtonShown(true);
			}
		};
		citingCited = (
			<>
				<div
					className="orm-references"
					style={
						showReferences
							? {
									fontWeight: "bold",
									color: "var(--text-accent)",
									// eslint-disable-next-line no-mixed-spaces-and-tabs
							  }
							: {}
					}
					onClick={() => handleShowReferencesClick()}
				>
					{paper.referenceCount.toString()}
				</div>
				<div
					className="orm-citations"
					style={
						showCitations
							? {
									fontWeight: "bold",
									color: "var(--text-accent)",
									// eslint-disable-next-line no-mixed-spaces-and-tabs
							  }
							: {}
					}
					onClick={() => handleShowCitationsClick()}
				>
					{paper.citationCount.toString()}
				</div>
			</>
		);
	} else {
		citingCited = (
			<>
				<div className="orm-references-2">
					{paper.referenceCount.toString()}
				</div>
				<div className="orm-citations-2">
					{paper.citationCount.toString()}
				</div>
			</>
		);
	}
	return (
		<div className="orm-paper-buttons">
			<div
				className="orm-copy-bibtex"
				onClick={() => {
					copyElToClipboard(bibTex);
				}}
			>
				<FiClipboard size={16} />
			</div>
			<div
				className="orm-copy-metadata"
				onClick={() => {
					copyElToClipboard(copyToClipboard);
				}}
			>
				<FiPaperclip size={15} />
			</div>
			<div className="orm-openaccess">
				{paper.isOpenAccess ? (
					<a href={`${openAccessPdfUrl}`}>
						<SiOpenaccess size={15} />
					</a>
				) : (
					<FiSlash size={15} />
				)}
			</div>
			{citingCited}
			{settings.influentialCount && (
				<div className="orm-influential">{influentialCount}</div>
			)}
		</div>
	);
};
