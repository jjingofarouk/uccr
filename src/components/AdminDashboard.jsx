import { useState, useEffect, useMemo, useRef } from 'react';
import { getCases, updateCase, deleteCase } from '../firebase/firestore';
import { searchCasesAndUsers } from '../firebase/search';
import styles from '../styles/adminDashboard.module.css';
import { Pencil, Trash2, Download, X, Upload } from 'lucide-react';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import CaseCard from './Case/CaseCard';
import EditCaseForm from './Case/EditCaseForm';

function ErrorMessage({ error }) {
  if (!error) return null;
  return (
    <div className={styles.errorMessage}>
      <p style={{ color: 'red', margin: '10px 0', fontWeight: 'bold' }}>{error}</p>
    </div>
  );
}

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [cases, setCases] = useState([]);
  const [editingCaseId, setEditingCaseId] = useState(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
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
  const [searchTerm, setSearchTerm] = useState('');
  const casesPerPage = 10;
  const ADMIN_PASSWORD = 'SecureAdmin2025';

  const specialties = [...new Set(cases.flatMap((caseData) => caseData.specialty).filter(Boolean))];
  const hospitals = [...new Set(cases.map((caseData) => caseData.hospital).filter(Boolean))];
  const referralCenters = [...new Set(cases.map((caseData) => caseData.referralCenter).filter(Boolean))];

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      setAuthError('');
    } else {
      setAuthError('Incorrect password');
      setPassword('');
    }
  };

  useEffect(() => {
    const fetchCases = async () => {
      if (!isAuthenticated) return;
      try {
        setIsLoading(true);
        const allCases = await getCases();
        setCases(allCases);
        setIsLoading(false);
      } catch (err) {
        setError('Failed to fetch cases: ' + err.message);
        setIsLoading(false);
      }
    };
    fetchCases();
  }, [isAuthenticated]);

  const handleEdit = (caseItem) => {
    setEditingCaseId(caseItem.id);
  };

  
  
  
  
  
  
  const handleCloseEdit = () => {
    setEditingCaseId(null);
  };

  const handleAdminSuccess = async (updatedCaseData) => {
    setEditingCaseId(null);
    try {
      setIsLoading(true);
      const allCases = await getCases();
      setCases(allCases);
    } catch (err) {
      setError('Failed to refresh cases.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (caseId) => {
    if (!confirm('Are you sure you want to delete this case?')) return;
    try {
      setIsLoading(true);
      await deleteCase(caseId);
      setCases(cases.filter(c => c.id !== caseId));
      setError('');
      setIsLoading(false);
    } catch (err) {
      setError('Failed to delete case: ' + err.message);
      setIsLoading(false);
    }
  };

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

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchTerm) {
      setFilters((prev) => ({ ...prev, author: '' }));
      const allCases = await getCases();
      setCases(allCases);
      return;
    }
    try {
      const results = await searchCasesAndUsers(searchTerm);
      setCases(results.cases);
      setFilters((prev) => ({ ...prev, author: searchTerm }));
    } catch (err) {
      setError('Failed to search cases: ' + err.message);
    }
  };

  const handleExportCSV = () => {
    const headers = [
      'Title', 'Specialties', 'Author', 'Hospital', 'Referral Center', 'Awards', 'Created At',
      'Presenting Complaint', 'Provisional Diagnosis'
    ];
    const rows = filteredCases.map((caseData) => [
      `"${caseData.title || ''}"`,
      `"${Array.isArray(caseData.specialty) ? caseData.specialty.join(', ') : caseData.specialty || ''}"`,
      caseData.userName || 'Anonymous',
      caseData.hospital || '',
      caseData.referralCenter || '',
      caseData.awards || 0,
      new Date(caseData.createdAt).toISOString(),
      `"${caseData.presentingComplaint || ''}"`,
      `"${caseData.provisionalDiagnosis || ''}"`
    ]);
    const csvContent = [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'admin_cases_export.csv';
    link.click();
  };

  const filteredCases = useMemo(() => {
    return cases.filter((caseData) => {
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

  if (!isAuthenticated) {
    return (
      <div className={styles.container}>
        <h1 className={styles.title}>Admin Login</h1>
        <ErrorMessage error={authError} />
        <form onSubmit={handleLogin} className={styles.loginForm}>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter admin password"
            className={styles.input}
          />
          <button type="submit" className={styles.saveButton}>
            Login
          </button>
        </form>
      </div>
    );
  }

  if (isLoading) {
    return (
      <SkeletonTheme baseColor="#e0e0e0" highlightColor="#f5f5f5">
        <div className={styles.container}>
          <h1 className={styles.title}>Admin Dashboard - Manage Cases</h1>
          <ErrorMessage error={error} />
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
          <div className={styles.casesList}>
            {[...Array(casesPerPage)].map((_, index) => (
              <CaseCard key={index} isLoading={true} />
            ))}
          </div>
        </div>
      </SkeletonTheme>
    );
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Admin Dashboard - Manage Cases</h1>
      <ErrorMessage error={error} />
      <div className={styles.filterSortContainer}>
        <div className={styles.filters}>
          <form onSubmit={handleSearch} className={styles.searchForm}>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search cases..."
              className={styles.filterInput}
              aria-label="Search cases"
            />
            <button type="submit" className={styles.saveButton}>Search</button>
          </form>
          <select
            name="specialty"
            value={filters.specialty}
            onChange={handleFilterChange}
            className={styles.filterSelect}
            aria-label="Filter by specialty"
          >
            <option value="">All Specialties</option>
            {specialties.map((specialty) => (
              <option key={specialty} value={specialty}>{specialty}</option>
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
              <option key={hospital} value={hospital}>{hospital}</option>
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
              <option key={center} value={center}>{center}</option>
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
            <option value="awards-desc">Most Awarded</option>
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
            <Download size={20} /> Export CSV
          </button>
        </div>
      </div>
      <div className={styles.casesList}>
        {sortedCases.length === 0 && <p className={styles.noCases}>No cases found.</p>}
        {paginatedCases.map(caseItem => (
          <div key={caseItem.id} className={styles.caseItem}>
            <CaseCard caseData={caseItem} isLoading={false} />
            <div className={styles.buttonGroup}>
              <button
                onClick={() => handleEdit(caseItem)}
                className={styles.editButton}
              >
                <Pencil size={20} /> Edit
              </button>
              <button
                onClick={() => handleDelete(caseItem.id)}
                className={styles.deleteButton}
              >
                <Trash2 size={20} /> Delete
              </button>
            </div>
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
      {editingCaseId && (
        <div className={styles.editModal}>
          <div className={styles.editModalContent}>
            <button
              onClick={handleCloseEdit}
              className={styles.closeButton}
              aria-label="Close edit form"
            >
              <X size={24} />
            </button>
            <div className={styles.caseFormWrapper}>
              <EditCaseForm 
                caseId={editingCaseId} 
                isAdmin={true} 
                onAdminSuccess={handleAdminSuccess} 
                onAdminCancel={handleCloseEdit} 
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}