import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { filterOptions, sortOptions } from "@/config";
import { AuthContext } from "@/context/auth-context";
import { StudentContext } from "@/context/student-context";
import {
  checkCoursePurchaseInfoService,
  fetchStudentViewCourseListService,
} from "@/services";
import { 
  ArrowUpDownIcon, 
  BookOpen, 
  Users, 
  Clock, 
  Star,
  Filter,
  Search,
  X
} from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

function createSearchParamsHelper(filterParams) {
  const queryParams = [];

  for (const [key, value] of Object.entries(filterParams)) {
    if (Array.isArray(value) && value.length > 0) {
      const paramValue = value.join(",");
      queryParams.push(`${key}=${encodeURIComponent(paramValue)}`);
    }
  }

  return queryParams.join("&");
}

function StudentViewCoursesPage() {
  const [sort, setSort] = useState("price-lowtohigh");
  const [filters, setFilters] = useState({});
  const [showFilters, setShowFilters] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams(); // eslint-disable-line no-unused-vars
  const {
    studentViewCoursesList,
    setStudentViewCoursesList,
    loadingState,
    setLoadingState,
  } = useContext(StudentContext);
  const navigate = useNavigate();
  const { auth } = useContext(AuthContext);

  function handleFilterOnChange(getSectionId, getCurrentOption) {
    let cpyFilters = { ...filters };
    const indexOfCurrentSeection = Object.keys(cpyFilters).indexOf(getSectionId);

    if (indexOfCurrentSeection === -1) {
      cpyFilters = {
        ...cpyFilters,
        [getSectionId]: [getCurrentOption.id],
      };
    } else {
      const indexOfCurrentOption = cpyFilters[getSectionId].indexOf(getCurrentOption.id);

      if (indexOfCurrentOption === -1)
        cpyFilters[getSectionId].push(getCurrentOption.id);
      else cpyFilters[getSectionId].splice(indexOfCurrentOption, 1);
    }

    setFilters(cpyFilters);
    sessionStorage.setItem("filters", JSON.stringify(cpyFilters));
  }

  function clearFilters() {
    setFilters({});
    sessionStorage.removeItem("filters");
  }

  async function fetchAllStudentViewCourses(filters, sort) {
    const query = new URLSearchParams({
      ...filters,
      sortBy: sort,
    });
    const response = await fetchStudentViewCourseListService(query);
    if (response?.success) {
      setStudentViewCoursesList(response?.data);
      setLoadingState(false);
    }
  }

  async function handleCourseNavigate(getCurrentCourseId) {
    const response = await checkCoursePurchaseInfoService(
      getCurrentCourseId,
      auth?.user?._id
    );

    if (response?.success) {
      if (response?.data) {
        navigate(`/student/course-progress/${getCurrentCourseId}`);
      } else {
        navigate(`/student/course/details/${getCurrentCourseId}`);
      }
    }
  }

  // Count active filters
  const activeFiltersCount = Object.values(filters).reduce((acc, filterArray) => acc + filterArray.length, 0);

  useEffect(() => {
    const buildQueryStringForFilters = createSearchParamsHelper(filters);
    setSearchParams(new URLSearchParams(buildQueryStringForFilters));
  }, [filters, setSearchParams]);

  useEffect(() => {
    setSort("price-lowtohigh");
    setFilters(JSON.parse(sessionStorage.getItem("filters")) || {});
  }, []);

  useEffect(() => {
    if (filters !== null && sort !== null)
      fetchAllStudentViewCourses(filters, sort);
  }, [filters, sort]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    return () => {
      sessionStorage.removeItem("filters");
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">All Courses</h1>
              <p className="text-gray-600">Discover your next learning adventure</p>
            </div>
            
            <div className="flex items-center gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search courses..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
                />
              </div>
              
              {/* Mobile Filter Toggle */}
              <Button
                variant="outline"
                className="md:hidden"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="h-4 w-4 mr-2" />
                Filters {activeFiltersCount > 0 && `(${activeFiltersCount})`}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <aside className={`w-full lg:w-80 space-y-6 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
                {activeFiltersCount > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearFilters}
                    className="text-blue-600 hover:text-blue-700"
                  >
                    <X className="h-4 w-4 mr-1" />
                    Clear All
                  </Button>
                )}
              </div>
              
              {Object.keys(filterOptions).map((keyItem) => (
                <div key={keyItem} className="border-b border-gray-100 last:border-b-0 pb-4 mb-4 last:mb-0">
                  <h3 className="font-semibold text-gray-900 mb-3 capitalize">
                    {keyItem.replace(/([A-Z])/g, ' $1').trim()}
                  </h3>
                  <div className="space-y-2">
                    {filterOptions[keyItem].map((option) => (
                      <Label key={option.id} className="flex items-center gap-3 cursor-pointer hover:text-blue-600 transition-colors">
                        <Checkbox
                          checked={
                            filters &&
                            Object.keys(filters).length > 0 &&
                            filters[keyItem] &&
                            filters[keyItem].indexOf(option.id) > -1
                          }
                          onCheckedChange={() => handleFilterOnChange(keyItem, option)}
                          className="border-gray-300"
                        />
                        <span className="text-sm">{option.label}</span>
                      </Label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-600 font-medium">
                  {studentViewCoursesList?.length || 0} courses found
                </span>
                {activeFiltersCount > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(filters).map(([filterKey, filterValues]) =>
                      filterValues.map((value) => {
                        const option = filterOptions[filterKey]?.find(opt => opt.id === value);
                        return option ? (
                          <Badge key={`${filterKey}-${value}`} variant="secondary" className="text-xs">
                            {option.label}
                            <X 
                              className="h-3 w-3 ml-1 cursor-pointer" 
                              onClick={() => handleFilterOnChange(filterKey, option)}
                            />
                          </Badge>
                        ) : null;
                      })
                    )}
                  </div>
                )}
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="flex items-center gap-2">
                    <ArrowUpDownIcon className="h-4 w-4" />
                    <span>Sort By</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[180px]">
                  <DropdownMenuRadioGroup value={sort} onValueChange={(value) => setSort(value)}>
                    {sortOptions.map((sortItem) => (
                      <DropdownMenuRadioItem value={sortItem.id} key={sortItem.id}>
                        {sortItem.label}
                      </DropdownMenuRadioItem>
                    ))}
                  </DropdownMenuRadioGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Course Grid */}
            <div className="space-y-6">
              {studentViewCoursesList && studentViewCoursesList.length > 0 ? (
                studentViewCoursesList.map((courseItem) => (
                  <Card
                    key={courseItem?._id}
                    onClick={() => handleCourseNavigate(courseItem?._id)}
                    className="group cursor-pointer hover:shadow-lg transition-all duration-300 border-0 shadow-sm hover:scale-[1.01]"
                  >
                    <CardContent className="p-0">
                      <div className="flex flex-col sm:flex-row">
                        <div className="sm:w-72 h-48 sm:h-40 flex-shrink-0 relative overflow-hidden">
                          <img
                            src={courseItem?.image || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"}
                            alt={courseItem?.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <div className="absolute top-3 right-3">
                            {courseItem?.pricing === 0 ? (
                              <Badge className="bg-green-500 text-white">Free</Badge>
                            ) : (
                              <Badge className="bg-blue-500 text-white">${courseItem?.pricing}</Badge>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex-1 p-6">
                          <CardTitle className="text-xl mb-3 group-hover:text-blue-600 transition-colors line-clamp-2">
                            {courseItem?.title}
                          </CardTitle>
                          
                          <div className="flex items-center text-sm text-gray-600 mb-3">
                            <Users className="h-4 w-4 mr-1" />
                            <span className="font-medium mr-4">By {courseItem?.instructorName}</span>
                            <Clock className="h-4 w-4 mr-1" />
                            <span>{courseItem?.curriculum?.length || 0} lessons</span>
                          </div>

                          <p className="text-gray-700 text-sm mb-4 line-clamp-2">
                            {courseItem?.description || "Enhance your skills with this comprehensive course designed for all levels."}
                          </p>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div className="flex items-center">
                                <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                                <span className="text-sm font-medium">4.8</span>
                                <span className="text-sm text-gray-500 ml-1">
                                  ({courseItem?.students?.length || 125} students)
                                </span>
                              </div>
                              
                              <Badge variant="outline" className="text-xs">
                                {courseItem?.level?.toUpperCase() || 'ALL'} LEVEL
                              </Badge>
                            </div>

                            <div className="text-right">
                              <div className="text-2xl font-bold text-gray-900">
                                {courseItem?.pricing === 0 ? 'Free' : `$${courseItem?.pricing}`}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : loadingState ? (
                <div className="space-y-6">
                  {[...Array(6)].map((_, index) => (
                    <Card key={index} className="shadow-sm">
                      <CardContent className="p-0">
                        <div className="flex">
                          <Skeleton className="w-72 h-40" />
                          <div className="flex-1 p-6 space-y-4">
                            <Skeleton className="h-6 w-3/4" />
                            <Skeleton className="h-4 w-1/2" />
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-2/3" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <BookOpen className="h-20 w-20 text-gray-400 mx-auto mb-6" />
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">No Courses Found</h3>
                  <p className="text-gray-600 mb-6 max-w-md mx-auto">
                    We couldn&apos;t find any courses matching your criteria. Try adjusting your filters or search terms.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button onClick={clearFilters} variant="outline">
                      Clear All Filters
                    </Button>
                    <Button onClick={() => navigate('/student')} className="bg-blue-600 hover:bg-blue-700">
                      Back to Dashboard
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

export default StudentViewCoursesPage;
