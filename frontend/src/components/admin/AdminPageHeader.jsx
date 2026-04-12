import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { FiArrowLeft, FiChevronRight } from "react-icons/fi";

/**
 * Reusable header component for Admin Dashboard pages.
 * Enforces consistent layout, typography, breadcrumbs, and back navigation.
 */
export default function AdminPageHeader({
  title,
  subtitle,
  breadcrumbs = [],
  showBackButton = false,
  actionButton = null,
}) {
  const navigate = useNavigate();

  return (
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
      <div className="space-y-3">
        {/* Breadcrumb Navigation */}
        {breadcrumbs.length > 0 && (
          <nav className="flex flex-wrap items-center text-sm font-medium text-slate-500 mb-1">
            {breadcrumbs.map((crumb, index) => {
              const isLast = index === breadcrumbs.length - 1;
              return (
                <React.Fragment key={index}>
                  {crumb.path && !isLast ? (
                    <Link
                      to={crumb.path}
                      className="hover:text-emerald-600 transition-colors"
                    >
                      {crumb.label}
                    </Link>
                  ) : (
                    <span
                      className={`text-slate-800 ${
                        isLast ? "font-semibold" : ""
                      }`}
                    >
                      {crumb.label}
                    </span>
                  )}
                  {!isLast && (
                    <FiChevronRight className="mx-1.5 h-4 w-4 text-slate-400 flex-shrink-0" />
                  )}
                </React.Fragment>
              );
            })}
          </nav>
        )}

        <div className="flex items-start gap-4">
          {/* Circular/Square Back Button */}
          {showBackButton && (
            <button
              onClick={() => navigate(-1)}
              className="mt-0.5 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 shadow-sm transition hover:bg-slate-50 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              aria-label="Go back"
              title="Go back"
            >
              <FiArrowLeft className="h-4 w-4" />
            </button>
          )}

          {/* Title and Subtitle */}
          <div>
            <h2 className="text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
              {title}
            </h2>
            {subtitle && (
              <p className="mt-1.5 text-sm text-slate-500 leading-relaxed max-w-3xl">
                {subtitle}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Main Call To Action Button (Right Side) */}
      {actionButton && (
        <div className="flex-shrink-0 mt-2 sm:mt-0 pt-0 sm:pt-2">
          {actionButton}
        </div>
      )}
    </div>
  );
}
