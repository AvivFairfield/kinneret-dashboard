import React, { useState, useEffect } from "react";
import "./RAGSearch.css";

const RAGSearch = () => {
	const [query, setQuery] = useState("");
	const [results, setResults] = useState([]);
	const [loading, setLoading] = useState(false);
	const [articles, setArticles] = useState([]);

	// Mock articles database - in production, this would be fetched from a backend
	const mockArticles = [
		{
			id: 1,
			title: "Cyanobacteria Monitoring in Lake Kinneret 2024",
			content:
				"Recent studies show increased cyanobacteria levels during summer months. Microcystis flos-aquae concentrations peaked in July 2024...",
			url: "https://www.ocean.org.il/uploads/2024/cyanobacteria-monitoring-kinneret-2024.pdf",
			year: 2024,
			keywords: [
				"cyanobacteria",
				"microcystis",
				"water quality",
				"monitoring",
			],
		},
		{
			id: 2,
			title: "Water Quality Parameters Analysis 2023",
			content:
				"Comprehensive analysis of pH, temperature, and dissolved oxygen levels. Seasonal variations show correlation with algal blooms...",
			url: "https://www.ocean.org.il/uploads/2023/water-quality-parameters-analysis-2023.pdf",
			year: 2023,
			keywords: [
				"water quality",
				"pH",
				"temperature",
				"dissolved oxygen",
			],
		},
		{
			id: 3,
			title: "Climate Impact on Lake Ecosystem 2022",
			content:
				"Climate change effects on Lake Kinneret ecosystem. Rising temperatures affect nutrient cycling and species composition...",
			url: "https://www.ocean.org.il/uploads/2022/climate-impact-lake-ecosystem-2022.pdf",
			year: 2022,
			keywords: [
				"climate change",
				"ecosystem",
				"temperature",
				"nutrients",
			],
		},
		{
			id: 4,
			title: "Phytoplankton Dynamics in Lake Kinneret 2024",
			content:
				"Analysis of seasonal phytoplankton succession patterns and their relationship to environmental factors...",
			url: "https://www.ocean.org.il/uploads/2024/phytoplankton-dynamics-kinneret-2024.pdf",
			year: 2024,
			keywords: [
				"phytoplankton",
				"seasonal dynamics",
				"environmental factors",
				"succession",
			],
		},
		{
			id: 5,
			title: "Nutrient Loading and Eutrophication Assessment 2023",
			content:
				"Comprehensive study of nitrogen and phosphorus inputs and their impact on lake trophic status...",
			url: "https://www.ocean.org.il/uploads/2023/nutrient-loading-eutrophication-2023.pdf",
			year: 2023,
			keywords: [
				"nutrients",
				"eutrophication",
				"nitrogen",
				"phosphorus",
				"trophic status",
			],
		},
		{
			id: 6,
			title: "Fish Population Dynamics and Water Quality 2022",
			content:
				"Study of fish community structure changes in relation to water quality parameters and climate variability...",
			url: "https://www.ocean.org.il/uploads/2022/fish-population-water-quality-2022.pdf",
			year: 2022,
			keywords: [
				"fish population",
				"community structure",
				"water quality",
				"climate variability",
			],
		},
		{
			id: 7,
			title: "Thermal Stratification Patterns 2024",
			content:
				"Investigation of thermal stratification dynamics and their influence on oxygen distribution and mixing processes...",
			url: "https://www.ocean.org.il/uploads/2024/thermal-stratification-patterns-2024.pdf",
			year: 2024,
			keywords: [
				"thermal stratification",
				"oxygen distribution",
				"mixing",
				"temperature",
			],
		},
		{
			id: 8,
			title: "Sediment Quality and Contamination Study 2023",
			content:
				"Assessment of sediment contamination levels and their potential impact on benthic organisms and water quality...",
			url: "https://www.ocean.org.il/uploads/2023/sediment-quality-contamination-2023.pdf",
			year: 2023,
			keywords: [
				"sediment",
				"contamination",
				"benthic organisms",
				"pollution",
			],
		},
		{
			id: 9,
			title: "Zooplankton Community Structure Analysis 2022",
			content:
				"Detailed analysis of zooplankton species composition and abundance patterns throughout the annual cycle...",
			url: "https://www.ocean.org.il/uploads/2022/zooplankton-community-analysis-2022.pdf",
			year: 2022,
			keywords: [
				"zooplankton",
				"species composition",
				"abundance",
				"annual cycle",
			],
		},
		{
			id: 10,
			title: "Harmful Algal Bloom Prediction Model 2024",
			content:
				"Development of predictive models for harmful algal bloom occurrence using machine learning and environmental data...",
			url: "https://www.ocean.org.il/uploads/2024/algal-bloom-prediction-model-2024.pdf",
			year: 2024,
			keywords: [
				"harmful algal blooms",
				"prediction model",
				"machine learning",
				"environmental data",
			],
		},
	];

	useEffect(() => {
		setArticles(mockArticles);
	}, []);

	const searchArticles = async () => {
		if (!query.trim()) return;

		setLoading(true);

		// Simulate API delay
		await new Promise((resolve) => setTimeout(resolve, 1000));

		// Simple text search - in production, use vector similarity
		const searchResults = articles.filter(
			(article) =>
				article.title.toLowerCase().includes(query.toLowerCase()) ||
				article.content.toLowerCase().includes(query.toLowerCase()) ||
				article.keywords.some((keyword) =>
					keyword.toLowerCase().includes(query.toLowerCase())
				)
		);

		// Score and rank results
		const scoredResults = searchResults
			.map((article) => ({
				...article,
				score: calculateRelevanceScore(article, query),
			}))
			.sort((a, b) => b.score - a.score);

		setResults(scoredResults);
		setLoading(false);
	};

	const calculateRelevanceScore = (article, query) => {
		const queryLower = query.toLowerCase();
		let score = 0;

		// Title match (highest weight)
		if (article.title.toLowerCase().includes(queryLower)) score += 10;

		// Content match
		if (article.content.toLowerCase().includes(queryLower)) score += 5;

		// Keyword match
		article.keywords.forEach((keyword) => {
			if (keyword.toLowerCase().includes(queryLower)) score += 3;
		});

		// Recent articles get bonus
		if (article.year >= 2023) score += 2;

		return score;
	};

	const handleKeyPress = (e) => {
		if (e.key === "Enter") {
			searchArticles();
		}
	};

	return (
		<div className="rag-search">
			<h3>🔍 Research Articles Search</h3>
			<p>Search through scientific publications about Lake Kinneret</p>

			<div className="search-container">
				<input
					type="text"
					value={query}
					onChange={(e) => setQuery(e.target.value)}
					onKeyPress={handleKeyPress}
					placeholder="Search for articles about water quality, cyanobacteria, climate..."
					className="search-input"
				/>
				<button
					onClick={searchArticles}
					disabled={loading || !query.trim()}
					className="search-button"
				>
					{loading ? "⏳" : "🔍"}
				</button>
			</div>

			{loading && (
				<div className="loading-indicator">
					<div className="spinner"></div>
					<p>Searching articles...</p>
				</div>
			)}

			{results.length > 0 && (
				<div className="search-results">
					<h4>Found {results.length} relevant articles:</h4>
					{results.map((article) => (
						<div key={article.id} className="result-item">
							<div className="result-header">
								<h5>{article.title}</h5>
								<span className="result-year">
									{article.year}
								</span>
								<span className="result-score">
									Score: {article.score}
								</span>
							</div>
							<p className="result-content">{article.content}</p>
							<div className="result-keywords">
								{article.keywords.map((keyword) => (
									<span key={keyword} className="keyword-tag">
										{keyword}
									</span>
								))}
							</div>
							<a
								href={article.url}
								target="_blank"
								rel="noopener noreferrer"
								className="result-link"
							>
								📖 Read Full Article
							</a>
						</div>
					))}
				</div>
			)}

			{query && results.length === 0 && !loading && (
				<div className="no-results">
					<p>
						No articles found for "{query}". Try different keywords
						like:
					</p>
					<div className="suggested-queries">
						<button onClick={() => setQuery("cyanobacteria")}>
							cyanobacteria
						</button>
						<button onClick={() => setQuery("water quality")}>
							water quality
						</button>
						<button onClick={() => setQuery("temperature")}>
							temperature
						</button>
						<button onClick={() => setQuery("climate change")}>
							climate change
						</button>
						<button onClick={() => setQuery("phytoplankton")}>
							phytoplankton
						</button>
						<button onClick={() => setQuery("nutrients")}>
							nutrients
						</button>
					</div>
				</div>
			)}
		</div>
	);
};

export default RAGSearch;
