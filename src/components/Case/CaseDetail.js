import { useState, useEffect, Component } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '../../hooks/useAuth';
import { addReaction } from '../../firebase/firestore';
import { Award, ChevronDown, ChevronUp } from 'lucide-react';
import CommentSection from './CommentSection';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import sanitizeHtml from 'sanitize-html';
import styles from '../../styles/caseDetail.module.css';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Box,
  Button,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

// Error Boundary Component
class ErrorBoundary extends Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);
    // Optionally log to an error reporting service
    trackEvent('client_error', 'ErrorBoundary', error.message, 1);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className={styles.error}>
          <Typography>Something went wrong. Please try refreshing the page.</Typography>
        </div>
      );
    }
    return this.props.children;
  }
}

// Google Analytics tracking functions
const trackEvent = (action, category, label, value) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  } else {
    console.warn('gtag not available for tracking:', { action, category, label, value });
  }
};

const trackPageView = (caseId, title) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', 'G-GLWW8HX76X', {
      page_title: `Case: ${title}`,
      page_location: window.location.href,
      custom_map: { case_id: caseId },
    });
    trackEvent('view_case', 'Case', caseId, 1);
  }
};

// Utility function to sanitize and render HTML content
const renderRichText = (html) => {
  if (!html || typeof html !== 'string') {
    return <Typography className={styles.notSpecified}>Not specified</Typography>;
  }
  try {
    const sanitizedHtml = sanitizeHtml(html, {
      allowedTags: ['p', 'br', 'strong', 'em', 'u', 'ul', 'ol', 'li', 'a', 'h1', 'h2'],
      allowedAttributes: { a: ['href', 'target'] },
    });
    return <div className={styles.richText} dangerouslySetInnerHTML={{ __html: sanitizedHtml }} />;
  } catch (err) {
    console.error('Error sanitizing HTML:', err);
    return <Typography className={styles.errorText}>Error rendering content</Typography>;
  }
};

// Utility to safely access data
const getSafeValue = (value, fallback = 'Not specified') => value || fallback;

export default function CaseDetail({ caseData, isLoading }) {
  const { user } = useAuth();
  const router = useRouter();
  const [error, setError] = useState('');
  const [expanded, setExpanded] = useState({});
  const [scrollProgress, setScrollProgress] = useState(0);
  const [allExpanded, setAllExpanded] = useState(false);

  // Sections for TOC and collapsible content
  const sections = [
    { id: 'chiefConcern', label: 'Chief Concern', content: getSafeValue(caseData?.presentingComplaint) },
    { id: 'specialties', label: 'Specialties', content: getSafeValue(Array.isArray(caseData?.specialty) && caseData.specialty.length > 0 ? caseData.specialty.join(', ') : null) },
    { id: 'history', label: 'History', content: getSafeValue(caseData?.history) },
    { id: 'investigations', label: 'Investigations', content: getSafeValue(caseData?.investigations) },
    { id: 'management', label: 'Management', content: getSafeValue(caseData?.management) },
    { id: 'provisionalDiagnosis', label: 'Provisional Diagnosis', content: getSafeValue(caseData?.provisionalDiagnosis) },
    { id: 'hospital', label: 'Hospital', content: getSafeValue(caseData?.hospital) },
    { id: 'referralCenter', label: 'Referral Center', content: getSafeValue(caseData?.referralCenter) },
    { id: 'discussion', label: 'Discussion', content: getSafeValue(caseData?.discussion) },
    { id: 'highLevelSummary', label: 'High-Level Summary', content: getSafeValue(caseData?.highLevelSummary) },
    { id: 'references', label: 'References', content: getSafeValue(caseData?.references) },
  ];

  // Track page view and initialize expanded state (all collapsed by default)
  useEffect(() => {
    if (!caseData || !caseData.id || !caseData.title) {
      console.warn('Invalid caseData in useEffect:', caseData);
      return;
    }
    try {
      trackPageView(caseData.id, caseData.title || 'Untitled Case');
      // All sections collapsed by default
      setExpanded({});
      setAllExpanded(false);
    } catch (err) {
      console.error('Error in page view tracking:', err);
      setError('Failed to load case details.');
    }
  }, [caseData]);

  // Scroll progress
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = totalHeight > 0 ? (window.scrollY / totalHeight) * 100 : 0;
      setScrollProgress(progress);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle expand/collapse all
  const handleExpandCollapseAll = () => {
    try {
      const newState = !allExpanded;
      const newExpanded = {};
      
      if (newState) {
        sections.forEach(section => {
          newExpanded[section.id] = true;
        });
        trackEvent('expand_all_sections', 'Case Section', caseData?.id || 'unknown', 1);
      } else {
        // Collapse all
        trackEvent('collapse_all_sections', 'Case Section', caseData?.id || 'unknown', 1);
      }
      
      setExpanded(newExpanded);
      setAllExpanded(newState);
    } catch (err) {
      console.error('Error in handleExpandCollapseAll:', err);
      setError('Failed to toggle sections.');
    }
  };

  // Handle accordion toggle
  const handleAccordionChange = (sectionId) => (event, isExpanded) => {
    try {
      setExpanded((prev) => ({ ...prev, [sectionId]: isExpanded }));
      
      // Update allExpanded state based on current state
      const newExpanded = { ...expanded, [sectionId]: isExpanded };
      const expandedCount = Object.values(newExpanded).filter(Boolean).length;
      setAllExpanded(expandedCount === sections.length);
      
      if (isExpanded) {
        trackEvent('expand_section', 'Case Section', `${caseData?.id || 'unknown'}_${sectionId}`, 1);
        setTimeout(() => {
          document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
      }
    } catch (err) {
      console.error('Error in handleAccordionChange:', err);
      setError('Failed to toggle section.');
    }
  };

  // Handle vote
  const handleVote = async (type) => {
    if (!user) {
      setError('You must be logged in to vote.');
      return;
    }
    try {
      await addReaction(caseData.id, user.uid, type);
      setError('');
      trackEvent('vote', 'Case Interaction', `${type}_${caseData.id}`, 1);
    } catch (err) {
      console.error('Error in handleVote:', err);
      setError('Failed to record vote. Please try again.');
      trackEvent('vote_error', 'Case Interaction', `${type}_${caseData.id}`, 1);
    }
  };

  const handleEditClick = () => {
    try {
      router.push(`/cases/edit/${caseData.id}`);
      trackEvent('edit_case', 'Case Management', caseData.id, 1);
    } catch (err) {
      console.error('Error in handleEditClick:', err);
      setError('Failed to navigate to edit page.');
    }
  };

  const handleAuthorClick = (userId) => {
    trackEvent('view_author', 'Profile', userId, 1);
  };

  const handleMediaView = (mediaIndex) => {
    trackEvent('view_media', 'Case Media', `${caseData?.id || 'unknown'}_media_${mediaIndex}`, 1);
  };

  // Handle TOC click
  const handleTocClick = (sectionId) => {
    try {
      trackEvent('toc_click', 'Navigation', sectionId, 1);
      document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setExpanded((prev) => ({ ...prev, [sectionId]: true }));
    } catch (err) {
      console.error('Error in handleTocClick:', err);
      setError('Failed to navigate to section.');
    }
  };

  if (isLoading) {
    return (
      <div className={styles.container}>
        <Skeleton height={40} width="80%" />
        <Skeleton height={24} count={10} />
      </div>
    );
  }

  if (!caseData || !caseData.id) {
    console.warn('Invalid caseData:', caseData);
    return (
      <div className={styles.container}>
        <div className={styles.error}>
          <Typography>Error: Invalid case data</Typography>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className={styles.container}>
        {/* Progress Bar */}
        <div className={styles.progressBar} style={{ width: `${scrollProgress}%` }} />

        {/* Table of Contents */}
        <Box className={styles.toc}>
          <Typography variant="h6" className={styles.tocTitle}>
            Table of Contents
          </Typography>
          <ul className={styles.tocList}>
            {sections.map((section) => (
              <li key={section.id}>
                <a
                  href={`#${section.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    handleTocClick(section.id);
                  }}
                  className={styles.tocLink}
                >
                  {section.label}
                </a>
              </li>
            ))}
          </ul>
        </Box>

        <article className={styles.caseDetail}>
          <header className={styles.header}>
            <Typography variant="h1" className={styles.title}>
              {renderRichText(getSafeValue(caseData.title))}
            </Typography>
            {user && user.uid === caseData.userId && (
              <button
                onClick={handleEditClick}
                className={styles.editButton}
                aria-label="Edit case"
              >
                Edit Case
              </button>
            )}
            <div className={styles.meta}>
              <div className={styles.author}>
                <Link href={`/profile/view/${caseData.userId || 'unknown'}`} onClick={() => handleAuthorClick(caseData.userId || 'unknown')}>
                  <Image
                    src={caseData.photoURL || '/images/doctor-placeholder.jpg'}
                    alt={`Profile picture of ${caseData.userName || 'Contributor'}`}
                    width={40}
                    height={40}
                    className={styles.avatar}
                    onError={(e) => console.error('Author image error:', caseData.photoURL)}
                  />
                </Link>
                <Link href={`/profile/view/${caseData.userId || 'unknown'}`} onClick={() => handleAuthorClick(caseData.userId || 'unknown')}>
                  <span className={styles.authorName}>{caseData.userName || 'Anonymous'}</span>
                </Link>
              </div>
              <time className={styles.date}>
                {caseData.createdAt
                  ? new Date(caseData.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })
                  : 'Unknown date'}
              </time>
            </div>
          </header>

          <div className={styles.voteSection}>
            <button
              onClick={() => handleVote('award')}
              className={styles.voteButton}
              disabled={!user}
              aria-label="Award case"
            >
              <Award size={20} />
              <span className={styles.voteCount}>{caseData.awards || 0}</span>
            </button>
            {error && <Typography className={styles.error}>{error}</Typography>}
          </div>

          {/* Expand/Collapse All Button */}
          <div className={styles.controlsSection}>
            <Button
              onClick={handleExpandCollapseAll}
              className={styles.expandCollapseButton}
              startIcon={allExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              variant="outlined"
              size="small"
            >
              {allExpanded ? 'Collapse All' : 'Expand All'}
            </Button>
          </div>

          <section className={styles.content}>
            {sections.map((section) => (
              <Accordion
                key={section.id}
                expanded={expanded[section.id] || false}
                onChange={handleAccordionChange(section.id)}
                className={styles.accordion}
                elevation={0}
                id={section.id}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls={`${section.id}-content`}
                  id={`${section.id}-header`}
                  className={styles.accordionSummary}
                >
                  <Typography className={styles.sectionTitle}>
                    {section.label}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails className={styles.accordionDetails}>
                  {renderRichText(section.content)}
                </AccordionDetails>
              </Accordion>
            ))}
          </section>

          <section className={styles.media}>
            <Typography variant="h2" className={styles.mediaSectionTitle}>
              Media
            </Typography>
            {Array.isArray(caseData.mediaUrls) && caseData.mediaUrls.length > 0 ? (
              <div className={styles.mediaGrid}>
                {caseData.mediaUrls.map((url, index) => (
                  url ? (
                    <Image
                      key={url}
                      src={url}
                      alt={`Case media ${index + 1}: ${caseData.title || 'Medical image'}`}
                      width={600}
                      height={400}
                      className={styles.mediaImage}
                      objectFit="contain"
                      loading="lazy"
                      onClick={() => handleMediaView(index)}
                      style={{ cursor: 'pointer' }}
                      onError={(e) => console.error('Media image error:', url)}
                    />
                  ) : (
                    <div key={index} className={styles.mediaImage}>
                      <Image
                        src="/images/default-placeholder.jpg"
                        alt="No media available"
                        width={600}
                        height={400}
                        objectFit="contain"
                        loading="lazy"
                      />
                    </div>
                  )
                ))}
              </div>
            ) : (
              <Typography>No media available.</Typography>
            )}
          </section>

          <CommentSection caseId={caseData.id} />
        </article>
      </div>
    </ErrorBoundary>
  );
}