# portfolio-manager

## Notes on Trade-offs, Decisions, and Next Steps

### Trade-offs
- Portfolio analytics are calculated on the client side in src/hooks/usePortfolio.ts and src/utils/insightUtils.ts. This is fast for small datasets and easier to iterate on, but can become expensive for larger portfolios without memoization tuning or server-side aggregation.
- Styling is a mix of Mantine components and inline style objects. This gives quick control during UI iteration, but can reduce consistency and make long-term theming harder compared with a centralized design token system.

### Key decisions
- Kept a typed domain model in src/types/index.ts to enforce consistent shapes (Company, Fund, FundStats, PortfolioSummary) across hooks, utilities, and components.
- Centralized business logic in usePortfolio and utility helpers so UI components stay focused on rendering and user interactions.
- Used ID-based fund mapping (Company.fundId -> Fund.id) as a clear and lightweight relationship model for grouping, filtering, and move operations.

### What I would do with more time
- Add automated tests:
  - unit tests for usePortfolio calculations and insightUtils functions,
  - component tests for key workflows (filtering, sorting, move preview, move commit).
- Integrate PostHog feature flags to safely roll out high-impact UI and analytics changes (for example: new risk models, alternate scoring thresholds, or new table interactions) with staged release controls.
- Add a backend adapter pattern to decouple domain logic from data providers:
  - define repository-style interfaces for funds/companies/move operations,
  - keep current mock source as one adapter,
  - add API adapters later without rewriting core hook and UI logic.
- Add drag and drop support to move companies across funds directly from the table/fund sections, with clear affordances, optimistic updates, and rollback handling for failed moves.
- Improve performance for scale:
  - virtualize large tables,
  - precompute/normalize aggregate metrics,
  - consider moving heavy analytics to server endpoints.
- Standardize styling by extracting repeated inline styles into reusable theme tokens or component-level style modules.
