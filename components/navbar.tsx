"use client";

import { useState } from "react";
import { ShoppingCart, ShieldCheck, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ConfirmModal } from "@/components/ui/confirm-modal";
import { useCartStore } from "@/lib/store";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

type NavbarProps = {
  displayName: string;
  isAdmin: boolean;
};

export function Navbar({ displayName, isAdmin }: NavbarProps) {
  const router = useRouter();
  const { toggleCart, items } = useCartStore();

  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const handleSignOut = async () => {
    const supabase = createSupabaseBrowserClient();
    await supabase.auth.signOut();
    router.replace("/auth");
  };

  return (
    <>
    <header className="sticky top-0 z-40 border-b border-black/10 bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-(--green-700) px-2 py-1 font-heading text-lg text-white">
            Migmart
          </div>
          <p className="hidden text-sm text-(--ink-500) sm:block">
            Welcome back, <span className="font-semibold text-(--ink-900)">{displayName}</span>
          </p>
        </div>

        <div className="flex items-center gap-2">
          {isAdmin ? (
            <Button variant="secondary" onClick={() => router.push("/admin")}>
              <ShieldCheck className="mr-2 h-4 w-4" />
              Admin
            </Button>
          ) : null}

          <Button variant="secondary" onClick={toggleCart}>
            <ShoppingCart className="mr-2 h-4 w-4" />
            Cart ({cartCount})
          </Button>

          <Button variant="ghost" onClick={() => setShowLogoutModal(true)}>
            <LogOut className="mr-2 h-4 w-4" />
            Sign out
          </Button>
        </div>
      </div>
    </header>

    <ConfirmModal
      open={showLogoutModal}
      title="Sign out?"
      description="You'll need to sign back in to access your account and rewards."
      confirmLabel="Sign out"
      cancelLabel="Stay logged in"
      destructive
      onConfirm={handleSignOut}
      onCancel={() => setShowLogoutModal(false)}
    />
    </>
  );
}
