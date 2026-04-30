import { AppLayout } from "@/components/AppLayout";
import { Toaster } from "@/components/ui/sonner";
import {
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import { ThemeProvider } from "next-themes";
import { Suspense, lazy } from "react";

// Lazy-load pages for code splitting
const SplashPage = lazy(() =>
  import("@/pages/SplashPage").then((m) => ({ default: m.SplashPage })),
);
const DashboardPage = lazy(() =>
  import("@/pages/DashboardPage").then((m) => ({ default: m.DashboardPage })),
);
const AddProductPage = lazy(() =>
  import("@/pages/AddProductPage").then((m) => ({ default: m.AddProductPage })),
);
const CategoriesPage = lazy(() =>
  import("@/pages/CategoriesPage").then((m) => ({ default: m.CategoriesPage })),
);
const ProductDetailPage = lazy(() =>
  import("@/pages/ProductDetailPage").then((m) => ({
    default: m.ProductDetailPage,
  })),
);
const StatsPage = lazy(() =>
  import("@/pages/StatsPage").then((m) => ({ default: m.StatsPage })),
);
const SettingsPage = lazy(() =>
  import("@/pages/SettingsPage").then((m) => ({ default: m.SettingsPage })),
);

const PageLoader = () => (
  <div className="flex items-center justify-center flex-1 min-h-[60vh]">
    <div className="flex flex-col items-center gap-3">
      <div className="w-10 h-10 rounded-full border-4 border-primary border-t-transparent animate-spin" />
      <p className="text-sm text-muted-foreground font-body">Loading…</p>
    </div>
  </div>
);

// Routes
const rootRoute = createRootRoute();

const splashRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/splash",
  component: () => (
    <Suspense fallback={<PageLoader />}>
      <SplashPage />
    </Suspense>
  ),
});

const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: () => (
    <AppLayout>
      <Suspense fallback={<PageLoader />}>
        <DashboardPage />
      </Suspense>
    </AppLayout>
  ),
});

const addRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/add",
  component: () => (
    <AppLayout>
      <Suspense fallback={<PageLoader />}>
        <AddProductPage />
      </Suspense>
    </AppLayout>
  ),
});

const categoriesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/categories",
  component: () => (
    <AppLayout>
      <Suspense fallback={<PageLoader />}>
        <CategoriesPage />
      </Suspense>
    </AppLayout>
  ),
});

const productDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/product/$id",
  component: () => (
    <AppLayout>
      <Suspense fallback={<PageLoader />}>
        <ProductDetailPage />
      </Suspense>
    </AppLayout>
  ),
});

const statsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/stats",
  component: () => (
    <AppLayout>
      <Suspense fallback={<PageLoader />}>
        <StatsPage />
      </Suspense>
    </AppLayout>
  ),
});

const settingsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/settings",
  component: () => (
    <AppLayout>
      <Suspense fallback={<PageLoader />}>
        <SettingsPage />
      </Suspense>
    </AppLayout>
  ),
});

const router = createRouter({
  routeTree: rootRoute.addChildren([
    splashRoute,
    dashboardRoute,
    addRoute,
    categoriesRoute,
    productDetailRoute,
    statsRoute,
    settingsRoute,
  ]),
  defaultPreload: "intent",
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
      <RouterProvider router={router} />
      <Toaster position="top-center" richColors />
    </ThemeProvider>
  );
}
