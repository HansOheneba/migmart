export const metadata = {
  title: "MigMart – Documentation",
  description: "Tech stack, features, and architecture overview for MigMart.",
};

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-white font-sans text-gray-900">
      {/* Cover */}
      <div className="relative overflow-hidden bg-[linear-gradient(135deg,#052e16_0%,#14532d_45%,#166534_100%)] px-8 py-20 md:px-16">
        <div className="pointer-events-none absolute -right-20 -top-20 h-96 w-96 rounded-full bg-white/5" />
        <div className="relative z-10 mx-auto max-w-4xl">
          <div className="mb-8 inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-4 py-2 text-lg font-bold text-white">
            🛒 MigMart
          </div>
          <h1 className="max-w-2xl text-5xl font-extrabold leading-tight text-white">
            Technical &amp; Product{" "}
            <span className="text-lime-300">Documentation</span>
          </h1>
          <p className="mt-4 max-w-xl text-white/70">
            A full-stack grocery loyalty platform — real-time rewards,
            gamification, and e-commerce UX built for a project presentation.
          </p>
          <div className="mt-10 flex flex-wrap gap-6 text-sm">
            {[
              ["Version", "0.1.0"],
              ["Framework", "Next.js 16.2.6"],
              ["Database", "Supabase (Postgres)"],
              ["Currency", "Ghanaian Cedis (GHS)"],
              ["Deployed", "migmart.vercel.app"],
            ].map(([label, value]) => (
              <div key={label}>
                <p className="text-white/50">{label}</p>
                <p className="font-semibold text-white">{value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-6 py-14 md:px-10">
        {/* TOC */}
        <div className="mb-14 rounded-2xl border border-gray-200 bg-gray-50 p-7">
          <p className="mb-3 text-xs font-bold uppercase tracking-widest text-gray-400">
            Contents
          </p>
          <ol className="grid gap-1.5 sm:grid-cols-2">
            {[
              ["#overview", "App Overview"],
              ["#tech", "Tech Stack"],
              ["#architecture", "Architecture & Routing"],
              ["#auth", "Authentication & Onboarding"],
              ["#storefront", "Storefront"],
              ["#loyalty", "Loyalty & Points System"],
              ["#spin", "Spin-to-Win Wheel"],
              ["#challenges", "Challenges"],
              ["#rewards", "Reward Catalog"],
              ["#badges", "Badges & Achievements"],
              ["#referrals", "Referral System"],
              ["#leaderboard", "Leaderboard"],
              ["#admin", "Admin Dashboard"],
              ["#data", "Data Layer"],
            ].map(([href, label], i) => (
              <li key={href}>
                <a
                  href={href}
                  className="flex items-center gap-2 text-sm font-medium text-green-700 hover:underline"
                >
                  <span className="w-5 shrink-0 text-xs text-gray-400">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {label}
                </a>
              </li>
            ))}
          </ol>
        </div>

        {/* ── Sections ── */}

        <Section id="overview" num="01" title="App Overview">
          <p>
            <strong>MigMart</strong> is a loyalty-enabled grocery shopping
            platform. It simulates a real-world retail experience where
            customers earn points on purchases, spin a daily prize wheel,
            complete challenges, unlock badges, and redeem points for discounts
            and free items — all within a polished, mobile-friendly web app.
          </p>
          <p>
            The platform uses real backend infrastructure (Supabase for auth,
            profiles, and event logging) with client-side localStorage
            simulation for features like challenge progress and referral history
            that would normally require a more complex backend.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {[
              "E-commerce",
              "Loyalty Program",
              "Gamification",
              "Real-time",
              "Full-stack",
              "Ghana 🇬🇭",
            ].map((t) => (
              <span
                key={t}
                className="rounded-full bg-green-100 px-3 py-1 text-sm font-semibold text-green-900"
              >
                {t}
              </span>
            ))}
          </div>
        </Section>

        <Section id="tech" num="02" title="Tech Stack">
          <Table
            headers={["Layer", "Technology", "Purpose"]}
            rows={[
              [
                "Framework",
                "Next.js 16.2.6 (App Router)",
                "Server components, server actions, routing, SSR/SSG",
              ],
              [
                "Language",
                "TypeScript",
                "Type-safe throughout the entire codebase",
              ],
              [
                "Styling",
                "Tailwind CSS v4",
                "Utility-first CSS; CSS custom properties via var(--token)",
              ],
              [
                "Database & Auth",
                "Supabase (Postgres)",
                "User auth, profiles, event logging, point ledger, achievements",
              ],
              [
                "Supabase Client",
                "@supabase/ssr",
                "Cookie-based sessions; separate browser and server clients",
              ],
              [
                "State Management",
                "Zustand",
                "Shopping cart — items, quantity, subtotal, open/close",
              ],
              [
                "Charts",
                "Chart.js + react-chartjs-2",
                "Spin-to-Win doughnut wheel with custom draw plugin",
              ],
              [
                "Animations",
                "Framer Motion",
                "Page entry animations, section transitions",
              ],
              ["Toasts", "Sonner", "Non-blocking success/error notifications"],
              ["Icons", "lucide-react", "Consistent icon set throughout UI"],
              [
                "Persistence (sim.)",
                "localStorage",
                "Challenge progress, referral history, checkout count",
              ],
              [
                "Deployment",
                "Vercel",
                "Production hosting at migmart.vercel.app",
              ],
            ]}
          />
        </Section>

        <Section id="architecture" num="03" title="Architecture & Routing">
          <Table
            headers={["Route", "Type", "Description"]}
            rows={[
              [
                "/auth",
                "Server + Client",
                "Sign in / Sign up with split-panel layout",
              ],
              [
                "/auth/callback",
                "Server Route Handler",
                "Exchanges Supabase email verification code for a session",
              ],
              [
                "/onboarding",
                "Server + Client",
                "First-time setup: display name, preferences",
              ],
              [
                "/",
                "Server + Client",
                "Main storefront — requires authentication",
              ],
              [
                "/admin",
                "Server",
                "Admin dashboard — requires auth + is_admin flag + session cookie",
              ],
              [
                "/admin/login",
                "Server + Client",
                "Password gate for admin access",
              ],
              ["/docs", "Server (Static)", "This documentation page"],
            ]}
          />
          <h3 className="mb-2 mt-6 font-bold text-gray-900">Key Directories</h3>
          <Table
            headers={["Path", "Contents"]}
            rows={[
              ["app/", "Next.js App Router pages and layouts"],
              ["components/", "All React UI components"],
              [
                "components/ui/",
                "Primitives: Button, Card, Input, ConfirmModal",
              ],
              [
                "lib/",
                "Business logic: products, store, challenges, rewards, badges, referrals, utils",
              ],
              [
                "lib/supabase/",
                "Browser and server Supabase clients, TypeScript types",
              ],
            ]}
          />
        </Section>

        <Section id="auth" num="04" title="Authentication & Onboarding">
          <p>
            Authentication is handled entirely by Supabase Auth using email +
            password. Google and Apple OAuth were removed in favour of a clean,
            simple email-only flow.
          </p>
          <h3 className="mb-2 mt-5 font-bold">Sign Up Flow</h3>
          <Flow
            steps={[
              "Enter name, email, password",
              "Supabase sends verification email",
              "User clicks link → /auth/callback",
              "Session created → /onboarding",
            ]}
          />
          <h3 className="mb-2 mt-5 font-bold">Sign In Flow</h3>
          <Flow
            steps={[
              "Enter email + password",
              "Supabase validates credentials",
              "Profile fetched → / or /onboarding",
            ]}
          />
          <Note>
            <strong>Email verification redirect</strong> is set to{" "}
            <code className="rounded bg-amber-100 px-1 text-xs">
              https://migmart.vercel.app/auth/callback
            </code>{" "}
            — the callback route exchanges the one-time code for a real session
            and upserts the user profile before redirecting.
          </Note>
          <p className="mt-3">
            Sessions are managed via{" "}
            <code className="rounded bg-gray-100 px-1 text-xs text-red-700">
              @supabase/ssr
            </code>{" "}
            cookie-based tokens. Protected routes check for a valid session
            server-side and redirect to{" "}
            <code className="rounded bg-gray-100 px-1 text-xs text-red-700">
              /auth
            </code>{" "}
            if none is found. Sign-out is guarded by a confirmation modal.
          </p>
        </Section>

        <Section id="storefront" num="05" title="Storefront">
          <p>
            The main page is server-rendered, loading the user's profile,
            leaderboard, and achievements from Supabase, then passing them as
            props to the{" "}
            <code className="rounded bg-gray-100 px-1 text-xs text-red-700">
              Storefront
            </code>{" "}
            client component. It is organised into four tabs:
          </p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {[
              [
                "🛍️",
                "Shop",
                "Browse and filter products by category or keyword. Add to cart, view discounts, and checkout.",
              ],
              [
                "🏆",
                "Challenges",
                "Active and weekly challenges that award bonus points when completed.",
              ],
              [
                "🎁",
                "Rewards",
                "Redeem earned points for discounts (GHC 5–25 off) or free grocery items.",
              ],
              [
                "🔗",
                "Referral",
                "Share your unique code. Simulated referral tracking via localStorage.",
              ],
            ].map(([icon, title, desc]) => (
              <div
                key={title}
                className="rounded-xl border border-gray-200 bg-gray-50 p-4"
              >
                <p className="mb-1 text-2xl">{icon}</p>
                <p className="mb-1 font-bold">{title}</p>
                <p className="text-sm text-gray-500">{desc}</p>
              </div>
            ))}
          </div>
          <h3 className="mb-2 mt-6 font-bold">Product Catalogue</h3>
          <p>
            Products are defined statically across 6 categories: Fruits &amp;
            Veggies, Dairy &amp; Eggs, Beverages, Snacks, Bakery, and Household.
            Prices are displayed in Ghanaian Cedis (GH₵).
          </p>
          <h3 className="mb-2 mt-5 font-bold">Shopping Cart</h3>
          <p>
            Managed by a Zustand store — entirely in-memory. The cart drawer
            slides in from the right, supports quantity adjustments and item
            removal, and shows the live subtotal. Checkout is guarded by a
            confirmation modal showing the total and points to be earned.
          </p>
        </Section>

        <Section id="loyalty" num="06" title="Loyalty & Points System">
          <h3 className="mb-2 font-bold">How Points Are Earned</h3>
          <Table
            headers={["Action", "Points Awarded"]}
            rows={[
              ["Checkout", "1 pt per GHC 1 spent (e.g. GHC 45 order → 45 pts)"],
              ["Daily Spin", "25 – 160 pts depending on wheel segment"],
              ["Completing a Challenge", "50 – 150 pts per challenge"],
              ["Referring a friend", "50 pts per successful referral"],
            ]}
          />
          <h3 className="mb-2 mt-6 font-bold">Loyalty Tiers</h3>
          <Table
            headers={["Tier", "Points Required", "Benefits"]}
            rows={[
              ["🥉 Bronze", "0 pts", "Access to spin wheel and basic rewards"],
              [
                "🥈 Silver",
                "700 pts",
                "Silver badge unlocked; higher reward eligibility",
              ],
              ["🥇 Gold", "1,600 pts", "Gold badge unlocked"],
              [
                "💎 VIP",
                "3,000 pts",
                "VIP badge unlocked; full reward catalogue access",
              ],
            ]}
          />
        </Section>

        <Section id="spin" num="07" title="Spin-to-Win Wheel">
          <p>
            An interactive Chart.js Doughnut chart with 8 coloured segments, a
            custom canvas label plugin, and a CSS{" "}
            <code className="rounded bg-gray-100 px-1 text-xs text-red-700">
              transform: rotate()
            </code>{" "}
            animation that lands precisely on the winning segment every time.
          </p>
          <div className="mt-4 grid grid-cols-4 gap-3 sm:grid-cols-8">
            {[
              ["#f97316", "25 pts"],
              ["#ef4444", "30 pts"],
              ["#8b5cf6", "40 pts"],
              ["#22c55e", "50 pts"],
              ["#06b6d4", "75 pts"],
              ["#3b82f6", "100 pts"],
              ["#ec4899", "120 pts"],
              ["#eab308", "160 pts"],
            ].map(([color, label]) => (
              <div key={label} className="flex flex-col items-center gap-1">
                <div
                  className="h-8 w-8 rounded-full"
                  style={{ background: color }}
                />
                <span className="text-xs font-semibold text-gray-700">
                  {label}
                </span>
              </div>
            ))}
          </div>
          <Note className="mt-4">
            Spins are limited by the{" "}
            <code className="rounded bg-amber-100 px-1 text-xs">
              spins_available
            </code>{" "}
            field in the user&apos;s profile. Once they run out, the button is
            disabled.
          </Note>
        </Section>

        <Section id="challenges" num="08" title="Challenges">
          <p>
            Progress is tracked in localStorage (simulated for presentation).
            Both evergreen and weekly challenges are supported.
          </p>
          <Table
            headers={["Challenge", "Goal", "Reward", "Type"]}
            rows={[
              [
                "🛒 First Basket",
                "Spend GHC 50 in one checkout",
                "80 pts",
                "Evergreen",
              ],
              [
                "🎡 Spin Addict",
                "Spin the wheel 3 times",
                "60 pts",
                "Evergreen",
              ],
              [
                "🏪 Regular Shopper",
                "Complete 3 checkouts",
                "100 pts",
                "Evergreen",
              ],
              [
                "🎁 Reward Hunter",
                "Redeem a reward from the catalogue",
                "50 pts",
                "Evergreen",
              ],
              [
                "💸 Big Spender",
                "Spend GHC 200+ in one order",
                "150 pts",
                "Weekly",
              ],
              ["🔗 Referral Starter", "Refer 1 friend", "75 pts", "Weekly"],
              ["🎰 Spin Master", "Spin 5 times in a week", "90 pts", "Weekly"],
              ["💎 Loyal Customer", "Make 5 checkouts", "120 pts", "Weekly"],
            ]}
          />
        </Section>

        <Section id="rewards" num="09" title="Reward Catalog">
          <Table
            headers={["Reward", "Cost", "Type"]}
            rows={[
              ["🏷️ GHC 5 Off", "75 pts", "Checkout discount"],
              ["💵 GHC 10 Off", "150 pts", "Checkout discount"],
              ["💳 GHC 25 Off", "300 pts", "Checkout discount"],
              ["🥑 Free Avocados", "120 pts", "Free item"],
              ["🍞 Free Sourdough", "100 pts", "Free item"],
              ["🎰 Bonus Spin", "50 pts", "Extra spin"],
            ]}
          />
        </Section>

        <Section id="badges" num="10" title="Badges & Achievements">
          <p>
            Badges are permanently unlocked by completing specific actions,
            stored in Supabase, and visible in the Achievements panel. Locked
            badges appear greyed out to motivate completion.
          </p>
          <div className="mt-4 divide-y divide-gray-100 rounded-xl border border-gray-200">
            {[
              ["🎡", "First Spin", "Spin the wheel for the first time"],
              ["💥", "Big Win", "Win 120+ points in a single spin"],
              ["🎁", "Reward Hunter", "Redeem any reward from the catalogue"],
              ["🛒", "First Purchase", "Complete your first checkout"],
              ["💰", "Big Spender", "Check out with GHC 200 or more"],
              ["🏪", "Regular Shopper", "Complete 3 checkouts total"],
              ["🥈", "Silver Member", "Reach Silver tier (700 pts)"],
              ["🥇", "Gold Member", "Reach Gold tier (1,600 pts)"],
              ["💎", "VIP Member", "Reach VIP tier (3,000 pts)"],
              ["🔗", "Referral Master", "Refer 3 or more friends"],
              ["🏅", "Challenge Master", "Complete 5 or more challenges"],
            ].map(([icon, title, desc]) => (
              <div key={title} className="flex items-center gap-3 px-4 py-3">
                <span className="text-2xl">{icon}</span>
                <div>
                  <p className="font-semibold text-gray-900">{title}</p>
                  <p className="text-xs text-gray-500">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </Section>

        <Section id="referrals" num="11" title="Referral System">
          <p>
            Each user gets a unique referral code generated from their user ID
            and display name. Referrals are simulated via localStorage for
            presentation purposes.
          </p>
          <Flow
            steps={[
              "User copies their code",
              "Enters a friend's name to simulate invite",
              "50 pts awarded + referral logged",
              "Referral appears in history",
            ]}
          />
        </Section>

        <Section id="leaderboard" num="12" title="Leaderboard">
          <p>
            A ranked list of top shoppers by points, fetched server-side from
            Supabase. Key UX details:
          </p>
          <ul className="mt-3 space-y-2 text-sm text-gray-700">
            {[
              "Top 3 receive medal icons (🥇 🥈 🥉)",
              'The current user is labelled "(you)" for context',
              "A contextual hint shows how many points the user is behind the next rank",
              "Users can opt out of visibility — their entry is hidden from other users",
            ].map((item) => (
              <li key={item} className="flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-green-600" />
                {item}
              </li>
            ))}
          </ul>
        </Section>

        <Section id="admin" num="13" title="Admin Dashboard">
          <p>
            Protected admin area at{" "}
            <code className="rounded bg-gray-100 px-1 text-xs text-red-700">
              /admin
            </code>
            . Access requires two checks:
          </p>
          <ol className="mt-3 space-y-2 text-sm text-gray-700">
            {[
              "A valid admin_session httpOnly cookie set by the password gate (/admin/login)",
              "The user's Supabase profile must have is_admin = true",
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-green-700 text-xs font-bold text-white">
                  {i + 1}
                </span>
                {item}
              </li>
            ))}
          </ol>
          <p className="mt-4">
            The admin password is stored as an environment variable (
            <code className="rounded bg-gray-100 px-1 text-xs text-red-700">
              ADMIN_PASSWORD
            </code>
            ) and never exposed to the client. The session cookie expires after
            8 hours.
          </p>
        </Section>

        <Section id="data" num="14" title="Data Layer">
          <h3 className="mb-2 font-bold">Supabase Tables</h3>
          <Table
            headers={["Table", "Key Columns", "Purpose"]}
            rows={[
              [
                "profiles",
                "user_id, display_name, points, tier, spins_available, is_admin",
                "Core user state",
              ],
              [
                "user_events",
                "user_id, event_type, payload",
                "Audit log of all significant actions",
              ],
              [
                "spin_events",
                "user_id, reward_points, reward_type, metadata",
                "Records each wheel spin outcome",
              ],
              [
                "point_ledger",
                "user_id, points_change, reason, metadata",
                "Full log of all point transactions",
              ],
              [
                "user_achievements",
                "user_id, achievement_key, unlocked_at",
                "Unlocked badge records",
              ],
              [
                "achievements",
                "key, title, description",
                "Badge definitions reference table",
              ],
            ]}
          />
          <h3 className="mb-2 mt-6 font-bold">Client vs. Server Storage</h3>
          <Table
            headers={["Data", "Storage", "Why"]}
            rows={[
              [
                "User profile, points, tier",
                "Supabase",
                "Persistent, real-time, multi-device",
              ],
              ["Badge unlocks", "Supabase (via RPC)", "Permanent record"],
              [
                "Challenge progress",
                "localStorage",
                "Simulated for presentation",
              ],
              [
                "Referral history",
                "localStorage",
                "Simulated for presentation",
              ],
              ["Checkout count", "localStorage", "Simulated for presentation"],
              [
                "Shopping cart",
                "Zustand (in-memory)",
                "Session-only, no persistence needed",
              ],
            ]}
          />
        </Section>
      </div>

      {/* Footer */}
      <div className="bg-gray-900 px-6 py-8 text-center text-sm text-gray-400">
        <strong className="text-white">MigMart</strong> &nbsp;·&nbsp; Built with
        Next.js, Supabase &amp; Tailwind CSS &nbsp;·&nbsp; migmart.vercel.app
      </div>
    </div>
  );
}

/* ── Shared sub-components ── */

function Section({
  id,
  num,
  title,
  children,
}: {
  id: string;
  num: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="mb-14 scroll-mt-8">
      <div className="mb-5 flex items-center gap-3 border-b-2 border-green-100 pb-3">
        <span className="rounded-md bg-green-700 px-2 py-0.5 text-xs font-bold text-white">
          {num}
        </span>
        <h2 className="text-2xl font-extrabold text-gray-900">{title}</h2>
      </div>
      <div className="space-y-3 text-gray-700">{children}</div>
    </section>
  );
}

function Table({ headers, rows }: { headers: string[]; rows: string[][] }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-green-900 text-left text-white">
            {headers.map((h) => (
              <th key={h} className="px-4 py-2.5 font-semibold">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className={i % 2 === 1 ? "bg-gray-50" : "bg-white"}>
              {row.map((cell, j) => (
                <td
                  key={j}
                  className={`px-4 py-2.5 align-top ${j === 0 ? "font-semibold text-green-900" : "text-gray-600"}`}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Flow({ steps }: { steps: string[] }) {
  return (
    <div className="mt-3 flex flex-wrap items-center gap-1">
      {steps.map((step, i) => (
        <div key={i} className="flex items-center gap-1">
          <span className="rounded-lg bg-green-700 px-3 py-1.5 text-xs font-semibold text-white">
            {step}
          </span>
          {i < steps.length - 1 && <span className="text-gray-400">→</span>}
        </div>
      ))}
    </div>
  );
}

function Note({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-r-lg border-l-4 border-amber-400 bg-amber-50 px-4 py-3 text-sm text-amber-900 ${className}`}
    >
      {children}
    </div>
  );
}
