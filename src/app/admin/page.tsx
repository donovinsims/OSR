'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { authClient, useSession } from '@/lib/auth-client';
import Navigation from '@/components/sections/navigation';
import {
  Loader2,
  Users,
  FileText,
  TrendingUp,
  Eye,
  Download,
  Share2,
  Clock,
  CheckCircle,
  XCircle,
  Search,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  ShieldAlert
} from 'lucide-react';
import { toast } from 'sonner';

interface Stats {
  totalUsers: number;
  totalAgents: number;
  approvedAgents: number;
  totalBookmarks: number;
  totalReviews: number;
  totalComments: number;
  totalVotes: number;
  totalSubmissions: number;
  pendingSubmissions: number;
  approvedSubmissions: number;
  rejectedSubmissions: number;
  totalVisits: number;
  totalDownloads: number;
  totalShares: number;
  newUsersLast7Days: number;
  newAgentsLast7Days: number;
  newSubmissionsLast7Days: number;
  newReviewsLast7Days: number;
}

interface User {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  createdAt: string;
  bookmarksCount: number;
  reviewsCount: number;
  commentsCount: number;
  votesCount: number;
  submissionsCount: number;
}

interface Submission {
  id: number;
  userId: string;
  payload: any;
  status: string;
  agentId: number | null;
  createdAt: string;
  reviewedAt: string | null;
  reviewerId: string | null;
  user: {
    id: string;
    name: string;
    email: string;
  };
  agent: {
    id: number;
    name: string;
    slug: string;
  } | null;
}

export default function AdminPage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const [activeTab, setActiveTab] = useState<'overview' | 'submissions' | 'users'>('overview');
  const [isCheckingAdmin, setIsCheckingAdmin] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  
  const [stats, setStats] = useState<Stats | null>(null);
  const [isLoadingStats, setIsLoadingStats] = useState(true);
  
  const [users, setUsers] = useState<User[]>([]);
  const [usersTotal, setUsersTotal] = useState(0);
  const [usersPage, setUsersPage] = useState(1);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [usersSearch, setUsersSearch] = useState('');
  
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [submissionsTotal, setSubmissionsTotal] = useState(0);
  const [submissionsPage, setSubmissionsPage] = useState(1);
  const [isLoadingSubmissions, setIsLoadingSubmissions] = useState(false);
  const [submissionsFilter, setSubmissionsFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending');
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);

  useEffect(() => {
    if (!isPending && !session?.user) {
      router.push('/login?redirect=/admin');
    } else if (!isPending && session?.user) {
      // Verify admin access via server-side endpoint
      checkAdminStatus();
    }
  }, [session, isPending, router]);

  const checkAdminStatus = async () => {
    try {
      const token = localStorage.getItem('bearer_token');
      const res = await fetch('/api/admin/check', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const data = await res.json();
      
      if (!data.isAdmin) {
        setIsAdmin(false);
        setIsCheckingAdmin(false);
        toast.error('Unauthorized: Admin access required');
        return;
      }
      
      setIsAdmin(true);
      setIsCheckingAdmin(false);
    } catch (error) {
      setIsAdmin(false);
      setIsCheckingAdmin(false);
      toast.error('Error verifying admin access');
    }
  };

  useEffect(() => {
    if (session?.user) {
      fetchStats();
    }
  }, [session]);

  useEffect(() => {
    if (activeTab === 'users' && session?.user) {
      fetchUsers();
    }
  }, [activeTab, usersPage, usersSearch, session]);

  useEffect(() => {
    if (activeTab === 'submissions' && session?.user) {
      fetchSubmissions();
    }
  }, [activeTab, submissionsPage, submissionsFilter, session]);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('bearer_token');
      const res = await fetch('/api/admin/stats', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      } else {
        toast.error('Failed to load statistics');
      }
    } catch (error) {
      toast.error('Error loading statistics');
    } finally {
      setIsLoadingStats(false);
    }
  };

  const fetchUsers = async () => {
    setIsLoadingUsers(true);
    try {
      const token = localStorage.getItem('bearer_token');
      const params = new URLSearchParams({
        page: usersPage.toString(),
        pageSize: '20',
        ...(usersSearch && { search: usersSearch })
      });
      
      const res = await fetch(`/api/admin/users?${params}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (res.ok) {
        const data = await res.json();
        setUsers(data.data);
        setUsersTotal(data.total);
      } else {
        toast.error('Failed to load users');
      }
    } catch (error) {
      toast.error('Error loading users');
    } finally {
      setIsLoadingUsers(false);
    }
  };

  const fetchSubmissions = async () => {
    setIsLoadingSubmissions(true);
    try {
      const token = localStorage.getItem('bearer_token');
      const params = new URLSearchParams({
        page: submissionsPage.toString(),
        pageSize: '20',
        ...(submissionsFilter !== 'all' && { status: submissionsFilter })
      });
      
      const res = await fetch(`/api/admin/submissions?${params}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (res.ok) {
        const data = await res.json();
        setSubmissions(data.data);
        setSubmissionsTotal(data.total);
      } else {
        toast.error('Failed to load submissions');
      }
    } catch (error) {
      toast.error('Error loading submissions');
    } finally {
      setIsLoadingSubmissions(false);
    }
  };

  const handleReviewSubmission = async (submissionId: number, status: 'approved' | 'rejected') => {
    try {
      const token = localStorage.getItem('bearer_token');
      const res = await fetch(`/api/admin/submissions/${submissionId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });

      if (res.ok) {
        toast.success(`Submission ${status}`);
        setSelectedSubmission(null);
        await fetchSubmissions();
        await fetchStats();
      } else {
        toast.error(`Failed to ${status} submission`);
      }
    } catch (error) {
      toast.error('Error updating submission');
    }
  };

  if (isPending || isCheckingAdmin) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!session?.user || !isAdmin) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="container mx-auto px-6 py-24">
          <div className="max-w-md mx-auto text-center">
            <div className="mb-6 flex justify-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-destructive/10">
                <ShieldAlert className="h-10 w-10 text-destructive" />
              </div>
            </div>
            <h1 className="text-3xl font-bold mb-4">Access Denied</h1>
            <p className="text-muted-foreground mb-8">
              You don't have permission to access this page. Admin privileges are required.
            </p>
            <button
              onClick={() => router.push('/')}
              className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
            >
              Return to Home
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <h1 className="text-4xl md:text-5xl font-bold">Admin Dashboard</h1>
            <span className="px-3 py-1 bg-chart-1/20 text-chart-1 text-xs font-medium rounded-full">
              Admin Only
            </span>
          </div>
          <p className="text-lg text-muted-foreground">
            Manage users, review submissions, and monitor platform statistics
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Logged in as: <span className="font-medium">{session.user.email}</span>
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-border">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-6 py-3 font-medium transition-colors border-b-2 ${
              activeTab === 'overview'
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('submissions')}
            className={`px-6 py-3 font-medium transition-colors border-b-2 ${
              activeTab === 'submissions'
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            Submissions
            {stats && stats.pendingSubmissions > 0 && (
              <span className="ml-2 px-2 py-0.5 text-xs bg-primary text-primary-foreground rounded-full">
                {stats.pendingSubmissions}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`px-6 py-3 font-medium transition-colors border-b-2 ${
              activeTab === 'users'
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            Users
          </button>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div>
            {isLoadingStats ? (
              <div className="flex justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : stats && (
              <div className="space-y-8">
                {/* Key Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="bg-card border border-border rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-2">
                      <Users className="h-8 w-8 text-chart-1" />
                      <span className="text-2xl font-bold">{stats.totalUsers}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">Total Users</p>
                    <p className="text-xs text-chart-2 mt-1">+{stats.newUsersLast7Days} this week</p>
                  </div>

                  <div className="bg-card border border-border rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-2">
                      <FileText className="h-8 w-8 text-chart-2" />
                      <span className="text-2xl font-bold">{stats.totalAgents}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">Total Tools</p>
                    <p className="text-xs text-chart-2 mt-1">+{stats.newAgentsLast7Days} this week</p>
                  </div>

                  <div className="bg-card border border-border rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-2">
                      <Clock className="h-8 w-8 text-chart-4" />
                      <span className="text-2xl font-bold">{stats.pendingSubmissions}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">Pending Reviews</p>
                    <p className="text-xs text-muted-foreground mt-1">{stats.totalSubmissions} total</p>
                  </div>

                  <div className="bg-card border border-border rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-2">
                      <TrendingUp className="h-8 w-8 text-chart-3" />
                      <span className="text-2xl font-bold">{stats.totalVisits}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">Total Visits</p>
                    <p className="text-xs text-muted-foreground mt-1">{stats.totalDownloads} downloads</p>
                  </div>
                </div>

                {/* Additional Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-card border border-border rounded-2xl p-6">
                    <h3 className="font-semibold mb-4">Engagement</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Reviews</span>
                        <span className="font-medium">{stats.totalReviews}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Comments</span>
                        <span className="font-medium">{stats.totalComments}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Votes</span>
                        <span className="font-medium">{stats.totalVotes}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Bookmarks</span>
                        <span className="font-medium">{stats.totalBookmarks}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-card border border-border rounded-2xl p-6">
                    <h3 className="font-semibold mb-4">Submissions</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Pending</span>
                        <span className="font-medium flex items-center gap-1">
                          <Clock className="h-4 w-4 text-chart-4" />
                          {stats.pendingSubmissions}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Approved</span>
                        <span className="font-medium flex items-center gap-1">
                          <CheckCircle className="h-4 w-4 text-chart-2" />
                          {stats.approvedSubmissions}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Rejected</span>
                        <span className="font-medium flex items-center gap-1">
                          <XCircle className="h-4 w-4 text-destructive" />
                          {stats.rejectedSubmissions}
                        </span>
                      </div>
                      <div className="flex justify-between pt-2 border-t border-border">
                        <span className="text-sm font-medium">Total</span>
                        <span className="font-semibold">{stats.totalSubmissions}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-card border border-border rounded-2xl p-6">
                    <h3 className="font-semibold mb-4">Platform Metrics</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground flex items-center gap-2">
                          <Eye className="h-4 w-4" />
                          Visits
                        </span>
                        <span className="font-medium">{stats.totalVisits}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground flex items-center gap-2">
                          <Download className="h-4 w-4" />
                          Downloads
                        </span>
                        <span className="font-medium">{stats.totalDownloads}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground flex items-center gap-2">
                          <Share2 className="h-4 w-4" />
                          Shares
                        </span>
                        <span className="font-medium">{stats.totalShares}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Submissions Tab */}
        {activeTab === 'submissions' && (
          <div>
            {/* Filters */}
            <div className="flex gap-4 mb-6">
              {(['all', 'pending', 'approved', 'rejected'] as const).map((filter) => (
                <button
                  key={filter}
                  onClick={() => {
                    setSubmissionsFilter(filter);
                    setSubmissionsPage(1);
                  }}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    submissionsFilter === filter
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted hover:bg-muted/80'
                  }`}
                >
                  {filter.charAt(0).toUpperCase() + filter.slice(1)}
                </button>
              ))}
            </div>

            {/* Submissions List */}
            {isLoadingSubmissions ? (
              <div className="flex justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : submissions.length === 0 ? (
              <div className="bg-muted/50 rounded-2xl p-12 text-center">
                <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-lg text-muted-foreground">No submissions found</p>
              </div>
            ) : (
              <>
                <div className="space-y-4">
                  {submissions.map((submission) => (
                    <div
                      key={submission.id}
                      className="bg-card border border-border rounded-2xl p-6 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold mb-1">
                            {submission.payload?.name || 'Untitled Submission'}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            Submitted by {submission.user?.name || 'Unknown User'} ({submission.user?.email || 'N/A'})
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {new Date(submission.createdAt).toLocaleDateString()} at{' '}
                            {new Date(submission.createdAt).toLocaleTimeString()}
                          </p>
                        </div>
                        
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            submission.status === 'pending'
                              ? 'bg-chart-4/20 text-chart-4'
                              : submission.status === 'approved'
                              ? 'bg-chart-2/20 text-chart-2'
                              : 'bg-destructive/20 text-destructive'
                          }`}
                        >
                          {submission.status}
                        </span>
                      </div>

                      {submission.payload?.description && (
                        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                          {submission.payload.description}
                        </p>
                      )}

                      <div className="flex items-center gap-4">
                        {submission.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleReviewSubmission(submission.id, 'approved')}
                              className="flex items-center gap-2 px-4 py-2 bg-chart-2 text-white rounded-lg hover:bg-chart-2/90 transition-colors"
                            >
                              <CheckCircle className="h-4 w-4" />
                              Approve
                            </button>
                            <button
                              onClick={() => handleReviewSubmission(submission.id, 'rejected')}
                              className="flex items-center gap-2 px-4 py-2 bg-destructive text-destructive-foreground rounded-lg hover:bg-destructive/90 transition-colors"
                            >
                              <XCircle className="h-4 w-4" />
                              Reject
                            </button>
                          </>
                        )}
                        
                        <button
                          onClick={() => setSelectedSubmission(submission)}
                          className="ml-auto text-sm text-muted-foreground hover:text-foreground flex items-center gap-1"
                        >
                          View Details <ExternalLink className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                {submissionsTotal > 20 && (
                  <div className="flex items-center justify-center gap-4 mt-8">
                    <button
                      onClick={() => setSubmissionsPage(p => Math.max(1, p - 1))}
                      disabled={submissionsPage === 1}
                      className="p-2 rounded-lg hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    
                    <span className="text-sm text-muted-foreground">
                      Page {submissionsPage} of {Math.ceil(submissionsTotal / 20)}
                    </span>
                    
                    <button
                      onClick={() => setSubmissionsPage(p => p + 1)}
                      disabled={submissionsPage >= Math.ceil(submissionsTotal / 20)}
                      className="p-2 rounded-lg hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div>
            {/* Search */}
            <div className="mb-6">
              <div className="relative max-w-md">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search users..."
                  value={usersSearch}
                  onChange={(e) => {
                    setUsersSearch(e.target.value);
                    setUsersPage(1);
                  }}
                  className="w-full h-12 pl-12 pr-4 bg-input border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
            </div>

            {/* Users Table */}
            {isLoadingUsers ? (
              <div className="flex justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : users.length === 0 ? (
              <div className="bg-muted/50 rounded-2xl p-12 text-center">
                <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-lg text-muted-foreground">No users found</p>
              </div>
            ) : (
              <>
                <div className="bg-card border border-border rounded-2xl overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-muted/50 border-b border-border">
                        <tr>
                          <th className="px-6 py-4 text-left text-sm font-semibold">User</th>
                          <th className="px-6 py-4 text-left text-sm font-semibold">Email</th>
                          <th className="px-6 py-4 text-left text-sm font-semibold">Joined</th>
                          <th className="px-6 py-4 text-left text-sm font-semibold">Activity</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {users.map((user) => (
                          <tr key={user.id} className="hover:bg-muted/50 transition-colors">
                            <td className="px-6 py-4">
                              <div className="font-medium">{user.name || 'Unnamed'}</div>
                            </td>
                            <td className="px-6 py-4 text-sm text-muted-foreground">
                              {user.email}
                            </td>
                            <td className="px-6 py-4 text-sm text-muted-foreground">
                              {new Date(user.createdAt).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex gap-4 text-xs text-muted-foreground">
                                <span>{user.bookmarksCount} bookmarks</span>
                                <span>{user.reviewsCount} reviews</span>
                                <span>{user.submissionsCount} submissions</span>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Pagination */}
                {usersTotal > 20 && (
                  <div className="flex items-center justify-center gap-4 mt-8">
                    <button
                      onClick={() => setUsersPage(p => Math.max(1, p - 1))}
                      disabled={usersPage === 1}
                      className="p-2 rounded-lg hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    
                    <span className="text-sm text-muted-foreground">
                      Page {usersPage} of {Math.ceil(usersTotal / 20)}
                    </span>
                    
                    <button
                      onClick={() => setUsersPage(p => p + 1)}
                      disabled={usersPage >= Math.ceil(usersTotal / 20)}
                      className="p-2 rounded-lg hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* Submission Detail Modal */}
        {selectedSubmission && (
          <div
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-6 z-50"
            onClick={() => setSelectedSubmission(null)}
          >
            <div
              className="bg-card border border-border rounded-2xl p-8 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-2xl font-bold mb-4">Submission Details</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Name</label>
                  <p className="text-lg">{selectedSubmission.payload?.name || 'N/A'}</p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Description</label>
                  <p className="text-sm">{selectedSubmission.payload?.description || 'N/A'}</p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Website URL</label>
                  <p className="text-sm">{selectedSubmission.payload?.websiteUrl || 'N/A'}</p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Submitted By</label>
                  <p className="text-sm">{selectedSubmission.user?.name || 'Unknown User'} ({selectedSubmission.user?.email || 'N/A'})</p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Status</label>
                  <p className="text-sm">{selectedSubmission.status}</p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Full Payload</label>
                  <pre className="text-xs bg-muted p-4 rounded-lg overflow-x-auto mt-2">
                    {JSON.stringify(selectedSubmission.payload, null, 2)}
                  </pre>
                </div>
              </div>

              <button
                onClick={() => setSelectedSubmission(null)}
                className="mt-6 w-full py-3 bg-muted hover:bg-muted/80 rounded-lg font-medium transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}