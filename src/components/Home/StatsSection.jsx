"use client";

import { useState, useEffect } from "react";
import { TrendingUp } from "lucide-react";
import { Bar, BarChart, XAxis, YAxis, Cell } from "recharts";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/Card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/Chart";
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

  if (loading) {
    return (
      <SkeletonTheme baseColor="#e0e0e0" highlightColor="#f0f0f0">
        <Card>
          <CardHeader>
            <Skeleton height={24} width={150} />
            <Skeleton height={16} width={100} />
          </CardHeader>
          <CardContent>
            <Skeleton height={400} />
          </CardContent>
        </Card>
      </SkeletonTheme>
    );
  }

  if (error) {
    return (
      <Card className={styles.errorCard}>
        <CardContent className={styles.errorContent}>
          <p className={styles.errorText}>{error}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <section aria-labelledby="stats-title" className={styles.statsSection}>
      {stats.length > 0 ? (
        <Card>
          <CardHeader>
            <CardTitle id="stats-title">Case Statistics</CardTitle>
            <CardDescription>Top 5 Specialties by Case Count</CardDescription>
          </CardHeader>
          <CardContent>
            <div className={styles.scrollContainer}>
              <ChartContainer>
                <BarChart
                  accessibilityLayer
                  data={stats}
                  layout="vertical"
                  width={800} // Increased for full labels
                  height={400}
                  margin={{ top: 20, right: 30, left: 200, bottom: 20 }} // Increased left margin
                  onClick={handleBarClick}
                  onMouseMove={handleMouseEnter}
                >
                  <XAxis
                    type="number"
                    dataKey="count"
                    tickLine={false}
                    tickMargin={10}
                    axisLine={false}
                    allowDecimals={false}
                    tick={{
                      fill: "var(--text, #1f2937)",
                      fontFamily: "Inter, sans-serif",
                      fontSize: 12,
                    }}
                  />
                  <YAxis
                    type="category"
                    dataKey="specialty"
                    tickLine={false}
                    tickMargin={10}
                    axisLine={false}
                    tick={{
                      fill: "var(--text, #1f2937)",
                      fontFamily: "Inter, sans-serif",
                      fontSize: 12,
                    }}
                  />
                  <ChartTooltip
                    cursor={false}
                    content={
                      <ChartTooltipContent
                        formatter={(value, name, props) =>
                          `${props.payload.specialty}: ${value} cases`
                        }
                      />
                    }
                  />
                  <Bar dataKey="count" radius={12}>
                    {stats.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ChartContainer>
            </div>
          </CardContent>
          <CardFooter>
            <div className={styles.footerText}>
              Top specialties by case volume <TrendingUp className={styles.footerIcon} />
            </div>
            <div className={styles.footerSubtext}>
              Showing the top 5 specialties with the most cases
            </div>
          </CardFooter>
        </Card>
      ) : (
        <Card>
          <CardContent className={styles.emptyContent}>
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
          </CardContent>
        </Card>
      )}
    </section>
  );
};

export default StatsSection;