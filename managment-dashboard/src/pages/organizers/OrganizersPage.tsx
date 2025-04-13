import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useOrganizers } from "@/hooks";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getOrganizerTypeDisplayName } from "@/schema/organizerSchema";
import { MoreVertical, Plus, Search } from "lucide-react";
import { organization } from "@/types/CONSTANT";

export function OrganizersPage() {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  const { data, isLoading, error } = useOrganizers(page, pageSize, debouncedSearchTerm);

  // Handle search with debounce
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);

    // Reset to first page when searching
    setPage(1);

    // Debounce search
    setTimeout(() => {
      setDebouncedSearchTerm(value);
    }, 500);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const goToCreateOrganizer = () => {
    navigate(organization.organizersCreateUrl);
  };

  const goToEditOrganizer = (id: string) => {
    navigate(`${organization.organizersListUrl}/${id}/edit`);
  };

  const goToViewOrganizer = (id: string) => {
    navigate(`${organization.organizersListUrl}/${id}`);
  };

  // Calculate total pages
  const totalPages = data ? Math.ceil(data.totalCount / pageSize) : 0;

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      // Show all pages if less than maxVisible
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first and last page, and some pages around current
      let startPage = Math.max(1, page - Math.floor(maxVisible / 2));
      let endPage = Math.min(totalPages, startPage + maxVisible - 1);

      if (endPage - startPage < maxVisible - 1) {
        startPage = Math.max(1, endPage - maxVisible + 1);
      }

      if (startPage > 1) {
        pages.push(1);
        if (startPage > 2) pages.push(-1); // -1 represents ellipsis
      }

      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }

      if (endPage < totalPages) {
        if (endPage < totalPages - 1) pages.push(-1);
        pages.push(totalPages);
      }
    }

    return pages;
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Organizers</h1>
        <Button onClick={goToCreateOrganizer}>
          <Plus className="h-4 w-4 mr-2" /> Add Organizer
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search organizers..."
              className="pl-10"
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-10 w-full" />
            {Array.from({ length: 5 }).map((_, index) => (
              <Skeleton key={index} className="h-16 w-full" />
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <p className="text-gray-600 mb-4">Failed to load organizers</p>
            <Button onClick={() => window.location.reload()}>Retry</Button>
          </div>
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Contact Person</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead className="w-[80px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data?.organizers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8">
                      {debouncedSearchTerm
                        ? "No organizers match your search criteria"
                        : "No organizers found"
                      }
                    </TableCell>
                  </TableRow>
                ) : (
                  data?.organizers.map((organizer) => (
                    <TableRow key={organizer.id} onClick={() => goToViewOrganizer(organizer.id)} className="cursor-pointer">
                      <TableCell className="font-medium">{organizer.name}</TableCell>
                      <TableCell>{getOrganizerTypeDisplayName(organizer.type)}</TableCell>
                      <TableCell>{organizer.contactPerson || "-"}</TableCell>
                      <TableCell>
                        {organizer.email && (
                          <div>{organizer.email}</div>
                        )}
                        {organizer.phone && (
                          <div className="text-gray-500">{organizer.phone}</div>
                        )}
                        {!organizer.email && !organizer.phone && "-"}
                      </TableCell>
                      <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="h-4 w-4" />
                              <span className="sr-only">Open menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => goToViewOrganizer(organizer.id)}>
                              View
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => goToEditOrganizer(organizer.id)}>
                              Edit
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>

            {totalPages > 1 && (
              <Pagination className="mt-6">
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => handlePageChange(page - 1)}
                      disabled={page === 1}
                      href="#"
                    />
                  </PaginationItem>

                  {getPageNumbers().map((pageNum, i) => (
                    <PaginationItem key={i}>
                      {pageNum === -1 ? (
                        <PaginationEllipsis />
                      ) : (
                        <PaginationLink
                          isActive={pageNum === page}
                          onClick={() => handlePageChange(pageNum)}
                          href="#"
                        >
                          {pageNum}
                        </PaginationLink>
                      )}
                    </PaginationItem>
                  ))}

                  <PaginationItem>
                    <PaginationNext
                      onClick={() => handlePageChange(page + 1)}
                      disabled={page === totalPages}
                      href="#"
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            )}
          </>
        )}
      </div>
    </div>
  );
}
