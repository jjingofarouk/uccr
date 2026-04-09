import { useState, useEffect, useCallback } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, X, FileText, ChevronRight, Clock, Award,
  SlidersHorizontal, Sparkles, Building2, MapPin,
  Stethoscope, Activity
} from 'lucide-react';
import { searchCases, getSearchRecommendations } from '../lib/supabase/search';
import { sanitizeTitle } from '../lib/utils/sanitize';
import styles from '../styles/search.module.css';

export default function SearchPage() {
  const router = useRouter();
  const { q } = router.query;

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState({ cases: [] });
  const [recommendations, setRecommendations] = useState([]);
  const [isSearchLoading, setIsSearchLoading] = useState(false);
  const [error, setError] = useState('');

  // Advanced Filters
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [isSortModalOpen, setIsSortModalOpen] = useState(false);
  const [selectedSpecialty, setSelectedSpecialty] = useState('All Specialties');
  const [selectedCaseType, setSelectedCaseType] = useState('All Types');
  const [sortBy, setSortBy] = useState('Newest');

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const resultsPerPage = 10;

  const fetchRecommendations = useCallback(async () => {
    const recs = await getSearchRecommendations();
    setRecommendations(recs);
  }, []);

  useEffect(() => {
    fetchRecommendations();
  }, [fetchRecommendations]);

  const performSearch = useCallback(async (term, spec, type, sort) => {
    if ((!term || term.trim().length < 2) && spec === 'All Specialties' && type === 'All Types') {
      setSearchResults({ cases: [] });
      return;
    }

    setIsSearchLoading(true);
    setError('');
    setCurrentPage(1); // Reset to first page on new search

    try {
      const results = await searchCases(term || '');
      let filteredCases = results.cases || [];

      // Specialty Filter
      if (spec && spec !== 'All Specialties') {
        filteredCases = filteredCases.filter(c =>
          c.specialties && Array.isArray(c.specialties)
            ? c.specialties.some(s => s.toLowerCase().includes(spec.toLowerCase()))
            : false
        );
      }

      // Case Type Filter
      if (type && type !== 'All Types') {
        const matchType = type === 'Clinical Case' ? 'clinical' : 'ecg';
        filteredCases = filteredCases.filter(c => c.caseType === matchType);
      }

      // Sort
      if (sort === 'Oldest') {
        filteredCases.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
      } else if (sort === 'A-Z') {
        filteredCases.sort((a, b) => a.title.localeCompare(b.title));
      } else if (sort === 'Z-A') {
        filteredCases.sort((a, b) => b.title.localeCompare(a.title));
      } else {
        // Default: Newest
        filteredCases.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      }

      setSearchResults({ cases: filteredCases });
      if (filteredCases.length === 0) {
        setError('No matching case reports found in the archive.');
      }
    } catch (err) {
      setError('An error occurred while fetching cases.');
      console.error(err);
    } finally {
      setIsSearchLoading(false);
    }
  }, []);

  // Derived data for pagination with safety guards
  const casesCount = searchResults?.cases?.length || 0;
  const totalPages = Math.ceil(casesCount / resultsPerPage);
  const currentCases = (searchResults?.cases || []).slice(
    (currentPage - 1) * resultsPerPage,
    currentPage * resultsPerPage
  );

  useEffect(() => {
    if (q) {
      setSearchQuery(q);
      performSearch(q, selectedSpecialty, selectedCaseType, sortBy);
    } else if (selectedSpecialty !== 'All Specialties' || selectedCaseType !== 'All Types') {
      performSearch('', selectedSpecialty, selectedCaseType, sortBy);
    }
  }, [q, selectedSpecialty, selectedCaseType, sortBy, performSearch]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim().length >= 2) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`, undefined, { shallow: true });
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults({ cases: [] });
    setError('');
    router.push('/search', undefined, { shallow: true });
  };

  const handleRecommendationClick = (term) => {
    setSearchQuery(term);
    router.push(`/search?q=${encodeURIComponent(term)}`, undefined, { shallow: true });
  };

  const getSpecialtyColor = (name) => {
    const colors = {
      'Cardiology': '#be123c',      // Rose-700
      'Surgery': '#334155',         // Slate-700
      'Internal Medicine': '#4338ca', // Indigo-700
      'Pediatrics': '#0f766e',      // Teal-700
      'Obstetrics': '#be185d',      // Pink-700
      'Gynecology': '#be185d',      // Pink-700
      'Emergency': '#c2410c',       // Orange-700
      'Radiology': '#b45309',       // Amber-700
      'Pathology': '#701a75',       // Fuchsia-900
      'Neurology': '#1d4ed8',       // Blue-700
      'Psychiatry': '#6d28d9',      // Violet-700
    };
    return colors[name] || '#0d9488'; // Default Medical Teal
  };

  const getSnippet = (blob, query) => {
    if (!blob || !query) return '';
    // Universal Sanitization
    const cleanBlob = sanitizeTitle(blob);
    const index = cleanBlob.toLowerCase().indexOf(query.toLowerCase());
    if (index === -1) return cleanBlob.slice(0, 180) + '...';

    // Increased window for 3 lines
    const start = Math.max(0, index - 90);
    const end = Math.min(cleanBlob.length, index + 160);
    let snippet = cleanBlob.slice(start, end);
    if (start > 0) snippet = '...' + snippet;
    if (end < cleanBlob.length) snippet = snippet + '...';
    return snippet;
  };

  const highlightText = (text, query) => {
    if (!query || !text) return text;
    // Escape special regex characters to prevent runtime crashes
    const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const parts = text.split(new RegExp(`(${escapedQuery})`, 'gi'));
    return parts.map((part, i) =>
      part.toLowerCase() === query.toLowerCase() ? (
        <mark key={i} className={styles.highlight}>{part}</mark>
      ) : part
    );
  };

  const formatDate = (dateString) => {
    const d = new Date(dateString);
    const day = d.getDate();
    const month = d.toLocaleDateString(undefined, { month: 'short' });
    const year = d.getFullYear();

    // Add ordinal suffix (st, nd, rd, th)
    const suffix = (day) => {
      if (day > 3 && day < 21) return 'th';
      switch (day % 10) {
        case 1: return "st";
        case 2: return "nd";
        case 3: return "rd";
        default: return "th";
      }
    };

    return `${day}${suffix(day)} ${month}, ${year}`;
  };

  return (
    <div className={styles.searchPage}>
      <Head>
        <title>Discovery Archive | UCCR</title>
      </Head>

      <div className={styles.searchHeader}>
        <div className={styles.container}>
          <div className={styles.searchHeaderGrid}>
            <div className={styles.searchBoxWrapper}>
              <form onSubmit={handleSearchSubmit} className={styles.searchForm}>
                <Search className={styles.searchIcon} size={20} />
                <input
                  type="text"
                  placeholder="Search clinical findings..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                  className={styles.searchInput}
                />
                {searchQuery && (
                  <button type="button" onClick={clearSearch} className={styles.clearButton}>
                    <X size={14} />
                  </button>
                )}
              </form>
            </div>

            <div className={styles.actionButtonGroup}>
              <button
                className={styles.consoleTrigger}
                onClick={() => setIsFilterModalOpen(true)}
              >
                <SlidersHorizontal size={18} />
                <span>Filters</span>
                {(selectedSpecialty !== 'All Specialties' || selectedCaseType !== 'All Types') && <span className={styles.filterDot} />}
              </button>

              <button
                className={styles.consoleTrigger}
                onClick={() => setIsSortModalOpen(true)}
              >
                <Activity size={18} />
                <span>Sort</span>
              </button>
            </div>
          </div>

          <div className={styles.activeFilters}>
            {selectedSpecialty !== 'All Specialties' && (
              <span className={styles.filterBadge}>
                {selectedSpecialty}
                <X size={12} onClick={() => setSelectedSpecialty('All Specialties')} />
              </span>
            )}
            {selectedCaseType !== 'All Types' && (
              <span className={styles.filterBadge}>
                {selectedCaseType}
                <X size={12} onClick={() => setSelectedCaseType('All Types')} />
              </span>
            )}
          </div>
        </div>
      </div>

      <main className={styles.resultsContainer}>
        <div className={styles.container}>
          <AnimatePresence mode="wait">
            {isSearchLoading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={styles.loadingState}
              >
                <div className={styles.spinner}></div>
                <p>Analyzing clinical archive...</p>
              </motion.div>
            ) : error ? (
              <motion.div
                key="error"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={styles.emptyState}
              >
                <Search size={40} className={styles.emptyIcon} />
                <h2>No archives found</h2>
                <p>Try broadening your search or exploring trending specialties instead.</p>

                <div className={styles.dynamicRecs}>
                  <div className={styles.pillGrid}>
                    {recommendations.map((term, i) => (
                      <button
                        key={i}
                        onClick={() => handleRecommendationClick(term)}
                        className={styles.recPill}
                        style={{ borderColor: getSpecialtyColor(term) }}
                      >
                        {term}
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            ) : searchResults.cases.length === 0 ? (
              <motion.div
                key="prompt"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={styles.emptyState}
              >
                <div className={styles.minimalHero}>

                  {recommendations.length > 0 && (
                    <div className={styles.dynamicRecs}>
                      <div className={styles.recHeader}>
                        <Sparkles size={16} className={styles.sparkleIcon} />
                        <span>Trending Research Areas</span>
                      </div>
                      <div className={styles.pillGrid}>
                        {recommendations.map((term, i) => (
                          <button
                            key={i}
                            onClick={() => handleRecommendationClick(term)}
                            className={styles.recPill}
                            style={{ borderColor: getSpecialtyColor(term) }}
                          >
                            {term}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            ) : (
              <motion.div
                key={`${searchQuery}-${selectedSpecialty}-${selectedCaseType}-${sortBy}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={styles.resultsGrid}
              >
                <div className={styles.resultSection}>
                  <div className={styles.sectionHeader}>
                    <Activity size={18} />
                    <h2>Records identified ({searchResults.cases.length})</h2>
                  </div>
                  <div className={styles.grid}>
                    {currentCases.map((report) => (
                      <Link 
                        key={report.id} 
                        href={`/cases/${report.id}${searchQuery ? `?h=${encodeURIComponent(searchQuery)}` : ''}`} 
                        className={styles.reportCard}
                      >
                        <div className={styles.reportMain}>
                          <div className={styles.reportTitleRow}>
                            <h3>{highlightText(sanitizeTitle(report.title), searchQuery)}</h3>
                          </div>

                          <div className={styles.excerptWrapper}>
                            <p className={styles.excerpt}>
                              {highlightText(getSnippet(report.searchBlob, searchQuery), searchQuery)}
                            </p>
                          </div>

                          <div className={styles.badgeRow}>
                            {report.specialties.map((spec, idx) => (
                              <span
                                key={idx}
                                className={styles.specialtyPill}
                                style={{ backgroundColor: getSpecialtyColor(spec) }}
                              >
                                {spec}
                              </span>
                            ))}
                          </div>

                          <div className={styles.reportMetadataGrid}>
                            <div className={styles.metaItem}>
                              <Clock size={14} />
                              <span>{formatDate(report.createdAt)}</span>
                            </div>
                          </div>
                        </div>
                        <ChevronRight className={styles.cardArrow} size={20} />
                      </Link>
                    ))}
                  </div>

                  {/* Pagination Footer */}
                  {totalPages > 1 && (
                    <div className={styles.paginationRow}>
                      <button
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage(p => p - 1)}
                        className={styles.pageBtn}
                      >
                        Previous
                      </button>

                      <div className={styles.pageNumbers}>
                        {Array.from({ length: totalPages }).map((_, i) => (
                          <button
                            key={i}
                            onClick={() => setCurrentPage(i + 1)}
                            className={currentPage === i + 1 ? styles.activePage : styles.pageNumber}
                          >
                            {i + 1}
                          </button>
                        ))}
                      </div>

                      <button
                        disabled={currentPage === totalPages}
                        onClick={() => setCurrentPage(p => p + 1)}
                        className={styles.pageBtn}
                      >
                        Next
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Ultra Clean Filter Modal */}
      <AnimatePresence>
        {isFilterModalOpen && (
          <div className={styles.modalOverlay} onClick={() => setIsFilterModalOpen(false)}>
            <motion.div
              className={styles.filterModal}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 30 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className={styles.modalHeader}>
                <h2>Search Filters</h2>
                <button onClick={() => setIsFilterModalOpen(false)}><X size={20} /></button>
              </div>

              <div className={styles.modalBody}>
                <div className={styles.filterSection}>
                  <label>Clinical Specialty</label>
                  <select
                    value={selectedSpecialty}
                    onChange={(e) => setSelectedSpecialty(e.target.value)}
                    className={styles.filterSelect}
                  >
                    <option>All Specialties</option>
                    <option>Cardiology</option>
                    <option>Internal Medicine</option>
                    <option>Surgery</option>
                    <option>Pediatrics</option>
                    <option>Obstetrics & Gynecology</option>
                    <option>Emergency Medicine</option>
                  </select>
                </div>

                <div className={styles.filterSection}>
                  <label>Case Classification</label>
                  <div className={styles.typeGrid}>
                    {['All Types', 'Clinical Case', 'ECG Report'].map(type => (
                      <button
                        key={type}
                        className={selectedCaseType === type ? styles.activeType : styles.typeButton}
                        onClick={() => setSelectedCaseType(type)}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                <div className={styles.filterSection}>
                  <label>Ordering</label>
                  <div className={styles.sortOptions}>
                    <button
                      className={sortBy === 'Newest' ? styles.activeSort : styles.sortBtn}
                      onClick={() => setSortBy('Newest')}
                    >
                      Newest
                    </button>
                    <button
                      className={sortBy === 'Oldest' ? styles.activeSort : styles.sortBtn}
                      onClick={() => setSortBy('Oldest')}
                    >
                      Oldest
                    </button>
                    <button
                      className={sortBy === 'A-Z' ? styles.activeSort : styles.sortBtn}
                      onClick={() => setSortBy('A-Z')}
                    >
                      Title A-Z
                    </button>
                    <button
                      className={sortBy === 'Z-A' ? styles.activeSort : styles.sortBtn}
                      onClick={() => setSortBy('Z-A')}
                    >
                      Title Z-A
                    </button>
                  </div>
                </div>
              </div>

              <div className={styles.modalFooter}>
                <button
                  className={styles.applyButton}
                  onClick={() => setIsFilterModalOpen(false)}
                >
                  Apply Clinical Filters
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      {/* Sort Modal */}
      <AnimatePresence>
        {isSortModalOpen && (
          <div className={styles.modalOverlay} onClick={() => setIsSortModalOpen(false)}>
            <motion.div
              className={styles.filterModal}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 30 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className={styles.modalHeader}>
                <h2>Archival Ordering</h2>
                <button onClick={() => setIsSortModalOpen(false)}><X size={20} /></button>
              </div>

              <div className={styles.modalBody}>
                <div className={styles.filterSection}>
                  <label>Select Priority</label>
                  <div className={styles.sortOptionsGrid}>
                    {[
                      { id: 'Newest', label: 'Recently Published' },
                      { id: 'Oldest', label: 'Archival Order' },
                      { id: 'A-Z', label: 'Alphabetical (A-Z)' },
                      { id: 'Z-A', label: 'Reverse Alphabetical (Z-A)' }
                    ].map(opt => (
                      <button
                        key={opt.id}
                        className={sortBy === opt.id ? styles.activeSort : styles.sortBtn}
                        onClick={() => {
                          setSortBy(opt.id);
                          setIsSortModalOpen(false);
                        }}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
