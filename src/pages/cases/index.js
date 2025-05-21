import { useState, useMemo, useEffect } from 'react';
import { useCases } from '../../hooks/useCases';
import CaseCard from '../../components/Case/CaseCard';
import Loading from '../../components/Loading';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, X } from 'lucide-react';
import styles from './case.module.css';

export default function Cases() {
  const { cases, loading } = useCases();
  const [filters, setFilters] = useState({
    specialty: '',
    author: '',
    hospital: '',
    referralCenter: '',
    dateRange: '',
    awardsMin: '',
  });
  const [sortBy, setSortBy] = useState('createdAt-desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [previewCase, setPreviewCase] = useState(null);
  const casesPerPage = 12;

  const specialties = [...new Set(cases.map((caseData) => caseData.specialty).filter(Boolean))];
  const hospitals = [...new Set(cases.map((caseData) => caseData.hospital).filter(Boolean))];
  const referralCenters = [...new Set(cases.map((caseData) => caseData.referralCenter).filter(Boolean))];

  const filteredCases = useMemo(() => {
    return cases.filter((caseData) => {
      const matchesSpecialty = filters.specialty ? caseData.specialty === filters.specialty : true;
      const matchesAuthor = filters.author
        ? caseData.userName.toLowerCase().includes(filters.author.toLowerCase())
        : true;
      const matchesHospital = filters.hospital ? caseData.hospital === filters.hospital : true;
      const matchesReferralCenter = filters.referralCenter
        ? caseData.referralCenter === filters.referralCenter
        : true;
      const matchesDate = filters.dateRange
        ? (() => {
            const now = new Date();
            const caseDate = new Date(caseData.createdAt);
            if (filters.dateRange === 'last7days') {
              return caseDate >= new Date(now.setDate(now.getDate() - 7));
            }
            if (filters.dateRange === 'last30days') {
              return caseDate >= new Date(now.setDate(now.getDate() - 30));
            }
            if (filters.dateRange === 'lastYear') {
              return caseDate >= new Date(now.setFullYear(now.getFullYear() - 1));
            }
            return true;
          })()
        : true;
      const matchesAwards = filters.awardsMin
        ? (caseData.awards || 0) >= parseInt(filters.awardsMin)
        : true;
      return matchesSpecialty && matchesAuthor && matchesHospital && matchesReferralCenter && matchesDate && matchesAwards;
    });
  }, [cases, filters]);

  const sortedCases = useMemo(() => {
    return [...filteredCases].sort((a, b) => {
      if (sortBy === 'createdAt-desc') {
        return new Date(b.createdAt) - new Date(a.createdAt);
      }
      if (sortBy === 'createdAt-asc') {
        return new Date(a.createdAt) - new Date(b.createdAt);
      }
      if (sortBy === 'awards-desc') {
        return (b.awards || 0) - (a.awards || 0);
      }
      if (sortBy === 'awards-asc') {
        return (a.awards || 0) - (b.awards || 0);
      }
      if (sortBy === 'title-asc') {
        return a.title.localeCompare(b.title);
      }
      if (sortBy === 'title-desc') {
        return b.title.localeCompare(a.title);
      }
      return 0;
    });
  }, [filteredCases, sortBy]);

  const paginatedCases = useMemo(() => {
    const start = (currentPage - 1) * casesPerPage;
    return sortedCases.slice(start, start + casesPerPage);
  }, [sortedCases, currentPage]);

  const totalPages = Math.ceil(sortedCases.length / casesPerPage);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
    setCurrentPage(1);
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleExportCSV = () => {
    const headers = [
      'Title',
      'Specialty',
      'Author',
      'Hospital',
      'Referral Center',
      'Awards',
      'Created At',
      'Presenting Complaint',
      'Provisional Diagnosis',
    ];
    const rows = sortedCases.map((caseData) => [
      `"${caseData.title || ''}"`,
      caseData.specialty || '',
      caseData.userName || 'Anonymous',
      caseData.hospital || '',
      caseData.referralCenter || '',
      caseData.awards || 0,
      new Date(caseData.createdAt).toISOString(),
      `"${caseData.presentingComplaint || ''}"`,
      `"${caseData.provisionalDiagnosis || ''}"`,
    ]);
    const csvContent = [
      headers.join(','),
      ...rows.map((row) => row.join(',')),
    ].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'uccr_cases_export.csv';
    link.click();
  };

  const handlePreviewCase = (caseData) => {
    setPreviewCase(caseData);
  };

  const closePreview = () => {
    setPreviewCase(null);
  };

  if (loading) {
    return <Loading />;
  }

  return (
      <div className={styles.container}>
        <h1 className={styles.title}>All Cases</h1>
        <div className={styles.filterSortContainer}>
          <div className={styles.filters}>
            <select
              name="specialty"
              value={filters.specialty}
              onChange={handleFilterChange}
              className={styles.filterSelect}
              aria-label="Filter by specialty"
            >
              <option value="">All Specialties</option>
              {specialties.map((specialty) => (
                <option key={specialty} value={specialty}>
                  {specialty}
                </option>
              ))}
            </select>
            <input
              type="text"
              name="author"
              placeholder="Search by author..."
              value={filters.author}
              onChange={handleFilterChange}
              className={styles.filterInput}
              aria-label="Filter by author"
            />
            <select
              name="hospital"
              value={filters.hospital}
              onChange={handleFilterChange}
              className={styles.filterSelect}
              aria-label="Filter by hospital"
            >
              <option value="">All Hospitals</option>
              {hospitals.map((hospital) => (
                <option key={hospital} value={hospital}>
                  {hospital}
                </option>
              ))}
            </select>
            <select
              name="referralCenter"
              value={filters.referralCenter}
              onChange={handleFilterChange}
              className={styles.filterSelect}
              aria-label="Filter by referral center"
            >
              <option value="">All Referral Centers</option>
              {referralCenters.map((center) => (
                <option key={center} value={center}>
                  {center}
                </option>
              ))}
            </select>
            <select
              name="dateRange"
              value={filters.dateRange}
              onChange={handleFilterChange}
              className={styles.filterSelect}
              aria-label="Filter by date range"
            >
              <option value="">All Dates</option>
              <option value="last7days">Last 7 Days</option>
              <option value="last30days">Last 30 Days</option>
              <option value="lastYear">Last Year</option>
            </select>
            <input
              type="number"
              name="awardsMin"
              placeholder="Min Awards"
              value={filters.awardsMin}
              onChange={handleFilterChange}
              className={styles.filterInput}
              min="0"
              aria-label="Filter by minimum awards"
            />
          </div>
          <div className={styles.sortExport}>
            <select
              value={sortBy}
              onChange={handleSortChange}
              className={styles.sortSelect}
              aria-label="Sort cases"
            >
              <option value="createdAt-desc">Newest First</option>
              <option value="createdAt-asc">Oldest First</option>
              <option value="awards-desc">Most Awards</option>
              <option value="awards-asc">Least Awards</option>
              <option value="title-asc">Title A-Z</option>
              <option value="title-desc">Title Z-A</option>
            </select>
            <button
              onClick={handleExportCSV}
              className={styles.exportButton}
              disabled={sortedCases.length === 0}
              aria-label="Export cases as CSV"
            >
              <Download size={20} />
              Export CSV
            </button>
          </div>
        </div>
        {sortedCases.length === 0 ? (
          <div className={styles.emptyState}>
            <p>
              No cases match your filters. <Link href="/cases/new">Share a case!</Link>
            </p>
          </div>
        ) : (
          <>
            <div className={styles['case-list']}>
              {paginatedCases.map((caseData) => (
                <div
                  key={caseData.id}
                  className={styles.caseCardWrapper}
                  onClick={() => handlePreviewCase(caseData)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === 'Enter' && handlePreviewCase(caseData)}
                  aria-label={`Preview case: ${caseData.title || 'Untitled'}`}
                >
                  <CaseCard caseData={caseData} />
                </div>
              ))}
            </div>
            {totalPages > 1 && (
              <div className={styles.pagination}>
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={styles.pageButton}
                  aria-label="Previous page"
                >
                  Previous
                </button>
                {[...Array(totalPages).keys()].map((page) => (
                  <button
                    key={page + 1}
                    onClick={() => handlePageChange(page + 1)}
                    className={`${styles.pageButton} ${currentPage === page + 1 ? styles.activePage : ''}`}
                    aria-label={`Page ${page + 1}`}
                    aria-current={currentPage === page + 1 ? 'page' : undefined}
                  >
                    {page + 1}
                  </button>
                ))}
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={styles.pageButton}
                  aria-label="Next page"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
        <AnimatePresence>
          {previewCase && (
            <motion.div
              className={styles.previewModal}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.3 }}
            >
              <div className={styles.previewContent}>
                <button
                  onClick={closePreview}
                  className={styles.closeButton}
                  aria-label="Close preview"
                >
                  <X size={24} />
                </button>
                <h2>{previewCase.title || 'Untitled Case'}</h2>
                <p><strong>Specialty:</strong> {previewCase.specialty || 'N/A'}</p>
                <p><strong>Author:</strong> {previewCase.userName || 'Anonymous'}</p>
                <p><strong>Hospital:</strong> {previewCase.hospital || 'N/A'}</p>
                <p><strong>Presenting Complaint:</strong> {previewCase.presentingComplaint || 'N/A'}</p>
                <p><strong>Provisional Diagnosis:</strong> {previewCase.provisionalDiagnosis || 'N/A'}</p>
                <p><strong>Awards:</strong> {previewCase.awards || 0}</p>
                <p><strong>Created:</strong> {new Date(previewCase.createdAt).toLocaleDateString()}</p>
                <Link
                  href={`/cases/${previewCase.id}`}
                  className={styles.viewFullCase}
                  onClick={closePreview}
                >
                  View Full Case
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

  );
}