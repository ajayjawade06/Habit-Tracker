import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";
import { axiosInstance } from "../config";
import { useAuth } from "../utils/AuthContext";
import { 
  Chart as ChartJS, 
  ArcElement, 
  Tooltip, 
  Legend, 
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  PointElement,
  LineElement
} from 'chart.js';
import { Pie, Bar, Line } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(
  ArcElement, 
  Tooltip, 
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  PointElement,
  LineElement
);

const Reports = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const { user } = useAuth();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        if (!user) {
          navigate("/login");
          return;
        }
        const statsRes = await axiosInstance.get("/habits/stats");
        setStats(statsRes.data);
      } catch (error) {
        setError(error.response?.data?.message || "Error fetching stats");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [navigate, user]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="animate-spin h-12 w-12 border-4 border-white rounded-full border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black p-3 sm:p-4 lg:p-6">
      <div className="max-w-6xl mx-auto">
        {error && (
          <div className="bg-red-500/20 backdrop-blur-sm p-3 sm:p-4 rounded-xl border border-red-500/30 text-white mb-4 sm:mb-6 animate-shake">
            {error}
          </div>
        )}

        <div className="bg-white/5 backdrop-blur-sm rounded-xl shadow-2xl p-4 sm:p-6 lg:p-8 border border-white/10 hover:bg-white/10 transition-all duration-300">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0 mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white">Habit Analytics Dashboard</h1>
            <button
              onClick={() => navigate("/dashboard")}
              className="px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/30 flex items-center text-sm sm:text-base"
            >
              <FiArrowLeft className="mr-2" />
              Back to Dashboard
            </button>
          </div>

          {stats && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-6 sm:mb-8">
                <div className="bg-white/5 backdrop-blur-sm p-4 sm:p-6 rounded-xl border border-white/10 hover:bg-white/10 transition-all duration-300">
                  <h3 className="text-white font-semibold mb-2 text-sm sm:text-base">Total Habits</h3>
                  <p className="text-2xl sm:text-3xl lg:text-4xl text-white">{stats.overallStats.totalHabits}</p>
                </div>
                <div className="bg-white/10 p-4 sm:p-6 rounded-lg">
                  <h3 className="text-white font-semibold mb-2 text-sm sm:text-base">Total Completions</h3>
                  <p className="text-2xl sm:text-3xl lg:text-4xl text-white">{stats.overallStats.totalCompletions}</p>
                </div>
                <div className="bg-white/10 p-4 sm:p-6 rounded-lg">
                  <h3 className="text-white font-semibold mb-2 text-sm sm:text-base">Average Streak</h3>
                  <p className="text-2xl sm:text-3xl lg:text-4xl text-white">{Math.round(stats.overallStats.avgStreak)} days</p>
                </div>
                <div className="bg-white/10 p-4 sm:p-6 rounded-lg">
                  <h3 className="text-white font-semibold mb-2 text-sm sm:text-base">Total Badges</h3>
                  <p className="text-2xl sm:text-3xl lg:text-4xl text-white">{stats.overallStats.totalBadges}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                {/* Category Distribution Chart */}
                <div className="bg-white/5 backdrop-blur-sm p-4 sm:p-6 rounded-xl border border-white/10 hover:bg-white/10 transition-all duration-300">
                  <h3 className="text-lg font-semibold text-white mb-4">Habit Categories</h3>
                  <div className="h-64 flex items-center justify-center">
                    {Object.keys(stats.categoryStats).length > 0 ? (
                      <Pie 
                        data={{
                          labels: Object.keys(stats.categoryStats).map(cat => 
                            cat.charAt(0).toUpperCase() + cat.slice(1)
                          ),
                          datasets: [{
                            data: Object.values(stats.categoryStats).map(cat => cat.total),
                            backgroundColor: [
                              'rgba(255, 99, 132, 0.7)',
                              'rgba(54, 162, 235, 0.7)',
                              'rgba(255, 206, 86, 0.7)',
                              'rgba(75, 192, 192, 0.7)',
                              'rgba(153, 102, 255, 0.7)',
                              'rgba(255, 159, 64, 0.7)',
                            ],
                            borderColor: [
                              'rgba(255, 99, 132, 1)',
                              'rgba(54, 162, 235, 1)',
                              'rgba(255, 206, 86, 1)',
                              'rgba(75, 192, 192, 1)',
                              'rgba(153, 102, 255, 1)',
                              'rgba(255, 159, 64, 1)',
                            ],
                            borderWidth: 1,
                          }]
                        }}
                        options={{
                          responsive: true,
                          maintainAspectRatio: false,
                          plugins: {
                            legend: {
                              position: 'right',
                              labels: {
                                color: 'white',
                                font: {
                                  size: 12
                                }
                              }
                            },
                            tooltip: {
                              backgroundColor: 'rgba(0, 0, 0, 0.7)',
                              titleColor: 'white',
                              bodyColor: 'white',
                              titleFont: {
                                size: 14
                              },
                              bodyFont: {
                                size: 12
                              }
                            }
                          }
                        }}
                      />
                    ) : (
                      <p className="text-white/60">No category data available</p>
                    )}
                  </div>
                </div>

                {/* Completion Rate Chart */}
                <div className="bg-white/5 backdrop-blur-sm p-4 sm:p-6 rounded-xl border border-white/10 hover:bg-white/10 transition-all duration-300">
                  <h3 className="text-lg font-semibold text-white mb-4">Top Habit Completion Rates</h3>
                  <div className="h-64 flex items-center justify-center">
                    {stats.habits.length > 0 ? (
                      <Bar
                        data={{
                          labels: stats.habits
                            .sort((a, b) => b.completionRate - a.completionRate)
                            .slice(0, 5)
                            .map(habit => habit.title),
                          datasets: [{
                            label: 'Completion Rate (%)',
                            data: stats.habits
                              .sort((a, b) => b.completionRate - a.completionRate)
                              .slice(0, 5)
                              .map(habit => habit.completionRate),
                            backgroundColor: 'rgba(75, 192, 192, 0.7)',
                            borderColor: 'rgba(75, 192, 192, 1)',
                            borderWidth: 1
                          }]
                        }}
                        options={{
                          responsive: true,
                          maintainAspectRatio: false,
                          scales: {
                            y: {
                              beginAtZero: true,
                              max: 100,
                              ticks: {
                                color: 'white'
                              },
                              grid: {
                                color: 'rgba(255, 255, 255, 0.1)'
                              }
                            },
                            x: {
                              ticks: {
                                color: 'white'
                              },
                              grid: {
                                color: 'rgba(255, 255, 255, 0.1)'
                              }
                            }
                          },
                          plugins: {
                            legend: {
                              labels: {
                                color: 'white'
                              }
                            },
                            tooltip: {
                              backgroundColor: 'rgba(0, 0, 0, 0.7)',
                              titleColor: 'white',
                              bodyColor: 'white'
                            }
                          }
                        }}
                      />
                    ) : (
                      <p className="text-white/60">No completion data available</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="bg-white/5 backdrop-blur-sm p-4 sm:p-6 rounded-xl border border-white/10 hover:bg-white/10 transition-all duration-300">
                <h3 className="text-lg font-semibold text-white mb-4">Category Performance</h3>
                <div className="h-64 sm:h-80 flex items-center justify-center">
                  {Object.keys(stats.categoryStats).length > 0 ? (
                    <Line
                      data={{
                        labels: Object.keys(stats.categoryStats).map(cat => 
                          cat.charAt(0).toUpperCase() + cat.slice(1)
                        ),
                        datasets: [
                          {
                            label: 'Average Streak (days)',
                            data: Object.values(stats.categoryStats).map(cat => cat.avgStreak),
                            borderColor: 'rgba(255, 99, 132, 1)',
                            backgroundColor: 'rgba(255, 99, 132, 0.2)',
                            tension: 0.4,
                            fill: true
                          },
                          {
                            label: 'Completion Rate (%)',
                            data: Object.values(stats.categoryStats).map(cat => 
                              cat.total > 0 ? (cat.completed / cat.total) * 100 : 0
                            ),
                            borderColor: 'rgba(54, 162, 235, 1)',
                            backgroundColor: 'rgba(54, 162, 235, 0.2)',
                            tension: 0.4,
                            fill: true
                          }
                        ]
                      }}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        scales: {
                          y: {
                            beginAtZero: true,
                            ticks: {
                              color: 'white'
                            },
                            grid: {
                              color: 'rgba(255, 255, 255, 0.1)'
                            }
                          },
                          x: {
                            ticks: {
                              color: 'white'
                            },
                            grid: {
                              color: 'rgba(255, 255, 255, 0.1)'
                            }
                          }
                        },
                        plugins: {
                          legend: {
                            position: 'top',
                            labels: {
                              color: 'white'
                            }
                          },
                          tooltip: {
                            backgroundColor: 'rgba(0, 0, 0, 0.7)',
                            titleColor: 'white',
                            bodyColor: 'white'
                          }
                        }
                      }}
                    />
                  ) : (
                    <p className="text-white/60">No performance data available</p>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Reports;