"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BookOpen,
  GraduationCap,
  Users,
  Award,
  TrendingUp,
  Plus,
  Settings,
  Video,
  FileText,
  Calendar,
  BarChart3,
  Loader2,
  Eye,
  Edit,
  Trash2,
  MoreHorizontal,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  getAcademyStats,
  getCourses,
  getWorkshops,
  getCategories,
  type CourseDoc,
  type WorkshopDoc,
  type CategoryDoc,
} from "@/lib/firebase-lms";

export default function AcademyAdminPage() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalCourses: 0,
    totalLessons: 0,
    totalWorkshops: 0,
    totalEnrollments: 0,
    totalCertificates: 0,
  });
  const [courses, setCourses] = useState<CourseDoc[]>([]);
  const [workshops, setWorkshops] = useState<WorkshopDoc[]>([]);
  const [categories, setCategories] = useState<CategoryDoc[]>([]);

  useEffect(() => {
    async function loadData() {
      try {
        const [statsData, coursesData, workshopsData, categoriesData] = await Promise.all([
          getAcademyStats(),
          getCourses(),
          getWorkshops(),
          getCategories(),
        ]);
        setStats(statsData);
        setCourses(coursesData);
        setWorkshops(workshopsData);
        setCategories(categoriesData);
      } catch (error) {
        console.error("Error loading academy data:", error);
        toast.error("Failed to load academy data");
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Academy Management</h1>
          <p className="text-muted-foreground">
            Manage courses, workshops, certificates, and learning content
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href="/academy" target="_blank">
              <Eye className="mr-2 h-4 w-4" />
              View Academy
            </Link>
          </Button>
          <Button asChild>
            <Link href="/portal/admin/academy/courses/new">
              <Plus className="mr-2 h-4 w-4" />
              New Course
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Courses</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalCourses}</div>
            <p className="text-xs text-muted-foreground">
              {courses.filter(c => c.isPublished).length} published
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Lessons</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalLessons}</div>
            <p className="text-xs text-muted-foreground">Across all courses</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Workshops</CardTitle>
            <Video className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalWorkshops}</div>
            <p className="text-xs text-muted-foreground">Live & recorded</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Enrollments</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalEnrollments}</div>
            <p className="text-xs text-muted-foreground">Active learners</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Certificates</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalCertificates}</div>
            <p className="text-xs text-muted-foreground">Issued to date</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="courses" className="space-y-4">
        <TabsList>
          <TabsTrigger value="courses">Courses</TabsTrigger>
          <TabsTrigger value="workshops">Workshops</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="certificates">Certificates</TabsTrigger>
          <TabsTrigger value="gamification">Gamification</TabsTrigger>
        </TabsList>

        {/* Courses Tab */}
        <TabsContent value="courses" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Course Library</h2>
            <Button asChild>
              <Link href="/portal/admin/academy/courses/new">
                <Plus className="mr-2 h-4 w-4" />
                Add Course
              </Link>
            </Button>
          </div>

          {courses.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No courses yet</h3>
                <p className="text-muted-foreground mb-4">
                  Create your first course to get started
                </p>
                <Button asChild>
                  <Link href="/portal/admin/academy/courses/new">
                    <Plus className="mr-2 h-4 w-4" />
                    Create Course
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {courses.map((course) => (
                <Card key={course.id} className="overflow-hidden">
                  <div className="aspect-video bg-slate-200 relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-amber-500/20 to-slate-900/40" />
                    {!course.isPublished && (
                      <Badge className="absolute top-2 left-2 bg-yellow-500">Draft</Badge>
                    )}
                    {course.isFeatured && (
                      <Badge className="absolute top-2 right-2 bg-amber-500">Featured</Badge>
                    )}
                  </div>
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg line-clamp-1">{course.title}</CardTitle>
                        <CardDescription className="line-clamp-2">
                          {course.shortDescription || course.description}
                        </CardDescription>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link href={`/portal/admin/academy/courses/${course.id}`}>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link href={`/academy/courses/${course.slug}`} target="_blank">
                              <Eye className="mr-2 h-4 w-4" />
                              Preview
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        {course.enrollmentCount} enrolled
                      </div>
                      <Badge variant="outline">{course.difficultyLevel}</Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Workshops Tab */}
        <TabsContent value="workshops" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Workshops</h2>
            <Button asChild>
              <Link href="/portal/admin/academy/workshops/new">
                <Plus className="mr-2 h-4 w-4" />
                Add Workshop
              </Link>
            </Button>
          </div>

          {workshops.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Video className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No workshops yet</h3>
                <p className="text-muted-foreground mb-4">
                  Schedule your first workshop
                </p>
                <Button asChild>
                  <Link href="/portal/admin/academy/workshops/new">
                    <Plus className="mr-2 h-4 w-4" />
                    Create Workshop
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {workshops.map((workshop) => (
                <Card key={workshop.id}>
                  <CardContent className="flex items-center justify-between p-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg bg-amber-500/10 flex items-center justify-center">
                        <Video className="h-6 w-6 text-amber-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{workshop.title}</h3>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Badge variant="outline">{workshop.workshopType}</Badge>
                          {workshop.scheduledStart && (
                            <span>
                              {workshop.scheduledStart.toDate().toLocaleDateString()}
                            </span>
                          )}
                          <span>{workshop.registrationCount} registered</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {!workshop.isPublished && (
                        <Badge variant="secondary">Draft</Badge>
                      )}
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/portal/admin/academy/workshops/${workshop.id}`}>
                          Edit
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Categories Tab */}
        <TabsContent value="categories" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Categories</h2>
            <Button asChild>
              <Link href="/portal/admin/academy/categories/new">
                <Plus className="mr-2 h-4 w-4" />
                Add Category
              </Link>
            </Button>
          </div>

          {categories.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Settings className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No categories yet</h3>
                <p className="text-muted-foreground mb-4">
                  Create categories to organize your content
                </p>
                <Button asChild>
                  <Link href="/portal/admin/academy/categories/new">
                    <Plus className="mr-2 h-4 w-4" />
                    Create Category
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {categories.map((category) => (
                <Card key={category.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-10 h-10 rounded-lg flex items-center justify-center"
                          style={{ backgroundColor: category.color || '#f59e0b' }}
                        >
                          <span className="text-white text-lg">{category.icon || '📚'}</span>
                        </div>
                        <div>
                          <h3 className="font-semibold">{category.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {category.courseCount} courses • {category.workshopCount} workshops
                          </p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Certificates Tab */}
        <TabsContent value="certificates" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Certificate Management</h2>
            <Button variant="outline">
              <Settings className="mr-2 h-4 w-4" />
              Certificate Settings
            </Button>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Certificate Templates</CardTitle>
                <CardDescription>
                  Customize certificate designs for different achievements
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Award className="h-5 w-5 text-amber-500" />
                      <span>Course Completion</span>
                    </div>
                    <Button variant="outline" size="sm">Edit</Button>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Award className="h-5 w-5 text-purple-500" />
                      <span>Learning Path</span>
                    </div>
                    <Button variant="outline" size="sm">Edit</Button>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Award className="h-5 w-5 text-blue-500" />
                      <span>Workshop Attendance</span>
                    </div>
                    <Button variant="outline" size="sm">Edit</Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Certificates</CardTitle>
                <CardDescription>
                  Certificates issued in the last 30 days
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  <Award className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No certificates issued yet</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Gamification Tab */}
        <TabsContent value="gamification" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Gamification Settings</h2>
            <Button asChild>
              <Link href="/portal/admin/academy/badges/new">
                <Plus className="mr-2 h-4 w-4" />
                Add Badge
              </Link>
            </Button>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Points System</CardTitle>
                <CardDescription>
                  Configure how learners earn points
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span>Complete a lesson</span>
                    <Badge variant="outline">+10 points</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Complete a course</span>
                    <Badge variant="outline">+100 points</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Attend a workshop</span>
                    <Badge variant="outline">+50 points</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Earn a certificate</span>
                    <Badge variant="outline">+100 points</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Daily streak bonus</span>
                    <Badge variant="outline">+5 points/day</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Badges</CardTitle>
                <CardDescription>
                  Achievement badges learners can earn
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-1">
                      <span className="text-2xl">🎯</span>
                    </div>
                    <span className="text-xs">First Course</span>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-1">
                      <span className="text-2xl">🔥</span>
                    </div>
                    <span className="text-xs">7-Day Streak</span>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mx-auto mb-1">
                      <span className="text-2xl">🏆</span>
                    </div>
                    <span className="text-xs">Top Learner</span>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-1">
                      <span className="text-2xl">📚</span>
                    </div>
                    <span className="text-xs">Bookworm</span>
                  </div>
                </div>
                <Button variant="outline" className="w-full mt-4">
                  Manage All Badges
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Leaderboard</CardTitle>
                <CardDescription>
                  Top learners this month
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  <TrendingUp className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No learner activity yet</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Streak Settings</CardTitle>
                <CardDescription>
                  Configure learning streak requirements
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span>Minimum daily activity</span>
                    <span className="text-muted-foreground">1 lesson</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Streak reset time</span>
                    <span className="text-muted-foreground">Midnight (user timezone)</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Freeze days allowed</span>
                    <span className="text-muted-foreground">2 per month</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
