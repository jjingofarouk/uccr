"use client";

import { useState, useEffect } from "react";
import { TrendingUp } from "lucide-react";
import { Bar, BarChart, XAxis, YAxis, Cell, Tooltip } from "recharts";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { getCaseStatistics } from "../../firebase/firestore";
import { trackEngagement, trackEvent } from "../../utils/analytics";
import Link from "next/link";
import styles from "./StatsSection.module.css";

const StatsSection = () => {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStats = async () => {
      try {
        trackEngagement("load_start", "stats");
        const data = await getCaseStatistics();
        console.log("Fetched stats:", data); // Debug data
        const top5 = data.slice(0, 5).map((item, index) => ({
          ...item,
          fill: [
            "rgba(59, 130, 246, 0.6)", // Blue
            "rgba(239, 68, 68, 0.6)", // Red
            "rgba(34, 197, 94, 0.6)", // Green
            "rgba(249, 115, 22, 0.6)", // Orange
            "rgba(168, 85, 247, 0.6)", // Purple
          ][index % 5],
        }));
        setStats(top5);
        trackEngagement("load_success", "stats", `${data.length}_specialties`);
        top5.forEach((stat, index) => {
          trackEvent(
            "specialty_title",
            "stats",
            `${stat.specialty}_rank_${index + 1}`,
            stat.count
          );
        });
      } catch (err) {
        setError("Unable to load case statistics");
        trackEngagement("load_error", "stats", err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const handleBarClick = (data) => {
    if (data?.activePayload?.[0]?.payload) {
      const payload = data.activePayload[0].payload;
      trackEngagement(
        "click",
        "stats",
        `${payload.specialty}_${payload.count}_specialty`
      );
    }
  };

  const handleMouseEnter = (data) => {
    if (data?.activePayload?.[0]?.payload) {
      const payload = data.activePayload[0].payload;
      trackEngagement("hover", "stats", payload.specialty);
    }
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload?.length) {
      const { payload: data } = payload[0];
      return (
        <div className={styles.tooltip}>
          <p className={styles.tooltipText}>
            {`${data.specialty}: ${data.count} cases`}
          </p>
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <SkeletonTheme baseColor="#e0e0e0" highlightColor="#f0f0f0">
        <div className={styles.container}>
          <div className={styles.header}>
            <Skeleton height={24} width={150} />
            <Skeleton height={16} width={100} />
          </div>
          <div className={styles.content}>
            <Skeleton height={400} />
          </div>
        </div>
      </SkeletonTheme>
    );
  }

  if (error) {
    return (
      <div className={`${styles.container} ${styles.errorContainer}`}>
        <div className={styles.errorContent}>
          <p className={styles.errorText}>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <section aria-labelledby="stats-title" className={styles.statsSection}>
      {stats.length > 0 ? (
        <div className={styles.container}>
          <div className={styles.header}>
            <h2 id="stats-title" className={styles.title}>
              Case Statistics
            </h2>
            <p className={styles.description}>Top 5 Specialties by Case Count</p>
          </div>
          <div className={styles.content}>
            <div className={styles.chartContainer}>
              <BarChart
                accessibilityLayer
                data={stats}
                height={400}
                margin={{ top: 20, right: 30, left: 20, bottom: 120 }}
                barCategoryGap={10}
                onClick={handleBarClick}
                onMouseMove={handleMouseEnter}
              >
                <XAxis
                  dataKey="specialty"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={{ stroke: "var(--border, #e5e7eb)" }}
                  tick={{
                    fill: "var(--text, #1f2937)",
                    fontFamily: "Inter, sans-serif",
                    fontSize: 12,
                  }}
                  angle={-45}
                  textAnchor="end"
                  height={100}
                />
                <YAxis
                  dataKey="count"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={{ stroke: "var(--border, #e5e7eb)" }}
                  allowDecimals={false}
                  tick={{
                    fill: "var(--text, #1f2937)",
                    fontFamily: "Inter, sans-serif",
                    fontSize: 12,
                  }}
                />
                <Tooltip content={<CustomTooltip />} cursor={false} />
                <Bar dataKey="count" radius={12} barSize={30}>
                  {stats.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </div>
          </div>
          <div className={styles.footer}>
            <div className={styles.footerText}>
              Top specialties by case volume <TrendingUp className={styles.footerIcon} />
            </div>
            <div className={styles.footerSubtext}>
              Showing the top 5 specialties with the most cases
            </div>
          </div>
        </div>
      ) : (
        <div className={styles.container}>
          <div className={styles.content}>
            <p className={styles.emptyText}>No case statistics available</p>
            <Link
              href="/cases/new"
              className={styles.ctaButton}
              onClick={() =>
                trackEngagement("click", "stats_empty", "contribute_case")
              }
            >
              Contribute a case
            </Link>
          </div>
        </div>
      )}
    </section>
  );
};

export default StatsSection;