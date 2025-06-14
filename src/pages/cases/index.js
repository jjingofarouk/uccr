import { useState, useMemo, useEffect } from 'react';
import { useCases } from '../../hooks/useCases';
import CaseCard from '../../components/Case/CaseCard';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, X } from 'lucide-react';
import { GoogleAnalytics } from '@next/third-parties/google';
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

  // Custom sendGAEvent wrapper to check for window
  const sendGAEvent = typeof window !== 'undefined' ? require('@next/third-parties/google').sendGAEvent : () => {};

  // Track page view and time spent on page
  useEffect(() => {
    if (typeof window === 'undefined') return;

    sendGAEvent('event', 'page_view', {
      page_title: 'Cases List',
      page_location: window.location.href,
      content_group: 'Cases',
      case_count: cases.length,
      page_type: 'cases_page'
    });

    const startTime = Date.now();
    return () => {
      const timeSpent = Math.round((Date.now() - startTime) / 1000);
      sendGAEvent('event', 'time_on_page', {
        event_category: 'engagement',
        event_label: 'cases_page',
        value: timeSpent,
        time_spent: timeSpent
      });
    };
  }, [cases.length]);

  // Track search/filter usage
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const activeFilters = Object.entries(filters).filter(([_, value]) => value !== '').length;
    if (activeFilters > 0) {
      sendGAEvent('event', 'search', {
        search_term: JSON.stringify(filters),
        event_category: 'cases',
        event_label: 'filter_applied',
        value: activeFilters,
        filter_count: activeFilters,
        filter_type: 'cases_filter'
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

    if (typeof window !== 'undefined') {
      sendGAEvent('event', 'view_search_results', {
        search_term: JSON.stringify(filters),
        event_category: 'cases',
        event_label: 'filter_results',
        value: filtered.length,
        result_count: filtered.length,
        total_cases: cases.length
      });
    }

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

    if (typeof window !== 'undefined') {
      sendGAEvent('event', 'sort', {
        event_category: 'cases',
        event_label: sortBy,
        sort_type: sortBy,
        case_count: sorted.length
      });
    }

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

    if (typeof window !== 'undefined') {
      sendGAEvent('event', 'filter_change', {
        event_category: 'cases',
        event_label: name,
        filter_name: name,
        filter_value: value || 'cleared',
        value: value ? 1 : 0
      });
    }
  };

  const handleSortChange = (e) => {
    const newSortBy = e.target.value;
    setSortBy(newSortBy);
    setCurrentPage(1);

    if (typeof window !== 'undefined') {
      sendGAEvent('event', 'sort_change', {
        event_category: 'cases',
        event_label: newSortBy,
        sort_type: newSortBy,
        action: 'sort_changed'
      });
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      sendGAEvent('event', 'page_change', {
        event_category: 'navigation',
        event_label: 'pagination',
        value: page,
        page_number: page,
        total_pages: totalPages
      });
    }
  };

  const handleExportCSV = () => {
    if (typeof window === 'undefined') return;

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

    sendGAEvent('event', 'file_download', {
      file_name: 'uccr_cases_export.csv',
      file_extension: 'csv',
      event_category: 'engagement',
      event_label: 'csv_export',
      value: sortedCases.length,
      export_count: sortedCases.length,
      action: 'cases_export'
    });
  };

  const handlePreviewCase = (caseData) => {
    setPreviewCase(caseData);

    if (typeof window !== 'undefined') {
      sendGAEvent('event', 'select_content', {
        content_type: 'case',
        item_id: caseData.id,
        content_id: caseData.id,
        event_category: 'cases',
        event_label: 'case_preview',
        specialty: caseData.specialty?.[0] || 'unknown',
        awards: caseData.awards || 0
      });
    }
  };

  const closePreview = () => {
    if (previewCase && typeof window !== 'undefined') {
      sendGAEvent('event', 'close_preview', {
        event_category: 'cases',
        event_label: 'preview_closed',
        content_id: previewCase.id,
        case_id: previewCase.id,
        action: 'modal_closed'
      });
    }
    setPreviewCase(null);
  };

  const handleViewFullCase = (caseData) => {
    if (typeof window !== 'undefined') {
      sendGAEvent('event', 'select_content', {
        content_type: 'case',
        item_id: caseData.id,
        content_id: caseData.id,
        event_category: 'cases',
        event_label: 'view_full_case',
        specialty: caseData.specialty?.[0] || 'unknown',
        action: 'full_view'
      });
    }
  };

  // Track errors
  useEffect(() => {
    if (error && typeof window !== 'undefined') {
      sendGAEvent('event', 'exception', {
        description: error,
        fatal: false,
        event_category: 'error',
        event_label: 'cases_loading_error',
        error_message: error,
        page: 'cases_page'
      });
    }
  }, [error]);

  // Track loading states
  useEffect(() => {
    if (typeof window === 'undefined') return;

    if (loading) {
      sendGAEvent('event', 'begin_checkout', {
        event_category: 'performance',
        event_label: 'cases_loading_start',
        action: 'loading_started',
        context: 'cases'
      });
    } else if (cases.length > 0) {
      sendGAEvent('event', 'purchase', {
        event_category: 'performance',
        event_label: 'cases_loading_complete',
        value: cases.length,
        action: 'loading_completed',
        case_count: cases.length
      });
    }
  }, [loading, cases.length]);

  if (loading) {
    return (
      <SkeletonTheme baseColor="#e0e0e0" highlightColor="#f0f0f0">
        <div className={styles.container}>
          <Skeleton height={40} width={200} />
          <div className={styles.filterSortContainer}>
            <div className={styles.filters}>
              {[...Array(6)].map((_, index) => (
                <Skeleton key={index} height={40} width={150} />
              ))}
            </div>
            <div className={styles.sortExport}>
              <Skeleton height={40} width={150} />
              <Skeleton height={40} width={100} />
            </div>
          </div>
          <div className={styles['case-list']}>
            {[...Array(casesPerPage)].map((_, index) => (
              <Skeleton key={index} height={200} />
            ))}
          </div>
        </div>
      </SkeletonTheme>
    );
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
            onFocus={() => typeof window !== 'undefined' && sendGAEvent('event', 'focus', {
              event_category: 'form',
              event_label: 'specialty_filter',
              filter: 'specialty',
              action: 'filter_focused'
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
            onFocus={() => typeof window !== 'undefined' && sendGAEvent('event', 'focus', {
              event_category: 'form',
              event_label: 'author_search',
              filter: 'author',
              action: 'search_focused'
            })}
          />
          <select
            name="hospital"
            value={filters.hospital}
            onChange={handleFilterChange}
            className={styles.filterSelect}
            aria-label="Filter by hospital"
            onFocus={() => typeof window !== 'undefined' && sendGAEvent('event', 'focus', {
              event_category: 'form',
              event_label: 'hospital_filter',
              filter: 'hospital',
              action: 'filter_focused'
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
            onFocus={() => typeof window !== 'undefined' && sendGAEvent('event', 'focus', {
              event_category: 'form',
              event_label: 'referral_center_filter',
              filter: 'referralCenter',
              action: 'filter_focused'
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
            onFocus={() => typeof window !== 'undefined' && sendGAEvent('event', 'focus', {
              event_category: 'form',
              event_label: 'date_range_filter',
              filter: 'dateRange',
              action: 'filter_focused'
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
            onFocus={() => typeof window !== 'undefined' && sendGAEvent('event', 'focus', {
              event_category: 'form',
              event_label: 'awards_filter',
              filter: 'awardsMin',
              action: 'filter_focused'
            })}
          />
        </div>
        <div className={styles.sortExport}>
          <select
            value={sortBy}
            onChange={handleSortChange}
            className={styles.sortSelect}
            aria-label="Sort cases"
            onFocus={() => typeof window !== 'undefined' && sendGAEvent('event', 'focus', {
              event_category: 'form',
              event_label: 'sort_dropdown',
              element: 'sort',
              action: 'sort_focused'
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
            onMouseEnter={() => typeof window !== 'undefined' && sendGAEvent('event', 'hover', {
              event_category: 'button',
              event_label: 'export_csv_hover',
              element: 'export',
              action: 'button_hovered'
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
            No cases match your filters.{' '}
            <Link
              href="/cases/new"
              onClick={() => typeof window !== 'undefined' && sendGAEvent('event', 'click', {
                event_category: 'navigation',
                event_label: 'create_new_case',
                context: 'empty_state',
                action: 'new_case_link'
              })}
            >
              Share a case!
            </Link>
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
                onMouseEnter={() => typeof window !== 'undefined' && sendGAEvent('event', 'hover', {
                  event_category: 'cases',
                  event_label: 'case_card_hover',
                  content_id: caseData.id,
                  specialty: caseData.specialty?.[0] || 'unknown',
                  action: 'card_hovered'
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
                onMouseEnter={() => typeof window !== 'undefined' && sendGAEvent('event', 'hover', {
                  event_category: 'navigation',
                  event_label: 'pagination_previous_hover',
                  element: 'pagination',
                  action: 'previous_button'
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
                  onMouseEnter={() => typeof window !== 'undefined' && sendGAEvent('event', 'hover', {
                    event_category: 'navigation',
                    event_label: 'pagination_number_hover',
                    value: page + 1,
                    element: 'pagination',
                    page: page + 1
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
                onMouseEnter={() => typeof window !== 'undefined' && sendGAEvent('event', 'hover', {
                  event_category: 'navigation',
                  event_label: 'pagination_next_hover',
                  element: 'pagination',
                  action: 'next_button'
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
            onAnimationComplete={() => typeof window !== 'undefined' && sendGAEvent('event', 'view_item', {
              event_category: 'cases',
              event_label: 'preview_modal_opened',
              content_id: previewCase.id,
              specialty: previewCase.specialty?.[0] || 'unknown',
              action: 'modal_animation_complete'
            })}
          >
            <div className={styles.previewContent}>
              <button
                onClick={closePreview}
                className={styles.closeButton}
                aria-label="Close preview"
                onMouseEnter={() => typeof window !== 'undefined' && sendGAEvent('event', 'hover', {
                  event_category: 'modal',
                  event_label: 'close_button_hover',
                  context: 'preview_modal',
                  action: 'close_button'
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
                onMouseEnter={() => typeof window !== 'undefined' && sendGAEvent('event', 'hover', {
                  event_category: 'cases',
                  event_label: 'view_full_case_hover',
                  content_id: previewCase.id,
                  element: 'full_case_link',
                  action: 'link_hovered'
                })}
              >
                View Full Case
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />
    </div>
  );
}