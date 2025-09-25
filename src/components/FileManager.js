import React, { useState, useEffect } from "react";
import { DatabaseService } from "../utils/database";
import "./FileManager.css";

const FileManager = ({ onDataUpdate }) => {
	const [savedFiles, setSavedFiles] = useState([]);
	const [loading, setLoading] = useState(true);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [currentPage, setCurrentPage] = useState(1);
	const filesPerPage = 5;

	useEffect(() => {
		loadSavedFiles();
	}, []);

	const loadSavedFiles = async () => {
		try {
			const files = await DatabaseService.getSavedFiles();
			setSavedFiles(files);
		} catch (error) {
			console.error("Error loading saved files:", error);
		} finally {
			setLoading(false);
		}
	};

	const handleDeleteFile = async (id) => {
		if (!window.confirm("Are you sure you want to delete this file?"))
			return;

		try {
			await DatabaseService.deleteFile(id);
			setSavedFiles((files) => files.filter((f) => f.id !== id));
			onDataUpdate();
		} catch (error) {
			console.error("Error deleting file:", error);
		}
	};

	// Pagination logic
	const indexOfLastFile = currentPage * filesPerPage;
	const indexOfFirstFile = indexOfLastFile - filesPerPage;
	const currentFiles = savedFiles.slice(indexOfFirstFile, indexOfLastFile);
	const totalPages = Math.ceil(savedFiles.length / filesPerPage);

	if (loading) return <div>Loading saved files...</div>;

	return (
		<>
			{/* Compact view */}
			<div className="file-manager-compact">
				<button
					className="file-manager-toggle"
					onClick={() => setIsModalOpen(true)}
				>
					📁 Saved Files ({savedFiles.length}) - Click to manage
				</button>
			</div>

			{/* Modal */}
			{isModalOpen && (
				<div
					className="file-manager-modal-overlay"
					onClick={() => setIsModalOpen(false)}
				>
					<div
						className="file-manager-modal"
						onClick={(e) => e.stopPropagation()}
					>
						<div className="modal-header">
							<h3>📁 Saved Files ({savedFiles.length})</h3>
							<button
								className="close-btn"
								onClick={() => setIsModalOpen(false)}
							>
								✕
							</button>
						</div>

						<div className="modal-content">
							{savedFiles.length === 0 ? (
								<p>
									No files saved yet. Upload some data to get
									started!
								</p>
							) : (
								<>
									<div className="files-table">
										<table>
											<thead>
												<tr>
													<th>Filename</th>
													<th>Type</th>
													<th>Records</th>
													<th>Date</th>
													<th>Action</th>
												</tr>
											</thead>
											<tbody>
												{currentFiles.map((file) => (
													<tr key={file.id}>
														<td className="filename">
															{file.filename}
														</td>
														<td>
															<span
																className={`file-type ${file.data_type}`}
															>
																{file.data_type}
															</span>
														</td>
														<td>
															{file.record_count}
														</td>
														<td>
															{new Date(
																file.created_at
															).toLocaleDateString()}
														</td>
														<td>
															<button
																onClick={() =>
																	handleDeleteFile(
																		file.id
																	)
																}
																className="delete-btn"
															>
																🗑️
															</button>
														</td>
													</tr>
												))}
											</tbody>
										</table>
									</div>

									{/* Pagination */}
									{totalPages > 1 && (
										<div className="pagination">
											<button
												onClick={() =>
													setCurrentPage((prev) =>
														Math.max(prev - 1, 1)
													)
												}
												disabled={currentPage === 1}
											>
												← Previous
											</button>
											<span>
												Page {currentPage} of{" "}
												{totalPages}
											</span>
											<button
												onClick={() =>
													setCurrentPage((prev) =>
														Math.min(
															prev + 1,
															totalPages
														)
													)
												}
												disabled={
													currentPage === totalPages
												}
											>
												Next →
											</button>
										</div>
									)}
								</>
							)}
						</div>
					</div>
				</div>
			)}
		</>
	);
};

export default FileManager;
