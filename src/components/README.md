# Components Documentation

## UI Components

### Loading Components
- `Loading` - Generic loading spinner with text
- `LoadingSpinner` - Simple spinner
- `PageLoading` - Full page loading state
- `TableLoading` - Table-specific loading state

### Error Components
- `ErrorState` - Generic error display with retry button
- `PageError` - Full page error state

### Empty State Components
- `EmptyState` - Generic empty state
- `EmptySearchState` - Search-specific empty state
- `EmptyTableState` - Table-specific empty state

### Skeleton Components
- `Skeleton` - Base skeleton component
- `TableSkeleton` - Table skeleton with rows/cols
- `CardSkeleton` - Card skeleton

## Usage Examples

```tsx
import { TableLoading, ErrorState, EmptyTableState } from "@/components/ui"

// Loading state
{isLoading && <TableLoading />}

// Error state
{error && (
  <ErrorState
    title="Bir hata oluştu"
    message="Lütfen tekrar deneyin"
    onRetry={() => refetch()}
  />
)}

// Empty state
{data && data.length === 0 && (
  <EmptyTableState message="Henüz kayıt bulunmuyor" />
)}
```
