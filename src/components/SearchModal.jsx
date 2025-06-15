// SearchModal.jsx
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X } from 'lucide-react';
import { searchCasesAndUsers } from '../firebase/firestore';
import styles from '../styles/navbar.module.css';

export default function SearchModal({ isOpen, toggleModal, handleNavigationClick }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState({ cases: [], users: [] });
  const [isSearchLoading, setIsSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState('');
  const searchModalRef = useRef(null);

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (searchQuery.trim().length < 2) {
        setSearchResults({ cases: [], users: [] });
        setSearchError('');
        setIsSearchLoading(false);
        return;
      }
      try {
        setIsSearchLoading(true);
        setSearchError('');
        const results = await searchCasesAndUsers(searchQuery);
        setSearchResults(results);
        if (results.cases.length === 0 && results.users.length === 0) {
          setSearchError('No results found. Try a different keyword.');
        }
      } catch (error) {
        setSearchError('Failed to fetch results. Please try again.');
        setSearchResults({ cases: [], users: [] });
      } finally {
        setIsSearchLoading(false);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const handleSearchResultClick = (type, id, title) => {
    handleNavigationClick(`${type}_${id}`);
    toggleModal();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className={styles.searchModal}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div ref={searchModalRef} className={styles.searchModalContent}>
            <button
              onClick={toggleModal}
              className={styles.closeSearchButton}
              aria-label="Close search"
            >
              <X size={24} />
            </button>
            <div className={styles.searchInputWrapper}>
              <Search size={20} className={styles.searchIcon} />
              <input
                type="text"
                placeholder="Search cases or users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={styles.searchInput}
                autoFocus
              />
            </div>
            <div className={styles.searchResults}>
              {isSearchLoading ? (
                <p className={styles.searchLoading}>Loading...</p>
              ) : searchQuery.trim().length < 2 ? (
                <p className={styles.noResults}>Enter at least 2 characters to search</p>
              ) : searchError ? (
                <div className={styles.noResults}>
                  {searchError}
                  <div style={{ marginTop: '1rem' }}>
                    <p>Suggestions:</p>
                    <ul>
                      <li>
                        <Link 
                          href="/cases" 
                          onClick={() => {
                            handleNavigationClick('browse_all_cases');
                            toggleModal();
                          }}
                        >
                          Browse all cases
                        </Link>
                      </li>
                      <li>
                        <Link 
                          href="/cases?specialty=Cardiology" 
                          onClick={() => {
                            handleNavigationClick('browse_cardiology');
                            toggleModal();
                          }}
                        >
                          Explore Cardiology cases
                        </Link>
                      </li>
                      <li>
                        <Link 
                          href="/cases?specialty=Pediatrics" 
                          onClick={() => {
                            handleNavigationClick('browse_pediatrics');
                            toggleModal();
                          }}
                        >
                          Explore Pediatrics cases
                        </Link>
                      </li>
                    </ul>
                  </div>
                </div>
              ) : (
                <>
                  {searchResults.cases.length > 0 && (
                    <div className={styles.searchSection}>
                      <h3>Cases</h3>
                      {searchResults.cases.map((caseData) => (
                        <Link
                          key={caseData.id}
                          href={`/cases/${caseData.id}`}
                          className={styles.searchResult}
                          onClick={() => handleSearchResultClick('case', caseData.id, caseData.title)}
                        >
                          <span>{caseData.title}</span>
                          <small>{caseData.specialty}</small>
                        </Link>
                      ))}
                    </div>
                  )}
                  {searchResults.users.length > 0 && (
                    <div className={styles.searchSection}>
                      <h3>Users</h3>
                      {searchResults.users.map((user) => (
                        <Link
                          key={user.uid}
                          href={`/profile/view/${user.uid}`}
                          className={styles.searchResult}
                          onClick={() => handleSearchResultClick('user', user.uid, user.displayName)}
                        >
                          <span>{user.displayName}</span>
                          <small>{user.specialty}</small>
                        </Link>
                      ))}
                    </div>
                  )}
                  {searchResults.cases.length === 0 && searchResults.users.length === 0 && (
                    <div className={styles.noResults}>
                      No results found for "{searchQuery}"
                      <div style={{ marginTop: '1rem' }}>
                        <p>Suggestions:</p>
                        <ul>
                          <li>
                            <Link 
                              href="/cases" 
                              onClick={() => {
                                handleNavigationClick('browse_all_cases_fallback');
                                toggleModal();
                              }}
                            >
                              Browse all cases
                            </Link>
                          </li>
                          <li>
                            <Link 
                              href="/cases?specialty=Cardiology" 
                              onClick={() => {
                                handleNavigationClick('browse_cardiology_fallback');
                                toggleModal();
                              }}
                            >
                              Explore Cardiology cases
                            </Link>
                          </li>
                          <li>
                            <Link 
                              href="/cases?specialty=Pediatrics" 
                              onClick={() => {
                                handleNavigationClick('browse_pediatrics_fallback');
                                toggleModal();
                              }}
                            >
                              Explore Pediatrics cases
                            </Link>
                          </li>
                        </ul>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}