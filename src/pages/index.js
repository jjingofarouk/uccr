import { useState, useMemo } from 'react';
import { useCases } from '../hooks/useCases';

import CaseCard from '../components/Case/CaseCard';
import Loading from '../components/Loading';
import Link from 'next/link';
import styles from './case.module.css';

export default function Cases() {
  const { cases, loading } = useCases();
  const [filters, setFilters] = useState({
    specialty: '',
    author: '',
    hospital: '',
    referralCenter: '',
    dateRange: '',
  });
  const [sortBy, setSortBy] = useState('createdAt-desc');

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
      return matchesSpecialty && matchesAuthor && matchesHospital && matchesReferralCenter && matchesDate;
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
      return 0;
    });
  }, [filteredCases, sortBy]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
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
            />
            <select
              name="hospital"
              value={filters.hospital}
              onChange={handleFilterChange}
              className={styles.filterSelect}
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
            >
              <option value="">All Dates</option>
              <option value="last7days">Last 7 Days</option>
              <option value="last30days">Last 30 Days</option>
              <option value="lastYear">Last Year</option>
            </select>
          </div>
          <div className={styles.sort}>
            <select value={sortBy} onChange={handleSortChange} className={styles.sortSelect}>
              <option value="createdAt-desc">Newest First</option>
              <option value="createdAt-asc">Oldest First</option>
              <option value="awards-desc">Most Awards</option>
              <option value="awards-asc">Least Awards</option>
            </select>
          </div>
        </div>
        {sortedCases.length === 0 ? (
          <p>
            No cases match your filters. <Link href="/cases/new">Share a case!</Link>
          </p>
        ) : (
          <div className={styles['case-list']}>
            {sortedCases.map((caseData) => (
              <CaseCard key={caseData.id} caseData={caseData} />
            ))}
          </div>
        )}
      </div>
  );
}