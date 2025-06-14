import { useState, useMemo, useEffect } from 'react';
import { useCases } from '../../hooks/useCases';
import CaseCard from '../../components/Case/CaseCard';
import Loading from '../../components/Loading';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, X } from 'lucide-react';
import { gtag } from 'ga-gtag';
import styles from './case.module.css';

export default function Cases() {
  const { cases, loading, error } = useCases();
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

  const specialties = [...new Set(cases.flatMap((caseData) => caseData.specialty).filter(Boolean))];
  const hospitals = [...new Set(cases.map((caseData) => caseData.hospital).filter(Boolean))];
  const referralCenters = [...new Set(cases.map((caseData) => caseData.referralCenter).filter(Boolean))];

  // Track page view on component mount
  useEffect(() => {
    gtag('event', 'page_view', {
      page_title: 'Cases List',
      page_location: window.location.href,
      content_group1: 'Cases',
      custom_parameter_1: cases.length,
      custom_parameter_2: 'cases_page'
    });

    // Track time spent on page
    const startTime = Date.now();
    return () => {
      const timeSpent = Math.round((Date.now() - startTime) / 1000);
      gtag('event', 'time_on_page', {
        event_category: 'engagement',
        event_label: 'cases_page',
        value: timeSpent,
        custom_parameter_1: timeSpent
      });
    };
  }, [cases.length]);

  // Track search/filter usage
  useEffect(() => {
    const activeFilters = Object.entries(filters).filter(([_, value]) => value !== '').length;
    if (activeFilters > 0) {
      gtag('event', 'search', {
        search_term: JSON.stringify(filters),
        event_category: 'cases',
        event_label: 'filter_applied',
        value: activeFilters,
        custom_parameter_1: activeFilters,
        custom_parameter_2: 'cases_filter'
      });
    }
  }, [filters]);

  const filteredCases = useMemo(() => {
    const filtered = cases.filter((caseData) => {
      const matchesSpecialty = filters.specialty
        ? Array.isArray(caseData.specialty) && caseData.specialty.includes(filters.specialty)
        : true;
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

    // Track filter results
    gtag('event', 'view_search_results', {
      search_term: JSON.stringify(filters),
      event_category: 'cases',
      event_label: 'filter_results',
      value: filtered.length,
      custom_parameter_1: filtered.length,
      custom_parameter_2: cases.length
    });

    return filtered;
  }, [cases, filters]);

  const sortedCases = useMemo(() => {
    const sorted = [...filteredCases].sort((a, b) => {
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

    // Track sorting usage
    gtag('event', 'sort', {
      event_category: 'cases',
      event_label: sortBy,
      custom_parameter_1: sortBy,
      custom_parameter_2: sorted.length
    });

    return sorted;
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

    // Track individual filter changes
    gtag('event', 'filter_change', {
      event_category: 'cases',
      event_label: name,
      custom_parameter_1: name,
      custom_parameter_2: value || 'cleared',
      value: value ? 1 : 0
    });
  };

  const handleSortChange = (e) => {
    const newSortBy = e.target.value;
    setSortBy(newSortBy);
    setCurrentPage(1);

    // Track sort changes
    gtag('event', 'sort_change', {
      event_category: 'cases',
      event_label: newSortBy,
      custom_parameter_1: newSortBy,
      custom_parameter_2: 'sort_changed'
    });
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Track pagination usage
    gtag('event', 'page_change', {
      event_category: 'navigation',
      event_label: 'pagination',
      value: page,
      custom_parameter_1: page,
      custom_parameter_2: totalPages
    });
  };

  const handleExportCSV = () => {
    const headers = [
      'Title',
      'Specialties',
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
      `"${Array.isArray(caseData.specialty) ? caseData.specialty.join(', ') : caseData.specialty || ''}"`,
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

    // Track CSV export
    gtag('event', 'file_download', {
      file_name: 'uccr_cases_export.csv',
      file_extension: 'csv',
      event_category: 'engagement',
      event_label: 'csv_export',
      value: sortedCases.length,
      custom_parameter_1: sortedCases.length,
      custom_parameter_2: 'cases_export'
    });
  };

  const handlePreviewCase = (caseData) => {
    setPreviewCase(caseData);

    // Track case preview
    gtag('event', 'select_content', {
      content_type: 'case',
      item_id: caseData.id,
      content_id: caseData.id,
      event_category: 'cases',
      event_label: 'case_preview',
      custom_parameter_1: caseData.specialty?.[0] || 'unknown',
      custom_parameter_2: caseData.awards || 0
    });
  };

  const closePreview = () => {
    // Track preview close
    if (previewCase) {
      gtag('event', 'close_preview', {
        event_category: 'cases',
        event_label: 'preview_closed',
        content_id: previewCase.id,
        custom_parameter_1: previewCase.id,
        custom_parameter_2: 'modal_closed'
      });
    }
    setPreviewCase(null);
  };

  const handleViewFullCase = (caseData) => {
    // Track full case view
    gtag('event', 'select_content', {
      content_type: 'case',
      item_id: caseData.id,
      content_id: caseData.id,
      event_category: 'cases',
      event_label: 'view_full_case',
      custom_parameter_1: caseData.specialty?.[0] || 'unknown',
      custom_parameter_2: 'full_view'
    });
  };

  // Track errors
  useEffect(() => {
    if (error) {
      gtag('event', 'exception', {
        description: error,
        fatal: false,
        event_category: 'error',
        event_label: 'cases_loading_error',
        custom_parameter_1: error,
        custom_parameter_2: 'cases_page'
      });
    }
  }, [error]);

  // Track loading states
  useEffect(() => {
    if (loading) {
      gtag('event', 'begin_checkout', {
        event_category: 'performance',
        event_label: 'cases_loading_start',
        custom_parameter_1: 'loading_started',
        custom_parameter_2: 'cases'
      });
    } else if (cases.length > 0) {
      gtag('event', 'purchase', {
        event_category: 'performance',
        event_label: 'cases_loading_complete',
        value: cases.length,
        custom_parameter_1: 'loading_completed',
        custom_parameter_2: cases.length
      });
    }
  }, [loading, cases.length]);

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return (
      <div className={styles.errorSection} role="alert">
        <p className={styles.errorText}>Error: {error}</p>
      </div>
    );
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
            onFocus={() => gtag('event', 'focus', {
              event_category: 'form',
              event_label: 'specialty_filter',
              custom_parameter_1: 'specialty',
              custom_parameter_2: 'filter_focused'
            })}
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
            onFocus={() => gtag('event', 'focus', {
              event_category: 'form',
              event_label: 'author_search',
              custom_parameter_1: 'author',
              custom_parameter_2: 'search_focused'
            })}
          />
          <select
            name="hospital"
            value={filters.hospital}
            onChange={handleFilterChange}
            className={styles.filterSelect}
            aria-label="Filter by hospital"
            onFocus={() => gtag('event', 'focus', {
              event_category: 'form',
              event_label: 'hospital_filter',
              custom_parameter_1: 'hospital',
              custom_parameter_2: 'filter_focused'
            })}
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
            onFocus={() => gtag('event', 'focus', {
              event_category: 'form',
              event_label: 'referral_center_filter',
              custom_parameter_1: 'referralCenter',
              custom_parameter_2: 'filter_focused'
            })}
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
            onFocus={() => gtag('event', 'focus', {
              event_category: 'form',
              event_label: 'date_range_filter',
              custom_parameter_1: 'dateRange',
              custom_parameter_2: 'filter_focused'
            })}
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
            onFocus={() => gtag('event', 'focus', {
              event_category: 'form',
              event_label: 'awards_filter',
              custom_parameter_1: 'awardsMin',
              custom_parameter_2: 'filter_focused'
            })}
          />
        </div>
        <div className={styles.sortExport}>
          <select
            value={sortBy}
            onChange={handleSortChange}
            className={styles.sortSelect}
            aria-label="Sort cases"
            onFocus={() => gtag('event', 'focus', {
              event_category: 'form',
              event_label: 'sort_dropdown',
              custom_parameter_1: 'sort',
              custom_parameter_2: 'sort_focused'
            })}
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
            onMouseEnter={() => gtag('event', 'hover', {
              event_category: 'button',
              event_label: 'export_csv_hover',
              custom_parameter_1: 'export',
              custom_parameter_2: 'button_hovered'
            })}
          >
            <Download size={20} />
            Export CSV
          </button>
        </div>
      </div>
      {sortedCases.length === 0 ? (
        <div className={styles.emptyState}>
          <p>
            No cases match your filters. <Link 
              href="/cases/new"
              onClick={() => gtag('event', 'click', {
                event_category: 'navigation',
                event_label: 'create_new_case',
                custom_parameter_1: 'empty_state',
                custom_parameter_2: 'new_case_link'
              })}
            >Share a case!</Link>
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
                onMouseEnter={() => gtag('event', 'hover', {
                  event_category: 'cases',
                  event_label: 'case_card_hover',
                  content_id: caseData.id,
                  custom_parameter_1: caseData.specialty?.[0] || 'unknown',
                  custom_parameter_2: 'card_hovered'
                })}
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
                onMouseEnter={() => gtag('event', 'hover', {
                  event_category: 'navigation',
                  event_label: 'pagination_previous_hover',
                  custom_parameter_1: 'pagination',
                  custom_parameter_2: 'previous_button'
                })}
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
                  onMouseEnter={() => gtag('event', 'hover', {
                    event_category: 'navigation',
                    event_label: 'pagination_number_hover',
                    value: page + 1,
                    custom_parameter_1: 'pagination',
                    custom_parameter_2: page + 1
                  })}
                >
                  {page + 1}
                </button>
              ))}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={styles.pageButton}
                aria-label="Next page"
                onMouseEnter={() => gtag('event', 'hover', {
                  event_category: 'navigation',
                  event_label: 'pagination_next_hover',
                  custom_parameter_1: 'pagination',
                  custom_parameter_2: 'next_button'
                })}
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
            onAnimationComplete={() => gtag('event', 'view_item', {
              event_category: 'cases',
              event_label: 'preview_modal_opened',
              content_id: previewCase.id,
              custom_parameter_1: previewCase.specialty?.[0] || 'unknown',
              custom_parameter_2: 'modal_animation_complete'
            })}
          >
            <div className={styles.previewContent}>
              <button
                onClick={closePreview}
                className={styles.closeButton}
                aria-label="Close preview"
                onMouseEnter={() => gtag('event', 'hover', {
                  event_category: 'modal',
                  event_label: 'close_button_hover',
                  custom_parameter_1: 'preview_modal',
                  custom_parameter_2: 'close_button'
                })}
              >
                <X size={24} />
              </button>
              <h2>{previewCase.title || 'Untitled Case'}</h2>
              <p><strong>Specialties:</strong> {Array.isArray(previewCase.specialty) ? previewCase.specialty.join(', ') : previewCase.specialty || 'N/A'}</p>
              <p><strong>Author:</strong> {previewCase.userName || 'Anonymous'}</p>
              <p><strong>Hospital:</strong> {previewCase.hospital || 'N/A'}</p>
              <p><strong>Presenting Complaint:</strong> {previewCase.presentingComplaint || 'N/A'}</p>
              <p><strong>Provisional Diagnosis:</strong> {previewCase.provisionalDiagnosis || 'N/A'}</p>
              <p><strong>Awards:</strong> {previewCase.awards || 0}</p>
              <p><strong>Created:</strong> {new Date(previewCase.createdAt).toLocaleDateString()}</p>
              <Link
                href={`/cases/${previewCase.id}`}
                className={styles.viewFullCase}
                onClick={() => {
                  handleViewFullCase(previewCase);
                  closePreview();
                }}
                onMouseEnter={() => gtag('event', 'hover', {
                  event_category: 'cases',
                  event_label: 'view_full_case_hover',
                  content_id: previewCase.id,
                  custom_parameter_1: 'full_case_link',
                  custom_parameter_2: 'link_hovered'
                })}
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