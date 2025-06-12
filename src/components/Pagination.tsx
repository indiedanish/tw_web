import React from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { useLocationData } from '../contexts/LocationDataContext';

export const Pagination: React.FC = () => {
    const {
        pagination,
        loading,
        changePage,
        changeLimit,
        goToNextPage,
        goToPreviousPage
    } = useLocationData();

    const limitOptions = [5, 10, 25, 50, 100];

    const handleLimitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newLimit = parseInt(e.target.value);
        changeLimit(newLimit);
    };

    const handlePageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const page = parseInt(e.target.value);
        if (page >= 1 && page <= pagination.totalPages) {
            changePage(page);
        }
    };

    const getPageNumbers = () => {
        const { currentPage, totalPages } = pagination;
        const delta = 2; // Number of pages to show on each side of current page
        const pages: number[] = [];

        // Always show first page
        if (currentPage > delta + 1) {
            pages.push(1);
            if (currentPage > delta + 2) {
                pages.push(-1); // Represents ellipsis
            }
        }

        // Show pages around current page
        for (let i = Math.max(1, currentPage - delta); i <= Math.min(totalPages, currentPage + delta); i++) {
            pages.push(i);
        }

        // Always show last page
        if (currentPage < totalPages - delta) {
            if (currentPage < totalPages - delta - 1) {
                pages.push(-1); // Represents ellipsis
            }
            pages.push(totalPages);
        }

        return pages;
    };

    if (pagination.total === 0) {
        return null;
    }

    return (
        <div className="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
            <div className="flex items-center justify-between">
                {/* Left side: Results info and limit selector */}
                <div className="flex items-center space-x-4">
                    <div className="text-sm text-gray-700">
                        Showing{' '}
                        <span className="font-medium">{pagination.offset + 1}</span>
                        {' '}to{' '}
                        <span className="font-medium">
                            {Math.min(pagination.offset + pagination.limit, pagination.total)}
                        </span>
                        {' '}of{' '}
                        <span className="font-medium">{pagination.total}</span>
                        {' '}results
                    </div>

                    <div className="flex items-center space-x-2">
                        <label htmlFor="limit" className="text-sm text-gray-700">
                            Show:
                        </label>
                        <select
                            id="limit"
                            value={pagination.limit}
                            onChange={handleLimitChange}
                            disabled={loading}
                            className="border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
                        >
                            {limitOptions.map(option => (
                                <option key={option} value={option}>
                                    {option}
                                </option>
                            ))}
                        </select>
                        <span className="text-sm text-gray-700">per page</span>
                    </div>
                </div>

                {/* Right side: Page navigation */}
                <div className="flex items-center space-x-2">
                    {/* First page button */}
                    <button
                        onClick={() => changePage(1)}
                        disabled={!pagination.hasPreviousPage || loading}
                        className="relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed rounded-md"
                        title="First page"
                    >
                        <ChevronsLeft className="h-4 w-4" />
                    </button>

                    {/* Previous page button */}
                    <button
                        onClick={goToPreviousPage}
                        disabled={!pagination.hasPreviousPage || loading}
                        className="relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed rounded-md"
                        title="Previous page"
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </button>

                    {/* Page numbers */}
                    <div className="flex items-center space-x-1">
                        {getPageNumbers().map((page, index) => (
                            <span key={index}>
                                {page === -1 ? (
                                    <span className="px-3 py-2 text-gray-500">...</span>
                                ) : (
                                    <button
                                        onClick={() => changePage(page)}
                                        disabled={loading}
                                        className={`relative inline-flex items-center px-3 py-2 border text-sm font-medium rounded-md disabled:opacity-50 ${page === pagination.currentPage
                                                ? 'bg-blue-50 border-blue-500 text-blue-600'
                                                : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                                            }`}
                                    >
                                        {page}
                                    </button>
                                )}
                            </span>
                        ))}
                    </div>

                    {/* Next page button */}
                    <button
                        onClick={goToNextPage}
                        disabled={!pagination.hasNextPage || loading}
                        className="relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed rounded-md"
                        title="Next page"
                    >
                        <ChevronRight className="h-4 w-4" />
                    </button>

                    {/* Last page button */}
                    <button
                        onClick={() => changePage(pagination.totalPages)}
                        disabled={!pagination.hasNextPage || loading}
                        className="relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed rounded-md"
                        title="Last page"
                    >
                        <ChevronsRight className="h-4 w-4" />
                    </button>
                </div>
            </div>

            {/* Mobile-friendly page input */}
            <div className="mt-3 sm:hidden">
                <div className="flex items-center justify-center space-x-2">
                    <span className="text-sm text-gray-700">Page</span>
                    <input
                        type="number"
                        min="1"
                        max={pagination.totalPages}
                        value={pagination.currentPage}
                        onChange={handlePageChange}
                        disabled={loading}
                        className="border border-gray-300 rounded-md px-2 py-1 text-sm w-16 text-center focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
                    />
                    <span className="text-sm text-gray-700">of {pagination.totalPages}</span>
                </div>
            </div>
        </div>
    );
}; 